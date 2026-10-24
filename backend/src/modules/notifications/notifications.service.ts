import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Resend } from 'resend';
import axios from 'axios';
import AfricasTalking from 'africastalking';

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
  private readonly resend: Resend | null;
  private readonly sms: any;
  private readonly waToken: string | null;
  private readonly waPhoneId: string | null;

  constructor(private readonly prisma: PrismaService) {
    this.resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;

    if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
      const at = AfricasTalking({
        apiKey: process.env.AT_API_KEY,
        username: process.env.AT_USERNAME,
      });
      this.sms = at.SMS;
    }

    this.waToken = process.env.WHATSAPP_TOKEN || null;
    this.waPhoneId = process.env.WHATSAPP_PHONE_ID || null;
  }

  // ─── Core send dispatcher ─────────────────────────────────────────────────

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

    let status = 'sent';
    try {
      if (params.channel === 'sms' && params.phone) {
        await this.sendSms(params.phone, params.body);
      } else if (params.channel === 'email' && params.email) {
        await this.sendEmail(params.email, params.subject || 'Msingi Notification', params.body);
      } else if (params.channel === 'whatsapp' && params.phone) {
        await this.sendWhatsApp(params.phone, params.body);
      } else {
        this.logger.log(
          `[${params.channel.toUpperCase()}] ${params.type} → ${params.phone || params.email}: ${params.body.slice(0, 100)}`,
        );
      }
    } catch (err) {
      this.logger.error(`Notification send failed: ${err}`);
      status = 'failed';
    }

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: { status, sentAt: new Date() },
    });

    return notification;
  }

  // ─── WhatsApp via Meta Cloud API ────────────────────────────────────────

  private async sendWhatsApp(phone: string, message: string) {
    if (!this.waToken || !this.waPhoneId) {
      this.logger.warn('WhatsApp not configured — falling back to SMS');
      return this.sendSms(phone, message);
    }
    const to = this.formatKenyanPhone(phone).replace('+', '');
    try {
      const res = await axios.post(
        `https://graph.facebook.com/v19.0/${this.waPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.waToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(`WhatsApp sent to ${to}: ${res.data?.messages?.[0]?.id}`);
    } catch (err: any) {
      this.logger.error(`WhatsApp failed: ${err?.response?.data?.error?.message || err}`);
      // Fallback to SMS on WhatsApp failure
      await this.sendSms(phone, message);
    }
  }

  // ─── SMS via Africa's Talking ─────────────────────────────────────────────

  private async sendSms(phone: string, message: string) {
    if (!this.sms) {
      this.logger.warn('Africa\'s Talking not configured — SMS skipped');
      return;
    }
    const to = this.formatKenyanPhone(phone);
    const result = await this.sms.send({
      to: [to],
      message,
      from: process.env.AT_SENDER_ID || undefined,
    });
    this.logger.log(`SMS sent to ${to}: ${JSON.stringify(result)}`);
    return result;
  }

  // ─── Email via Resend ─────────────────────────────────────────────────────

  private async sendEmail(to: string, subject: string, body: string) {
    if (!this.resend) {
      this.logger.warn('Resend not configured — email skipped');
      return;
    }
    const result = await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'Msingi <noreply@msingi.co.ke>',
      to,
      subject,
      html: this.wrapEmailHtml(body),
    });
    this.logger.log(`Email sent to ${to}: ${JSON.stringify(result)}`);
    return result;
  }

  // ─── Convenience methods ──────────────────────────────────────────────────

  async sendOrderConfirmation(orderId: string, phone: string, email: string | null, orderNumber: string, total: number) {
    const smsBody = `Msingi: Order ${orderNumber} confirmed! Total: KES ${total.toLocaleString()}. We'll notify you when it ships. Thank you!`;
    const emailBody = `<p>Your order <strong>${orderNumber}</strong> has been confirmed.</p><p>Total: <strong>KES ${total.toLocaleString()}</strong></p><p>We will send you tracking details once your order ships.</p>`;

    const tasks = [
      this.send({ phone, channel: 'sms', type: 'order_confirmation', body: smsBody, templateData: { orderId, orderNumber, total } }),
    ];
    if (email) {
      tasks.push(this.send({ email, channel: 'email', type: 'order_confirmation', subject: `Order ${orderNumber} Confirmed`, body: emailBody, templateData: { orderId, orderNumber, total } }));
    }
    return Promise.allSettled(tasks);
  }

  async sendOrderShipped(phone: string, email: string | null, orderNumber: string, trackingNumber?: string) {
    const track = trackingNumber ? ` Track: ${trackingNumber}` : '';
    const smsBody = `Msingi: Order ${orderNumber} shipped!${track} Expected delivery: 2-4 days.`;
    const emailBody = `<p>Your order <strong>${orderNumber}</strong> has been shipped!</p>${trackingNumber ? `<p>Tracking: <strong>${trackingNumber}</strong></p>` : ''}`;
    const tasks = [
      this.send({ phone, channel: 'sms', type: 'order_shipped', body: smsBody }),
    ];
    if (email) tasks.push(this.send({ email, channel: 'email', type: 'order_shipped', subject: `Order ${orderNumber} Shipped`, body: emailBody }));
    return Promise.allSettled(tasks);
  }

  async sendPaymentReceived(phone: string, email: string | null, orderNumber: string, amount: number, mpesaRef: string) {
    const smsBody = `Msingi: Payment KES ${amount.toLocaleString()} received. Order: ${orderNumber}. M-PESA Ref: ${mpesaRef}. Thank you!`;
    const emailBody = `<p>We received your payment of <strong>KES ${amount.toLocaleString()}</strong> for order <strong>${orderNumber}</strong>.</p><p>M-PESA Reference: <strong>${mpesaRef}</strong></p>`;
    const tasks = [
      this.send({ phone, channel: 'sms', type: 'payment_received', body: smsBody }),
    ];
    if (email) tasks.push(this.send({ email, channel: 'email', type: 'payment_received', subject: 'Payment Received', body: emailBody }));
    return Promise.allSettled(tasks);
  }

  async sendPaymentFailed(phone: string, orderNumber: string) {
    return this.send({
      phone,
      channel: 'sms',
      type: 'payment_failed',
      body: `Msingi: Payment for order ${orderNumber} failed. Please retry at your order page or contact support.`,
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

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private formatKenyanPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return `+254${cleaned.slice(1)}`;
    if (cleaned.startsWith('254')) return `+${cleaned}`;
    if (cleaned.startsWith('+254')) return cleaned;
    return `+254${cleaned}`;
  }

  private wrapEmailHtml(body: string): string {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b">
      <div style="border-bottom:2px solid #0ea5e9;padding-bottom:16px;margin-bottom:24px">
        <h2 style="margin:0;color:#0ea5e9">Msingi Commerce</h2>
      </div>
      ${body}
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8">
        <p>Msingi Commerce Framework — The Commerce Foundation for African Business</p>
      </div>
    </body></html>`;
  }
}
