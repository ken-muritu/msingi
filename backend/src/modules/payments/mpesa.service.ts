import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

export interface StkPushResult {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkQueryResult {
  ResponseCode: string;
  ResultCode: string;
  ResultDesc: string;
}

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private readonly isSandbox: boolean;
  private readonly baseUrl: string;
  private readonly shortcode: string;
  private readonly passkey: string;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly callbackUrl: string;

  constructor() {
    this.isSandbox = (process.env.MPESA_ENV || 'sandbox') === 'sandbox';
    this.baseUrl = this.isSandbox
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
    this.shortcode = process.env.MPESA_SHORTCODE || '174379';
    this.passkey = process.env.MPESA_PASSKEY || '';
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || '';
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
    this.callbackUrl =
      process.env.MPESA_CALLBACK_URL ||
      'https://your-domain.com/api/v1/payments/mpesa/callback';
  }

  // ─── Access Token ─────────────────────────────────────────────────────────

  async getAccessToken(): Promise<string> {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new BadRequestException('M-PESA credentials not configured');
    }
    const credentials = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString('base64');

    const response = await axios.get(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${credentials}` } },
    );

    return response.data.access_token;
  }

  // ─── STK Push ─────────────────────────────────────────────────────────────

  async stkPush(params: {
    phone: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
  }): Promise<StkPushResult> {
    const accessToken = await this.getAccessToken();
    const { timestamp, password } = this.generatePassword();
    const phone = this.formatPhone(params.phone);

    this.logger.log(
      `Initiating STK Push: phone=${phone}, amount=${params.amount}, ref=${params.accountReference}`,
    );

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(params.amount),
      PartyA: phone,
      PartyB: this.shortcode,
      PhoneNumber: phone,
      CallBackURL: this.callbackUrl,
      AccountReference: params.accountReference.slice(0, 12),
      TransactionDesc: params.transactionDesc.slice(0, 13),
    };

    const response = await axios.post(
      `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (response.data.ResponseCode !== '0') {
      throw new BadRequestException(
        `M-PESA STK Push failed: ${response.data.ResponseDescription}`,
      );
    }

    return response.data;
  }

  // ─── STK Query ────────────────────────────────────────────────────────────

  async stkQuery(checkoutRequestId: string): Promise<StkQueryResult> {
    const accessToken = await this.getAccessToken();
    const { timestamp, password } = this.generatePassword();

    const response = await axios.post(
      `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return response.data;
  }

  // ─── B2C Reversal ─────────────────────────────────────────────────────────

  async reverse(params: {
    transactionId: string;
    amount: number;
    receiverPhone: string;
    remarks: string;
  }) {
    const accessToken = await this.getAccessToken();
    const securityCredential = this.generateSecurityCredential();

    const response = await axios.post(
      `${this.baseUrl}/mpesa/reversal/v1/request`,
      {
        Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
        SecurityCredential: securityCredential,
        CommandID: 'TransactionReversal',
        TransactionID: params.transactionId,
        Amount: params.amount,
        ReceiverParty: this.shortcode,
        RecieverIdentifierType: '11',
        ResultURL: `${this.callbackUrl}/reversal`,
        QueueTimeOutURL: `${this.callbackUrl}/timeout`,
        Remarks: params.remarks.slice(0, 100),
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return response.data;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  generatePassword(): { timestamp: string; password: string } {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);
    const raw = `${this.shortcode}${this.passkey}${timestamp}`;
    const password = Buffer.from(raw).toString('base64');
    return { timestamp, password };
  }

  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return `254${cleaned.slice(1)}`;
    if (cleaned.startsWith('254')) return cleaned;
    if (cleaned.startsWith('+254')) return cleaned.slice(1);
    return `254${cleaned}`;
  }

  private generateSecurityCredential(): string {
    const cert = process.env.MPESA_SECURITY_CERT || '';
    if (!cert) return '';
    const password = process.env.MPESA_INITIATOR_PASSWORD || '';
    const buffer = Buffer.from(password);
    return crypto
      .publicEncrypt({ key: cert, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, buffer)
      .toString('base64');
  }

  validateCallback(body: any): {
    success: boolean;
    checkoutRequestId: string;
    mpesaReceiptNumber?: string;
    amount?: number;
    phoneNumber?: string;
    transactionDate?: string;
    resultCode: number;
    resultDesc: string;
  } {
    const callback = body?.Body?.stkCallback;
    if (!callback) {
      return { success: false, checkoutRequestId: '', resultCode: -1, resultDesc: 'Invalid callback' };
    }

    const resultCode = Number(callback.ResultCode);
    const resultDesc = callback.ResultDesc || '';
    const checkoutRequestId = callback.CheckoutRequestID || '';
    const items: any[] = callback.CallbackMetadata?.Item || [];

    const getItem = (name: string) => items.find((i: any) => i.Name === name)?.Value;

    return {
      success: resultCode === 0,
      checkoutRequestId,
      resultCode,
      resultDesc,
      mpesaReceiptNumber: getItem('MpesaReceiptNumber'),
      amount: getItem('Amount'),
      phoneNumber: String(getItem('PhoneNumber') || ''),
      transactionDate: String(getItem('TransactionDate') || ''),
    };
  }
}
