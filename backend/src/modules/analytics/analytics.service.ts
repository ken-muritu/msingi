import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PostHog } from 'posthog-node';

@Injectable()
export class AnalyticsService implements OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly client: PostHog | null;
  private readonly enabled: boolean;

  constructor() {
    const apiKey = process.env.POSTHOG_API_KEY;
    this.enabled = !!apiKey && process.env.NODE_ENV === 'production';

    if (this.enabled && apiKey) {
      this.client = new PostHog(apiKey, {
        host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
        flushAt: 20,
        flushInterval: 10000,
      });
      this.logger.log('PostHog analytics enabled');
    } else {
      this.client = null;
      if (process.env.NODE_ENV !== 'test') {
        this.logger.log('PostHog analytics disabled (dev/no key)');
      }
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.shutdown();
  }

  // ─── Core capture ─────────────────────────────────────────────────────────

  capture(params: {
    distinctId: string;
    event: string;
    properties?: Record<string, any>;
  }) {
    if (!this.client) return;
    this.client.capture({
      distinctId: params.distinctId,
      event: params.event,
      properties: {
        $lib: 'msingi-backend',
        ...params.properties,
      },
    });
  }

  // ─── Commerce events ──────────────────────────────────────────────────────

  trackOrderCreated(params: {
    userId: string | null;
    orderId: string;
    orderNumber: string;
    total: number;
    itemCount: number;
    paymentMethod: string;
    county: string;
  }) {
    this.capture({
      distinctId: params.userId || `guest-${params.orderId}`,
      event: 'order_created',
      properties: {
        order_id: params.orderId,
        order_number: params.orderNumber,
        revenue: params.total,
        item_count: params.itemCount,
        payment_method: params.paymentMethod,
        county: params.county,
        currency: 'KES',
      },
    });
  }

  trackPaymentSuccess(params: {
    userId: string | null;
    orderId: string;
    amount: number;
    mpesaRef: string;
  }) {
    this.capture({
      distinctId: params.userId || `guest-${params.orderId}`,
      event: 'payment_success',
      properties: {
        order_id: params.orderId,
        amount: params.amount,
        mpesa_ref: params.mpesaRef,
        currency: 'KES',
        provider: 'mpesa',
      },
    });
  }

  trackPaymentFailed(params: {
    userId: string | null;
    orderId: string;
    resultCode: number;
    resultDesc: string;
  }) {
    this.capture({
      distinctId: params.userId || `guest-${params.orderId}`,
      event: 'payment_failed',
      properties: {
        order_id: params.orderId,
        result_code: params.resultCode,
        result_desc: params.resultDesc,
        provider: 'mpesa',
      },
    });
  }

  trackUserRegistered(userId: string, method: string) {
    this.capture({
      distinctId: userId,
      event: 'user_registered',
      properties: { auth_method: method },
    });
  }

  trackProductViewed(params: {
    userId: string | null;
    productId: string;
    productName: string;
    price: number;
    category: string;
  }) {
    this.capture({
      distinctId: params.userId || 'anonymous',
      event: 'product_viewed',
      properties: {
        product_id: params.productId,
        product_name: params.productName,
        price: params.price,
        category: params.category,
        currency: 'KES',
      },
    });
  }

  trackSearch(params: {
    userId: string | null;
    query: string;
    resultCount: number;
    processingTimeMs: number;
  }) {
    this.capture({
      distinctId: params.userId || 'anonymous',
      event: 'search_performed',
      properties: {
        query: params.query,
        result_count: params.resultCount,
        processing_time_ms: params.processingTimeMs,
      },
    });
  }

  trackSellerRegistered(sellerId: string, userId: string, businessName: string) {
    this.capture({
      distinctId: userId,
      event: 'seller_registered',
      properties: {
        seller_id: sellerId,
        business_name: businessName,
      },
    });
  }
}
