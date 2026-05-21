import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Channel = 'whatsapp' | 'sms' | 'email' | 'push';
type NotificationType =
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'payment_received'
  | 'payment_failed'
  | 'review_request'
  | 'price_drop'
  | 'back_in_stock'
  | 'cart_recovery'
  | 'promotional';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async send(params: {
    userId?: string;
    phone?: string;
    email?: string;
    channel: Channel;
    type: NotificationType;
    subject?: string;
    body: string;
    templateData?: Record<string, unknown>;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: params.userId,
        phone: params.phone,
        email: params.email,
        channel: params.channel,
        type: params.type,
        subject: params.subject,
        body: params.body,
        templateData: params.templateData as any,
        status: 'queued',
      },
    });

    // In production: dispatch to BullMQ queue for async processing
    // await this.notificationQueue.add('send', { notificationId: notification.id });

    // For now: log and mark as sent
    this.logger.log(
      `[${params.channel.toUpperCase()}] ${params.type} → ${params.phone || params.email}: ${params.body.slice(0, 80)}...`,
    );

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: { status: 'sent', sentAt: new Date() },
    });

    return notification;
  }

  async sendOrderConfirmation(orderId: string, phone: string, orderNumber: string, total: number) {
    return this.send({
      phone,
      channel: 'whatsapp',
      type: 'order_confirmation',
      body: `✅ Order ${orderNumber} confirmed! Total: KES ${total.toLocaleString()}. We'll notify you when it ships.`,
      templateData: { orderId, orderNumber, total },
    });
  }

  async sendOrderShipped(phone: string, orderNumber: string, trackingNumber?: string) {
    const trackingMsg = trackingNumber ? ` Track: ${trackingNumber}` : '';
    return this.send({
      phone,
      channel: 'whatsapp',
      type: 'order_shipped',
      body: `📦 Order ${orderNumber} has been shipped!${trackingMsg} You'll receive it soon.`,
      templateData: { orderNumber, trackingNumber },
    });
  }

  async sendPaymentReceived(phone: string, orderNumber: string, amount: number, mpesaRef: string) {
    return this.send({
      phone,
      channel: 'sms',
      type: 'payment_received',
      body: `Payment of KES ${amount.toLocaleString()} received for order ${orderNumber}. M-PESA Ref: ${mpesaRef}. Thank you!`,
      templateData: { orderNumber, amount, mpesaRef },
    });
  }

  async getUserNotifications(userId: string, page = 1, pageSize = 20) {
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return { data: notifications, total, page, pageSize };
  }
}
