// ─── Msingi Commerce Entity Types ─────────────────────────────────────────────
// Generic commerce primitives. No vertical-specific fields.
// Vertical specifics live in product.attributes (JSONB).

import type { SellerBadge } from './config';

// ─── Users & Auth ───────────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'seller' | 'admin' | 'super_admin';
export type AuthProvider = 'phone' | 'email' | 'google' | 'apple';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  authProvider: AuthProvider;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sellers ────────────────────────────────────────────────────────────────

export type SellerStatus = 'pending' | 'active' | 'suspended' | 'deactivated';

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  badge: SellerBadge;
  status: SellerStatus;
  verified: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  productCount: number;
  location: string;
  county: string;
  responseTime: string;
  commissionRate: number;
  mpesaPaybill?: string;
  bankAccount?: string;
  kycDocuments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Categories ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  productCount: number;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

// ─── Products ───────────────────────────────────────────────────────────────

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string; // e.g. "256GB / Titanium Black"
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockCount: number;
  attributes: Record<string, string>; // { color: "Black", storage: "256GB" }
  images?: ProductImage[];
  isActive: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  categoryId: string;
  status: ProductStatus;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  features: string[];
  attributes: Record<string, unknown>; // JSONB — vertical-specific data
  specifications: Record<string, string>;
  tags: string[];
  warranty?: string;
  weight?: number; // grams
  dimensions?: { length: number; width: number; height: number }; // cm
  requiresInstallation: boolean;
  installationFee?: number;
  bnplAvailable: boolean;
  monthlyInstallment?: number;
  rating: number;
  reviewCount: number;
  stockCount: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleEndsAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  deliveryEstimate: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Inventory ──────────────────────────────────────────────────────────────

export type InventoryAction =
  | 'restock'
  | 'sale'
  | 'return'
  | 'adjustment'
  | 'reservation'
  | 'reservation_release';

export interface InventoryLog {
  id: string;
  productId: string;
  variantId?: string;
  action: InventoryAction;
  quantity: number; // positive = add, negative = subtract
  previousStock: number;
  newStock: number;
  reference?: string; // orderId, adjustmentId, etc.
  note?: string;
  createdAt: Date;
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'mpesa' | 'card' | 'cash_on_delivery' | 'bnpl';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  sellerId: string;
  name: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderAddress {
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  postalCode?: string;
  country: string;
  deliveryInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  mpesaTransactionId?: string;
  mpesaReceiptNumber?: string;
  cardTransactionId?: string;
  courierProvider?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId?: string;
  rating: number; // 1-5
  title: string;
  body: string;
  images?: string[];
  videoUrl?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  sellerResponse?: string;
  sellerResponseAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Payments ───────────────────────────────────────────────────────────────

export type TransactionType =
  | 'payment'
  | 'refund'
  | 'payout'
  | 'commission'
  | 'fee';

export type TransactionStatus =
  | 'initiated'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'reversed';

export interface Transaction {
  id: string;
  orderId?: string;
  sellerId?: string;
  type: TransactionType;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: TransactionStatus;
  providerRef?: string; // M-PESA receipt, Stripe charge ID, etc.
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notifications ──────────────────────────────────────────────────────────

export type NotificationChannel = 'whatsapp' | 'sms' | 'email' | 'push';
export type NotificationType =
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

export interface Notification {
  id: string;
  userId?: string;
  phone?: string;
  email?: string;
  channel: NotificationChannel;
  type: NotificationType;
  subject?: string;
  body: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  createdAt: Date;
}

// ─── Delivery ───────────────────────────────────────────────────────────────

export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'returned';

export interface Delivery {
  id: string;
  orderId: string;
  courierProvider: string;
  trackingNumber?: string;
  status: DeliveryStatus;
  pickupAddress: OrderAddress;
  deliveryAddress: OrderAddress;
  estimatedPickup?: Date;
  estimatedDelivery?: Date;
  actualPickup?: Date;
  actualDelivery?: Date;
  deliveryFee: number;
  weight?: number;
  notes?: string;
  proofOfDelivery?: string; // image URL
  createdAt: Date;
  updatedAt: Date;
}

// ─── Analytics Events ───────────────────────────────────────────────────────

export type AnalyticsEvent =
  | 'page_view'
  | 'product_viewed'
  | 'product_added_to_cart'
  | 'product_removed_from_cart'
  | 'checkout_started'
  | 'payment_initiated'
  | 'payment_completed'
  | 'order_placed'
  | 'search_performed'
  | 'filter_applied'
  | 'wishlist_added'
  | 'review_submitted'
  | 'share_product';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  userId?: string;
  sessionId: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

// ─── Search ─────────────────────────────────────────────────────────────────

export interface SearchFilters {
  category?: string;
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  attributes?: Record<string, string[]>;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  facets: {
    categories: { name: string; count: number }[];
    brands: { name: string; count: number }[];
    priceRange: { min: number; max: number };
    tags: { name: string; count: number }[];
  };
  query: string;
  processingTimeMs: number;
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}
