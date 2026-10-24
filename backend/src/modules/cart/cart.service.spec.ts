import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';

const MOCK_PRODUCT = {
  id: 'prod-1',
  name: 'Test Product',
  status: 'active',
  price: 1500,
  compareAtPrice: null,
  brand: 'Brand',
  slug: 'test-product',
  stockCount: 10,
  images: [{ url: 'https://example.com/img.jpg', isPrimary: true }],
  seller: { id: 'seller-1', businessName: 'Test Seller', badge: null },
  variants: [],
};

const MOCK_CART = {
  id: 'cart-1',
  userId: 'user-1',
  sessionId: null,
  items: [],
};

const MOCK_CART_ITEM = {
  id: 'item-1',
  cartId: 'cart-1',
  productId: 'prod-1',
  variantId: null,
  quantity: 2,
  product: MOCK_PRODUCT,
};

describe('CartService', () => {
  let service: CartService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      cartItem: {
        update: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        findFirst: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get(PrismaService);
  });

  // ─── resolveCart ────────────────────────────────────────────────────────

  describe('getCart', () => {
    it('throws BadRequestException when neither userId nor sessionId is provided', async () => {
      await expect(service.getCart()).rejects.toThrow(BadRequestException);
    });

    it('creates a new cart when none exists', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.cart.create as jest.Mock).mockResolvedValue({ ...MOCK_CART, items: [] });

      const result = await service.getCart('user-1');

      expect(prisma.cart.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { userId: 'user-1' } }),
      );
      expect(result.id).toBe('cart-1');
      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
    });

    it('returns existing cart with computed totals', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        ...MOCK_CART,
        items: [MOCK_CART_ITEM],
      });

      const result = await service.getCart('user-1');

      expect(result.itemCount).toBe(2);
      expect(result.subtotal).toBe(3000); // 1500 * 2
      expect(result.delivery).toBe(0); // >= 3000 → free
      expect(result.total).toBe(3000);
    });

    it('adds delivery fee when subtotal < 3000', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        ...MOCK_CART,
        items: [{ ...MOCK_CART_ITEM, quantity: 1, product: MOCK_PRODUCT }],
      });

      const result = await service.getCart('user-1');

      expect(result.subtotal).toBe(1500);
      expect(result.delivery).toBe(300);
      expect(result.total).toBe(1800);
    });
  });

  // ─── addItem ────────────────────────────────────────────────────────────

  describe('addItem', () => {
    it('throws NotFoundException for inactive product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        ...MOCK_PRODUCT,
        status: 'inactive',
      });

      await expect(
        service.addItem({ userId: 'user-1', productId: 'prod-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('increments quantity for existing cart item', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(MOCK_PRODUCT);
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
        ...MOCK_CART,
        items: [MOCK_CART_ITEM],
      });
      (prisma.cartItem.update as jest.Mock).mockResolvedValue({});
      // second call after update returns refreshed cart
      (prisma.cart.findUnique as jest.Mock)
        .mockResolvedValueOnce({ ...MOCK_CART, items: [MOCK_CART_ITEM] })
        .mockResolvedValueOnce({ ...MOCK_CART, items: [{ ...MOCK_CART_ITEM, quantity: 3 }] });

      await service.addItem({ userId: 'user-1', productId: 'prod-1', quantity: 1 });

      expect(prisma.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { quantity: 3 } }),
      );
    });

    it('creates new cart item when product not in cart', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(MOCK_PRODUCT);
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ ...MOCK_CART, items: [] });
      (prisma.cartItem.create as jest.Mock).mockResolvedValue({});
      (prisma.cart.findUnique as jest.Mock)
        .mockResolvedValueOnce({ ...MOCK_CART, items: [] })
        .mockResolvedValueOnce({ ...MOCK_CART, items: [MOCK_CART_ITEM] });

      await service.addItem({ userId: 'user-1', productId: 'prod-1' });

      expect(prisma.cartItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ productId: 'prod-1', quantity: 1 }),
        }),
      );
    });
  });

  // ─── updateItem ─────────────────────────────────────────────────────────

  describe('updateItem', () => {
    it('removes item when quantity <= 0', async () => {
      (prisma.cartItem.delete as jest.Mock).mockResolvedValue({});
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ ...MOCK_CART, items: [] });

      await service.updateItem({ userId: 'user-1', itemId: 'item-1', quantity: 0 });

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    });

    it('updates quantity for positive value', async () => {
      (prisma.cartItem.update as jest.Mock).mockResolvedValue({});
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ ...MOCK_CART, items: [] });

      await service.updateItem({ userId: 'user-1', itemId: 'item-1', quantity: 5 });

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });
  });

  // ─── clearCart ──────────────────────────────────────────────────────────

  describe('clearCart', () => {
    it('deletes all items and returns empty result', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ ...MOCK_CART, items: [] });
      (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });

      const result = await service.clearCart('user-1');

      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 'cart-1' } });
      expect(result).toEqual({ success: true, itemCount: 0 });
    });
  });

  // ─── mergeGuestCart ─────────────────────────────────────────────────────

  describe('mergeGuestCart', () => {
    it('does nothing when guest cart is empty', async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ ...MOCK_CART, items: [] });

      await service.mergeGuestCart('session-abc', 'user-1');

      expect(prisma.cartItem.create).not.toHaveBeenCalled();
      expect(prisma.cartItem.update).not.toHaveBeenCalled();
    });

    it('merges guest items into user cart', async () => {
      const guestCart = { id: 'guest-cart', sessionId: 'session-abc', items: [MOCK_CART_ITEM] };
      const userCart = { ...MOCK_CART, items: [] };

      (prisma.cart.findUnique as jest.Mock)
        .mockResolvedValueOnce(guestCart) // guest cart lookup
        .mockResolvedValueOnce(userCart); // resolveCart for user
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.cartItem.create as jest.Mock).mockResolvedValue({});
      (prisma.cart.delete as jest.Mock).mockResolvedValue({});

      await service.mergeGuestCart('session-abc', 'user-1');

      expect(prisma.cartItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ productId: 'prod-1', quantity: 2 }),
        }),
      );
      expect(prisma.cart.delete).toHaveBeenCalledWith({ where: { id: 'guest-cart' } });
    });
  });
});
