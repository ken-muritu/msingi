import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly notifications: NotificationsService,
    private readonly analytics: AnalyticsService,
  ) {}

  async createOrder(data: {
    userId?: string;
    guestEmail?: string;
    guestPhone?: string;
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
    }>;
    shippingAddress: {
      name: string;
      phone: string;
      email?: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      county: string;
      postalCode?: string;
      deliveryInstructions?: string;
    };
    paymentMethod: 'mpesa' | 'card' | 'cash_on_delivery' | 'bnpl';
  }) {
    const orderNumber = `KOR-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

    const createdOrder = await this.prisma.$transaction(async (tx: any) => {
      // 1. Validate and price items from database (NEVER trust frontend prices)
      const orderItems = [];
      let subtotal = 0;

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            seller: { select: { id: true, businessName: true } },
            variants: item.variantId ? { where: { id: item.variantId } } : undefined,
            images: { where: { isPrimary: true }, take: 1 },
          },
        });

        if (!product || product.status !== 'active') {
          throw new BadRequestException(`Product ${item.productId} not available`);
        }

        const variant = item.variantId ? product.variants?.[0] : null;
        const unitPrice = variant?.price ?? product.price;
        const image = product.images?.[0] || '';

        orderItems.push({
          productId: product.id,
          variantId: item.variantId || null,
          sellerId: product.sellerId,
          name: variant ? `${product.name} - ${variant.name}` : product.name,
          sku: variant?.sku || null,
          image: typeof image === 'string' ? image : (image as any).url || '',
          price: unitPrice,
          quantity: item.quantity,
          total: unitPrice * item.quantity,
        });

        subtotal += unitPrice * item.quantity;
      }

      // 2. Calculate totals
      const taxRate = 0.16; // From config in production
      const tax = Math.round(subtotal * taxRate / (1 + taxRate)); // VAT-inclusive
      const deliveryFee = 0; // Calculated by delivery module
      const discount = 0;
      const total = subtotal + deliveryFee - discount;

      // 3. Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId || null,
          guestEmail: data.guestEmail || null,
          guestPhone: data.guestPhone || null,
          subtotal,
          tax,
          deliveryFee,
          discount,
          total,
          status: 'pending',
          paymentMethod: data.paymentMethod,
          paymentStatus: 'pending',
          shippingAddress: data.shippingAddress as any,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // 4. Reserve inventory for each item
      for (const item of orderItems) {
        await this.inventoryService.reserveStock(
          item.productId,
          item.variantId,
          item.quantity,
          order.id,
        );
      }

      return order;
    });

    // Fire order_created notification + analytics (non-blocking)
    const address = data.shippingAddress as any;
    const phone = address?.phone || data.guestPhone || '';
    const email = data.guestEmail || address?.email || null;
    if (phone) {
      this.notifications
        .sendOrderConfirmation(createdOrder.id, phone, email, createdOrder.orderNumber, createdOrder.total)
        .catch(() => null);
    }
    this.analytics.trackOrderCreated({
      userId: data.userId || null,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: createdOrder.total,
      itemCount: data.items.reduce((s, i) => s + i.quantity, 0),
      paymentMethod: data.paymentMethod,
      county: (data.shippingAddress as any).county || '',
    });

    return createdOrder;
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getUserOrders(userId: string, page = 1, pageSize = 20) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { data: orders, total, page, pageSize };
  }

  async updateOrderStatus(orderId: string, status: string) {
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned', 'refunded'],
      returned: ['refunded'],
    };

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const allowedNext = validTransitions[order.status] || [];
    if (!allowedNext.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from '${order.status}' to '${status}'. Allowed: ${allowedNext.join(', ')}`,
      );
    }

    // Release inventory on cancellation
    if (status === 'cancelled') {
      const items = await this.prisma.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await this.inventoryService.releaseStock(
          item.productId,
          item.variantId,
          item.quantity,
          orderId,
        );
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });
  }

  async getSellerOrders(sellerId: string, page = 1, pageSize = 20) {
    const [items, total] = await Promise.all([
      this.prisma.orderItem.findMany({
        where: { sellerId },
        orderBy: { order: { createdAt: 'desc' } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { order: true },
      }),
      this.prisma.orderItem.count({ where: { sellerId } }),
    ]);

    return { data: items, total, page, pageSize };
  }

  async getAllOrders(page = 1, pageSize = 20, status?: string) {
    const where = status ? { status } : {};
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data: orders, total, page, pageSize };
  }
}
