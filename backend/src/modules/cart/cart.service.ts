import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Resolve or create cart ───────────────────────────────────────────────

  private async resolveCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('userId or sessionId required');
    }

    const where = userId ? { userId } : { sessionId };
    let cart = await this.prisma.cart.findUnique({
      where: where as any,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                seller: { select: { id: true, businessName: true, badge: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  seller: { select: { id: true, businessName: true, badge: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  // ─── Get cart ─────────────────────────────────────────────────────────────

  async getCart(userId?: string, sessionId?: string) {
    const cart = await this.resolveCart(userId, sessionId);
    return this.formatCart(cart);
  }

  // ─── Add item ─────────────────────────────────────────────────────────────

  async addItem(params: {
    userId?: string;
    sessionId?: string;
    productId: string;
    variantId?: string;
    quantity?: number;
  }) {
    const { productId, variantId, quantity = 1 } = params;

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== 'active') {
      throw new NotFoundException('Product not available');
    }

    const cart = await this.resolveCart(params.userId, params.sessionId);

    const existing = cart.items.find(
      (i: any) => i.productId === productId && (i.variantId ?? null) === (variantId ?? null),
    );

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId: variantId ?? null, quantity },
      });
    }

    return this.getCart(params.userId, params.sessionId);
  }

  // ─── Update quantity ─────────────────────────────────────────────────────

  async updateItem(params: {
    userId?: string;
    sessionId?: string;
    itemId: string;
    quantity: number;
  }) {
    if (params.quantity <= 0) {
      return this.removeItem({ userId: params.userId, sessionId: params.sessionId, itemId: params.itemId });
    }

    await this.prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity: params.quantity },
    });

    return this.getCart(params.userId, params.sessionId);
  }

  // ─── Remove item ─────────────────────────────────────────────────────────

  async removeItem(params: { userId?: string; sessionId?: string; itemId: string }) {
    await this.prisma.cartItem.delete({ where: { id: params.itemId } });
    return this.getCart(params.userId, params.sessionId);
  }

  // ─── Clear cart ──────────────────────────────────────────────────────────

  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.resolveCart(userId, sessionId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { success: true, itemCount: 0 };
  }

  // ─── Merge guest cart into user cart on login ─────────────────────────────

  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    const userCart = await this.resolveCart(userId);

    for (const guestItem of guestCart.items) {
      const existing = await this.prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: guestItem.productId,
          variantId: guestItem.variantId,
        },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + guestItem.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            quantity: guestItem.quantity,
          },
        });
      }
    }

    await this.prisma.cart.delete({ where: { id: guestCart.id } });
  }

  // ─── Format response ─────────────────────────────────────────────────────

  private formatCart(cart: any) {
    const items = cart.items.map((item: any) => {
      const variant = item.product.variants?.find((v: any) => v.id === item.variantId);
      const price = variant?.price ?? item.product.price;
      const compareAtPrice = variant?.compareAtPrice ?? item.product.compareAtPrice;
      const image = item.product.images?.[0]?.url ?? '';

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.product.name,
        brand: item.product.brand,
        slug: item.product.slug,
        price,
        compareAtPrice,
        image,
        quantity: item.quantity,
        lineTotal: price * item.quantity,
        seller: item.product.seller,
        stockCount: item.product.stockCount,
      };
    });

    const subtotal = items.reduce((s: number, i: any) => s + i.lineTotal, 0);
    const itemCount = items.reduce((s: number, i: any) => s + i.quantity, 0);

    return {
      id: cart.id,
      items,
      itemCount,
      subtotal,
      delivery: subtotal >= 3000 ? 0 : 300,
      total: subtotal + (subtotal >= 3000 ? 0 : 300),
    };
  }
}
