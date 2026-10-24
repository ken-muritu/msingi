import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AnalyticsService } from '../analytics/analytics.service';

const MOCK_PRODUCT = {
  id: 'prod-1',
  name: 'Test Product',
  status: 'active',
  price: 2000,
  sellerId: 'seller-1',
  stockCount: 10,
  seller: { id: 'seller-1', businessName: 'Test Seller' },
  images: [{ url: 'img.jpg', isPrimary: true }],
  variants: [],
};

const MOCK_ORDER = {
  id: 'order-1',
  orderNumber: 'KOR-TEST-ABCD',
  userId: 'user-1',
  guestEmail: null,
  guestPhone: null,
  subtotal: 2000,
  tax: 276,
  deliveryFee: 0,
  discount: 0,
  total: 2000,
  status: 'pending',
  paymentStatus: 'pending',
  paymentMethod: 'mpesa',
  shippingAddress: { name: 'Test User', phone: '0712345678', city: 'Nairobi', county: 'Nairobi', addressLine1: '123 St' },
  items: [{ id: 'item-1', productId: 'prod-1', quantity: 1, price: 2000, total: 2000 }],
  createdAt: new Date(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: jest.Mocked<PrismaService>;
  let inventoryService: jest.Mocked<InventoryService>;
  let notificationsService: jest.Mocked<NotificationsService>;
  let analyticsService: jest.Mocked<AnalyticsService>;

  beforeEach(async () => {
    const mockPrisma = {
      $transaction: jest.fn(),
      order: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      orderItem: {
        findMany: jest.fn(),
      },
    };

    const mockInventory = {
      reserveStock: jest.fn().mockResolvedValue(undefined),
      releaseStock: jest.fn().mockResolvedValue(undefined),
    };

    const mockNotifications = {
      sendOrderConfirmation: jest.fn().mockResolvedValue([]),
      sendOrderShipped: jest.fn().mockResolvedValue([]),
    };

    const mockAnalytics = {
      trackOrderCreated: jest.fn(),
      trackPaymentSuccess: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: InventoryService, useValue: mockInventory },
        { provide: NotificationsService, useValue: mockNotifications },
        { provide: AnalyticsService, useValue: mockAnalytics },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get(PrismaService);
    inventoryService = module.get(InventoryService);
    notificationsService = module.get(NotificationsService);
    analyticsService = module.get(AnalyticsService);
  });

  // ─── createOrder ────────────────────────────────────────────────────────

  describe('createOrder', () => {
    const orderInput = {
      userId: 'user-1',
      items: [{ productId: 'prod-1', quantity: 1 }],
      shippingAddress: {
        name: 'Test User',
        phone: '0712345678',
        addressLine1: '123 St',
        city: 'Nairobi',
        county: 'Nairobi',
      },
      paymentMethod: 'mpesa' as const,
    };

    it('creates order and fires notifications + analytics', async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        const tx = {
          product: { findUnique: jest.fn().mockResolvedValue(MOCK_PRODUCT) },
          order: { create: jest.fn().mockResolvedValue(MOCK_ORDER) },
        };
        return fn(tx);
      });

      const result = await service.createOrder(orderInput);

      expect(result).toEqual(MOCK_ORDER);
      expect(inventoryService.reserveStock).toHaveBeenCalledWith(
        'prod-1', null, 1, 'order-1',
      );
      expect(notificationsService.sendOrderConfirmation).toHaveBeenCalled();
      expect(analyticsService.trackOrderCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          orderId: 'order-1',
          paymentMethod: 'mpesa',
        }),
      );
    });

    it('throws BadRequestException for unavailable product', async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        const tx = {
          product: {
            findUnique: jest.fn().mockResolvedValue({ ...MOCK_PRODUCT, status: 'inactive' }),
          },
          order: { create: jest.fn() },
        };
        return fn(tx);
      });

      await expect(service.createOrder(orderInput)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── getOrderById ───────────────────────────────────────────────────────

  describe('getOrderById', () => {
    it('returns order when found', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(MOCK_ORDER);
      const result = await service.getOrderById('order-1');
      expect(result).toEqual(MOCK_ORDER);
    });

    it('throws NotFoundException when not found', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getOrderById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── updateOrderStatus ──────────────────────────────────────────────────

  describe('updateOrderStatus', () => {
    it('transitions status from pending to confirmed', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(MOCK_ORDER);
      (prisma.order.update as jest.Mock).mockResolvedValue({ ...MOCK_ORDER, status: 'confirmed' });

      const result = await service.updateOrderStatus('order-1', 'confirmed');
      expect(result.status).toBe('confirmed');
    });

    it('throws BadRequestException for invalid transition', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(MOCK_ORDER);

      await expect(
        service.updateOrderStatus('order-1', 'delivered'),
      ).rejects.toThrow(BadRequestException);
    });

    it('releases inventory on cancellation', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(MOCK_ORDER);
      (prisma.orderItem.findMany as jest.Mock).mockResolvedValue(MOCK_ORDER.items);
      (prisma.order.update as jest.Mock).mockResolvedValue({ ...MOCK_ORDER, status: 'cancelled' });

      await service.updateOrderStatus('order-1', 'cancelled');

      expect(inventoryService.releaseStock).toHaveBeenCalledWith(
        'prod-1', undefined, 1, 'order-1',
      );
    });
  });

  // ─── getUserOrders ──────────────────────────────────────────────────────

  describe('getUserOrders', () => {
    it('returns paginated orders', async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([MOCK_ORDER]);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const result = await service.getUserOrders('user-1', 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });
  });
});
