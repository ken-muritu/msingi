import type { MsingiConfig } from '@msingi/types';

export const defaultConfig: Partial<MsingiConfig> = {
  branding: {
    logo: '/brand/logo.svg',
    favicon: '/brand/favicon.png',
    colors: {
      primary: '#0066CC',
      secondary: '#FF6600',
      accent: '#00AA66',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      error: '#DC2626',
      warning: '#F59E0B',
      success: '#16A34A',
    },
    typography: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono',
    },
    poweredByMsingi: true,
  },
  business: {
    type: 'solo',
    currency: 'KES',
    currencySymbol: 'KSh',
    taxRate: 16,
    taxInclusivePricing: true,
  },
  modules: {
    core: true,
    marketplace: false,
    bnpl: false,
    dispatch: false,
    social: {
      whatsapp: false,
      tiktok: false,
      meta: false,
      live: false,
    },
    loyalty: 'none',
    b2b: false,
    subscriptions: false,
    insights: false,
    reviews: true,
    live: false,
  },
  payments: {
    mpesa: {
      stkPush: true,
      paybill: '',
      lipaMdogoMdogo: false,
    },
    cards: {
      provider: 'pesapal',
    },
    cashOnDelivery: {
      enabled: false,
    },
  },
  delivery: {
    couriers: [],
    sameDayDelivery: {
      enabled: false,
      cutoffTime: '11:00',
      zones: [],
    },
    clickAndCollect: false,
    installationServices: false,
  },
  catalog: {
    maxComparisonProducts: 4,
    enablePriceHistory: false,
    enablePriceAlerts: false,
    enableWishlist: true,
    enableReviews: true,
    maxImagesPerProduct: 10,
  },
  content: {
    languages: ['en'],
    defaultLanguage: 'en',
    blog: false,
    buyingGuides: false,
    comparisonPages: false,
    faqEnabled: true,
  },
  infrastructure: {
    search: {
      provider: 'meilisearch',
    },
    storage: {
      provider: 'local',
    },
    email: {
      provider: 'resend',
    },
    sms: {
      provider: 'africastalking',
    },
    analytics: {
      provider: 'none',
    },
  },
};
