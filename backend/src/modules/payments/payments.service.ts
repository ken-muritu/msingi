import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── M-PESA STK Push ─────────────────────────────────────────────────────

  async initiateMpesaPayment(orderId: string, phone: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    const idempotencyKey = `mpesa-${orderId}-${Date.now()}`;

    // Create transaction record
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
          phone: this.formatKenyanPhone(phone),
          accountReference: order.orderNumber,
        },
      },
    });

    // In production: call Safaricom Daraja API here
    // const stkResponse = await this.darajaClient.stkPush({
    //   BusinessShortCode: process.env.MPESA_SHORTCODE,
    //   Password: base64(shortcode + passkey + timestamp),
    //   Timestamp: timestamp,
    //   TransactionType: 'CustomerPayBillOnline',
    //   Amount: order.total,
    //   PartyA: phone,
    //   PartyB: shortcode,
    //   PhoneNumber: phone,
    //   CallBackURL: `${process.env.API_URL}/api/v1/payments/mpesa/callback`,
    //   AccountReference: order.orderNumber,
    //   TransactionDesc: `Payment for ${order.orderNumber}`,
    // });

    return {
      transactionId: transaction.id,
      checkoutRequestId: `ws_CO_${Date.now()}_${uuidv4().slice(0, 8)}`,
      message: 'STK Push sent. Check your phone to complete payment.',
      status: 'initiated',
    };
  }

  async handleMpesaCallback(callbackData: any) {
    const { Body } = callbackData;
    const resultCode = Body?.stkCallback?.ResultCode;
    const checkoutRequestId = Body?.stkCallback?.CheckoutRequestID;
    const metadata = Body?.stkCallback?.CallbackMetadata?.Item || [];

    const mpesaReceiptNumber = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;

    if (resultCode === 0) {
      // Payment successful
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          metadata: { path: ['checkoutRequestId'], equals: checkoutRequestId },
          status: { in: ['initiated', 'pending'] },
        },
      });

      if (transaction) {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'completed',
            providerRef: mpesaReceiptNumber,
          },
        });

        await this.prisma.order.update({
          where: { id: transaction.orderId! },
          data: {
            paymentStatus: 'paid',
            status: 'confirmed',
            mpesaTransactionId: checkoutRequestId,
            mpesaReceiptNumber,
          },
        });
      }

      return { success: true };
    }

    return { success: false, resultCode };
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

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private formatKenyanPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return `254${cleaned.slice(1)}`;
    if (cleaned.startsWith('254')) return cleaned;
    if (cleaned.startsWith('+254')) return cleaned.slice(1);
    return `254${cleaned}`;
  }
}
