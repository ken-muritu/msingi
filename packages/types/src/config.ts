// ─── Kora Configuration Type System ─────────────────────────────────────────
// Every Kora deployment is driven by a single configuration file.
// This is the definitive schema.

// ─── Verticals ──────────────────────────────────────────────────────────────

export type KoraVertical =
  | 'electronics'
  | 'fashion'
  | 'grocery'
  | 'pharmacy'
  | 'furniture'
  | 'auto-parts'
  | 'marketplace'
  | 'b2b-wholesale'
  | 'custom';

// ─── Business Models ────────────────────────────────────────────────────────

export type BusinessModel = 'solo' | 'marketplace' | 'hybrid';

// ─── Module Toggle Types ────────────────────────────────────────────────────

export type SocialCommerceLevel = 'basic' | 'notifications' | 'full_bot';
export type LoyaltyLevel = 'none' | 'points' | 'points_tiers' | 'full';
export type CardProvider = 'pesapal' | 'stripe' | 'both';
export type PayoutSchedule = 'daily' | 'weekly' | 'biweekly' | 'monthly';
export type SellerVerification = 'manual' | 'automated' | 'hybrid';
export type SellerBadge = 'basic' | 'verified' | 'premium' | 'authorized';

// ─── Instance Configuration ─────────────────────────────────────────────────

export interface KoraInstance {
  name: string;
  slug: string;
  domain: string;
  vertical: KoraVertical;
  tagline?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
}

// ─── Branding ───────────────────────────────────────────────────────────────

export interface KoraBranding {
  logo: string;
  logoDark?: string;
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
    surface?: string;
    error?: string;
    warning?: string;
    success?: string;
  };
  typography: {
    heading: string;
    body: string;
    mono?: string;
  };
  poweredByKora: boolean;
}

// ─── Marketplace Configuration ──────────────────────────────────────────────

export interface KoraMarketplaceConfig {
  defaultCommissionRate: number;
  payoutSchedule: PayoutSchedule;
  sellerVerification: SellerVerification;
  allowSellerStorefronts: boolean;
  allowSellerPromotions: boolean;
  minimumPayoutAmount?: number;
  escrowEnabled?: boolean;
  disputeResolution?: boolean;
}

// ─── Business Configuration ─────────────────────────────────────────────────

export interface KoraBusiness {
  type: BusinessModel;
  currency: string;
  currencySymbol?: string;
  taxRate: number;
  taxInclusivePricing: boolean;
  marketplace?: KoraMarketplaceConfig;
}

// ─── Social Commerce Modules ────────────────────────────────────────────────

export interface KoraSocialModules {
  whatsapp: SocialCommerceLevel | false;
  tiktok: boolean;
  meta: boolean;
  live: boolean;
}

// ─── Module Toggles ─────────────────────────────────────────────────────────

export interface KoraModules {
  core: true; // Always on
  marketplace: boolean;
  bnpl: boolean;
  dispatch: boolean;
  social: KoraSocialModules;
  loyalty: LoyaltyLevel;
  b2b: boolean;
  subscriptions: boolean;
  insights: boolean;
  reviews: boolean;
  live: boolean;
}

// ─── M-PESA Configuration ───────────────────────────────────────────────────

export interface KoraMpesaConfig {
  stkPush: boolean;
  paybill: string;
  lipaMdogoMdogo: boolean;
  minimumBNPLAmount?: number;
  tillNumber?: string;
  consumerKey?: string; // Env var reference
  consumerSecret?: string; // Env var reference
  passKey?: string; // Env var reference
  callbackUrl?: string;
}

// ─── Card Payment Configuration ─────────────────────────────────────────────

export interface KoraCardConfig {
  provider: CardProvider;
  pesapalConsumerKey?: string; // Env var reference
  pesapalConsumerSecret?: string; // Env var reference
  stripePublishableKey?: string; // Env var reference
  stripeSecretKey?: string; // Env var reference
}

// ─── Cash on Delivery ───────────────────────────────────────────────────────

export interface KoraCODConfig {
  enabled: boolean;
  maxOrderValue?: number;
  allowedPostalCodes?: string[];
  allowedCounties?: string[];
}

// ─── Payments ───────────────────────────────────────────────────────────────

export interface KoraPayments {
  mpesa: KoraMpesaConfig;
  cards: KoraCardConfig;
  cashOnDelivery: KoraCODConfig;
}

// ─── Same-Day Delivery ──────────────────────────────────────────────────────

export interface KoraSameDayDelivery {
  enabled: boolean;
  cutoffTime: string; // HH:MM
  zones: string[];
}

// ─── Delivery Configuration ─────────────────────────────────────────────────

export type CourierProvider = 'sendy' | 'fargo' | 'g4s' | 'glovo' | 'bolt' | 'custom';

export interface KoraDelivery {
  couriers: CourierProvider[];
  sameDayDelivery: KoraSameDayDelivery;
  clickAndCollect: boolean;
  installationServices: boolean;
  freeDeliveryThreshold?: number;
  counties?: string[]; // Supported delivery counties
}

// ─── Catalog Configuration ──────────────────────────────────────────────────

export interface KoraCatalog {
  requireKEBSCertification?: boolean;
  enableSerialVerification?: boolean; // IMEI/serial check
  maxComparisonProducts: number;
  enablePriceHistory: boolean;
  enablePriceAlerts: boolean;
  enableWishlist: boolean;
  enableReviews: boolean;
  maxImagesPerProduct?: number;
  allowVideoReviews?: boolean;
}

// ─── Content & Localization ─────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'sw' | 'fr' | 'am' | 'zu' | 'ha' | 'yo' | 'ig';

export interface KoraContent {
  languages: SupportedLanguage[];
  defaultLanguage: SupportedLanguage;
  blog: boolean;
  buyingGuides: boolean;
  comparisonPages: boolean;
  faqEnabled: boolean;
}

// ─── Infrastructure ─────────────────────────────────────────────────────────

export interface KoraInfrastructure {
  search: {
    provider: 'meilisearch' | 'algolia' | 'typesense';
    host?: string;
    apiKey?: string; // Env var reference
  };
  storage: {
    provider: 'cloudflare-r2' | 's3' | 'local';
    bucket?: string;
    region?: string;
  };
  email: {
    provider: 'resend' | 'sendgrid' | 'ses' | 'smtp';
    fromAddress?: string;
    fromName?: string;
  };
  sms: {
    provider: 'africastalking' | 'twilio' | 'infobip';
    senderId?: string;
  };
  analytics: {
    provider: 'posthog' | 'plausible' | 'none';
    projectKey?: string; // Env var reference
  };
}

// ─── SEO Configuration ──────────────────────────────────────────────────────

export interface KoraSEO {
  siteName: string;
  titleTemplate: string; // e.g. "%s | Jenga Electronics"
  defaultDescription: string;
  ogImage?: string;
  twitterHandle?: string;
  structuredData: boolean;
  sitemapEnabled: boolean;
}

// ─── The Master Configuration ───────────────────────────────────────────────

export interface KoraConfig {
  instance: KoraInstance;
  branding: KoraBranding;
  business: KoraBusiness;
  modules: KoraModules;
  payments: KoraPayments;
  delivery: KoraDelivery;
  catalog: KoraCatalog;
  content: KoraContent;
  infrastructure: KoraInfrastructure;
  seo: KoraSEO;
}
