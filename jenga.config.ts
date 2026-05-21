import type { MsingiConfig } from '@msingi/types';

const config: MsingiConfig = {
  // ─── Identity ───────────────────────────────────────────────────────────────
  instance: {
    name: 'Jenga Electronics',
    slug: 'jenga',
    domain: 'jenga.co.ke',
    vertical: 'electronics',
    tagline: "Kenya's Premier Electronics & Appliances Store",
    supportEmail: 'support@jenga.co.ke',
    supportPhone: '+254700000000',
    whatsappNumber: '+254700000000',
  },

  // ─── Branding ─────────────────────────────────────────────────────────────
  branding: {
    logo: '/brand/jenga-logo.svg',
    logoDark: '/brand/jenga-logo-dark.svg',
    favicon: '/brand/jenga-favicon.png',
    colors: {
      primary: '#00A651',    // Safaricom / M-PESA green heritage
      secondary: '#0066CC',  // Tech blue
      accent: '#FF6600',     // Action orange
      background: '#F8FAFC',
      surface: '#FFFFFF',
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#16A34A',
    },
    typography: {
      heading: 'Satoshi',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    poweredByMsingi: false,
  },

  // ─── Business Model ───────────────────────────────────────────────────────
  business: {
    type: 'hybrid',
    currency: 'KES',
    currencySymbol: 'KSh',
    taxRate: 16,
    taxInclusivePricing: true,
    marketplace: {
      defaultCommissionRate: 8.5,
      payoutSchedule: 'weekly',
      sellerVerification: 'automated',
      allowSellerStorefronts: true,
      allowSellerPromotions: true,
      minimumPayoutAmount: 5000,
      escrowEnabled: true,
      disputeResolution: true,
    },
  },

  // ─── Active Modules ───────────────────────────────────────────────────────
  modules: {
    core: true,
    marketplace: true,
    bnpl: true,
    dispatch: true,
    social: {
      whatsapp: 'full_bot',
      tiktok: false,
      meta: true,
      live: false,
    },
    loyalty: 'points_tiers',
    b2b: true,
    subscriptions: false,
    insights: true,
    reviews: true,
    live: false,
  },

  // ─── Payments ─────────────────────────────────────────────────────────────
  payments: {
    mpesa: {
      stkPush: true,
      paybill: '247247',
      lipaMdogoMdogo: true,
      minimumBNPLAmount: 5000,
    },
    cards: {
      provider: 'both',
    },
    cashOnDelivery: {
      enabled: true,
      maxOrderValue: 30000,
      allowedCounties: [
        'Nairobi',
        'Kiambu',
        'Machakos',
        'Kajiado',
        'Mombasa',
        'Kisumu',
        'Nakuru',
      ],
    },
  },

  // ─── Delivery ─────────────────────────────────────────────────────────────
  delivery: {
    couriers: ['sendy', 'fargo', 'g4s'],
    sameDayDelivery: {
      enabled: true,
      cutoffTime: '11:00',
      zones: ['nairobi_cbd', 'westlands', 'kilimani', 'upperhill', 'karen', 'langata'],
    },
    clickAndCollect: true,
    installationServices: true,
    freeDeliveryThreshold: 15000,
    counties: [
      'Nairobi', 'Kiambu', 'Machakos', 'Kajiado', 'Mombasa',
      'Kisumu', 'Nakuru', 'Uasin Gishu', 'Nyeri', 'Meru',
    ],
  },

  // ─── Catalog ──────────────────────────────────────────────────────────────
  catalog: {
    requireKEBSCertification: true,
    enableSerialVerification: true,
    maxComparisonProducts: 4,
    enablePriceHistory: true,
    enablePriceAlerts: true,
    enableWishlist: true,
    enableReviews: true,
    maxImagesPerProduct: 12,
    allowVideoReviews: true,
  },

  // ─── Content & i18n ───────────────────────────────────────────────────────
  content: {
    languages: ['en', 'sw'],
    defaultLanguage: 'en',
    blog: true,
    buyingGuides: true,
    comparisonPages: true,
    faqEnabled: true,
  },

  // ─── Infrastructure ───────────────────────────────────────────────────────
  infrastructure: {
    search: {
      provider: 'meilisearch',
    },
    storage: {
      provider: 'cloudflare-r2',
    },
    email: {
      provider: 'resend',
      fromAddress: 'orders@jenga.co.ke',
      fromName: 'Jenga Electronics',
    },
    sms: {
      provider: 'africastalking',
      senderId: 'JENGA',
    },
    analytics: {
      provider: 'posthog',
    },
  },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  seo: {
    siteName: 'Jenga Electronics',
    titleTemplate: '%s | Jenga Electronics',
    defaultDescription:
      'Shop smartphones, laptops, TVs, fridges, and home appliances. Pay via M-PESA. Fast delivery across all 47 counties in Kenya.',
    twitterHandle: '@JengaElectro',
    structuredData: true,
    sitemapEnabled: true,
  },
};

export default config;
