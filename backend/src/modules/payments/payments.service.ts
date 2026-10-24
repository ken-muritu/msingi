import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MpesaService } from './mpesa.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mpesa: MpesaService,
    private readonly notifications: NotificationsService,
    private readonly analytics: AnalyticsService,
  ) {}

  // ─── M-PESA STK Push ─────────────────────────────────────────────────────

  async initiateMpesaPayment(orderId: string, phone: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Order is already paid');
    }

    const idempotencyKey = `mpesa-${orderId}-${Date.now()}`;
    const formattedPhone = this.mpesa.formatPhone(phone);

    // Create pending transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        orderId,
        type: 'payment',
        method: 'mpesa',
        amount: order.total,
        currency: 'KES',
        status: 'initiated',
        idempotencyKey,
        metadata: {
          phone: formattedPhone,
          accountReference: order.orderNumber,
        },
      },
    });

    // Call live Safaricom Daraja STK Push
    const stkResult = await this.mpesa.stkPush({
      phone: formattedPhone,
      amount: order.total,
      accountReference: order.orderNumber,
      transactionDesc: `Pay ${order.orderNumber}`,
    });

    // Store CheckoutRequestID for callback matching
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'pending',
        metadata: {
          phone: formattedPhone,
          accountReference: order.orderNumber,
          checkoutRequestId: stkResult.CheckoutRequestID,
          merchantRequestId: stkResult.MerchantRequestID,
        },
      },
    });

    return {
      transactionId: transaction.id,
      checkoutRequestId: stkResult.CheckoutRequestID,
      merchantRequestId: stkResult.MerchantRequestID,
      message: stkResult.CustomerMessage,
      status: 'pending',
    };
  }

  async queryMpesaStatus(checkoutRequestId: string) {
    const result = await this.mpesa.stkQuery(checkoutRequestId);
    return {
      resultCode: result.ResultCode,
      resultDesc: result.ResultDesc,
      isPaid: result.ResultCode === '0',
    };
  }

  async handleMpesaCallback(callbackData: any) {
    const parsed = this.mpesa.validateCallback(callbackData);
    this.logger.log(`M-PESA Callback: ${JSON.stringify(parsed)}`);

    const { checkoutRequestId, success, mpesaReceiptNumber, amount, resultCode } = parsed;

    // Find the matching transaction by checkoutRequestId stored in JSON metadata
    const transactions = await this.prisma.transaction.findMany({
      where: { status: { in: ['initiated', 'pending'] } },
    });

    const matchedTx = transactions.find(
      (tx: any) => (tx.metadata as any)?.checkoutRequestId === checkoutRequestId,
    );

    if (!matchedTx) {
      this.logger.warn(`No transaction found for checkoutRequestId: ${checkoutRequestId}`);
      return { ResultCode: 0, ResultDesc: 'Accepted' };
    }

    if (success) {
      await this.prisma.transaction.update({
        where: { id: matchedTx.id },
        data: {
          status: 'completed',
          providerRef: mpesaReceiptNumber,
          metadata: {
            ...(matchedTx.metadata as object),
            mpesaReceiptNumber,
            amount,
          },
        },
      });

      if (matchedTx.orderId) {
        const order = await this.prisma.order.update({
          where: { id: matchedTx.orderId },
          data: {
            paymentStatus: 'paid',
            status: 'confirmed',
            mpesaTransactionId: checkoutRequestId,
            mpesaReceiptNumber,
          },
        });

        // Fire payment received notifications
        const address = order.shippingAddress as any;
        const phone = address?.phone || (matchedTx.metadata as any)?.phone || '';
        const email = order.guestEmail || null;
        if (phone) {
          this.notifications
            .sendPaymentReceived(phone, email, order.orderNumber, order.total, mpesaReceiptNumber || '')
            .catch((e) => this.logger.error(`Notification failed: ${e}`));
        }

        // Track analytics
        this.analytics.trackPaymentSuccess({
          userId: order.userId || null,
          orderId: order.id,
          amount: order.total,
          mpesaRef: mpesaReceiptNumber || '',
        });
      }
    } else {
      await this.prisma.transaction.update({
        where: { id: matchedTx.id },
        data: { status: 'failed', metadata: { ...(matchedTx.metadata as object), resultCode } },
      });

      if (matchedTx.orderId) {
        const failedOrder = await this.prisma.order.update({
          where: { id: matchedTx.orderId },
          data: { paymentStatus: 'failed' },
        });
        this.analytics.trackPaymentFailed({
          userId: failedOrder.userId || null,
          orderId: failedOrder.id,
          resultCode: Number(resultCode),
          resultDesc: parsed.resultCode?.toString() || 'failed',
        });
      }
    }

    // Safaricom expects this exact response format
    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }

  // ─── Transaction Queries ──────────────────────────────────────────────────

  async getTransaction(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async getOrderTransactions(orderId: string) {
    return this.prisma.transaction.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async initiateRefund(orderId: string, amount: number, reason?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    const refundTransaction = await this.prisma.transaction.create({
      data: {
        orderId,
        type: 'refund',
        method: order.paymentMethod as any,
        amount,
        currency: 'KES',
        status: 'pending',
        idempotencyKey: `refund-${orderId}-${Date.now()}`,
        metadata: { reason },
      },
    });

    // In production: call M-PESA B2C API or card refund API

    return refundTransaction;
  }

}
