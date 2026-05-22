// ─── Msingi API Client ─────────────────────────────────────────────────────
// Fetches from the live backend when available, returns null on failure
// so callers can fall back to static mock data.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

interface ApiOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  cache?: RequestCache
  revalidate?: number
  token?: string
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('msingi-auth-v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed?.state?.token ?? null
    }
  } catch {}
  return null
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  const { method = 'GET', body, headers = {}, cache, revalidate, token } = options

  try {
    const authToken = token || getStoredToken()
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(cache ? { cache } : {}),
    }

    if (revalidate !== undefined) {
      fetchOptions.next = { revalidate }
    }

    const res = await fetch(`${API_BASE}${path}`, fetchOptions)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new ApiError(res.status, err?.message || res.statusText, err)
    }
    return res.json()
  } catch (e) {
    if (e instanceof ApiError) throw e
    // API not reachable — caller should fall back to mock data
    return null
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Product Types (matching backend response shape) ───────────────────────

export interface ApiProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  sortOrder: number
}

export interface ApiProductVariant {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  sku: string
  stockCount: number
  isActive: boolean
}

export interface ApiProduct {
  id: string
  name: string
  slug: string
  brand: string
  description: string
  price: number
  compareAtPrice: number | null
  costPrice: number | null
  features: string[]
  attributes: Record<string, unknown> | null
  specifications: Record<string, string>
  tags: string[]
  warranty: string
  weight: number | null
  requiresInstallation: boolean
  installationFee: number | null
  bnplAvailable: boolean
  monthlyInstallment: number | null
  rating: number
  reviewCount: number
  salesCount: number
  stockCount: number
  lowStockThreshold: number
  isFeatured: boolean
  isFlashSale: boolean
  flashSalePrice: number | null
  status: string
  categoryId: string
  sellerId: string
  category: {
    id: string
    name: string
    slug: string
    iconName: string | null
    description: string | null
  }
  seller: {
    id: string
    businessName: string
    badge?: string
    rating?: number
    verified?: boolean
  }
  images: ApiProductImage[]
  variants: ApiProductVariant[]
}

export interface ApiPaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  iconName: string | null
  description: string | null
  parentId: string | null
  sortOrder: number
  isActive: boolean
  _count?: { products: number }
}

export interface ApiSeller {
  id: string
  businessName: string
  slug: string
  description: string
  badge: string
  rating: number
  salesCount: number
  verified: boolean
  location: string | null
  status: string
}

export interface ApiSearchResult {
  results: ApiProduct[]
  totalCount: number
  query: string
  responseTimeMs: number
  facets?: {
    brands: { name: string; count: number }[]
    categories: { name: string; slug: string; count: number }[]
    priceRange: { min: number; max: number }
  }
}

export interface ApiAuthResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  token: string
}

// ─── Cart Types ────────────────────────────────────────────────────────

export interface ApiCartItem {
  id: string
  productId: string
  variantId: string | null
  name: string
  brand: string | null
  slug: string
  price: number
  compareAtPrice: number | null
  image: string
  quantity: number
  lineTotal: number
  seller: { id: string; businessName: string; badge: string }
  stockCount: number
}

export interface ApiCart {
  id: string
  items: ApiCartItem[]
  itemCount: number
  subtotal: number
  delivery: number
  total: number
}

// ─── Order Types ────────────────────────────────────────────────────────

export interface CreateOrderBody {
  userId?: string
  guestEmail?: string
  guestPhone?: string
  items: { productId: string; variantId?: string; quantity: number }[]
  shippingAddress: {
    name: string
    phone: string
    email?: string
    addressLine1: string
    addressLine2?: string
    city: string
    county: string
    postalCode?: string
    deliveryInstructions?: string
  }
  paymentMethod: 'mpesa' | 'card' | 'cash_on_delivery' | 'bnpl'
}

export interface ApiOrder {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  tax: number
  deliveryFee: number
  discount: number
  total: number
  shippingAddress: Record<string, string>
  mpesaReceiptNumber: string | null
  mpesaTransactionId: string | null
  createdAt: string
  items: Array<{
    id: string
    name: string
    sku: string | null
    image: string
    price: number
    quantity: number
    total: number
  }>
}

export interface ApiStkPushResponse {
  transactionId: string
  checkoutRequestId: string
  merchantRequestId: string
  message: string
  status: string
}

export interface ApiStkQueryResponse {
  resultCode: string
  resultDesc: string
  isPaid: boolean
}

// ─── Review Types ──────────────────────────────────────────────────────────

export interface ApiReview {
  id: string
  rating: number
  title: string | null
  body: string | null
  isVerifiedPurchase: boolean
  createdAt: string
  user: { id: string; name: string }
  sellerId: string | null
  sellerResponse: string | null
}

// ─── Verification Types ────────────────────────────────────────────────────

export interface ApiVerificationRequest {
  id: string
  sellerId: string
  status: string
  tier: string
  documents: { key: string; url: string; type: string; uploadedAt: string }[]
  notes: string | null
  reviewNote: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  submittedAt: string
  seller: { businessName: string; slug: string }
}

// ─── API Methods ───────────────────────────────────────────────────────────

export const api = {
  // Products
  getProducts: (params?: Record<string, string | number>) =>
    apiFetch<ApiPaginatedResponse<ApiProduct>>(
      `/products${params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''}`
    ),

  getProduct: (id: string) =>
    apiFetch<ApiProduct>(`/products/${id}`),

  getProductBySlug: (slug: string) =>
    apiFetch<ApiProduct>(`/products/slug/${slug}`),

  // Categories
  getCategories: () =>
    apiFetch<ApiCategory[]>('/categories'),

  // Sellers
  getSellers: (page = 1, pageSize = 20) =>
    apiFetch<{ data: ApiSeller[]; total: number }>(`/sellers?page=${page}&pageSize=${pageSize}`),

  getSeller: (id: string) =>
    apiFetch<ApiSeller>(`/sellers/${id}`),

  // Search
  search: (query: string, filters?: Record<string, string>) =>
    apiFetch<ApiSearchResult>(
      `/search?q=${encodeURIComponent(query)}${filters ? '&' + new URLSearchParams(filters).toString() : ''}`
    ),

  autocomplete: (query: string) =>
    apiFetch<{ suggestions: string[] }>(`/search/autocomplete?q=${encodeURIComponent(query)}`),

  // Auth
  login: (identifier: string, password: string) =>
    apiFetch<ApiAuthResponse>('/auth/login', {
      method: 'POST',
      body: { identifier, password },
    }),

  register: (data: { name: string; email?: string; phone?: string; password: string }) =>
    apiFetch<ApiAuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  // Health
  health: () =>
    apiFetch<{ status: string; framework: string; version: string }>('/health'),

  // Cart
  getCart: (sessionId?: string) =>
    apiFetch<ApiCart>(`/cart${sessionId ? `?sessionId=${sessionId}` : ''}`),

  addToCart: (body: { productId: string; variantId?: string; quantity?: number }, sessionId?: string) =>
    apiFetch<ApiCart>(`/cart/items${sessionId ? `?sessionId=${sessionId}` : ''}`, {
      method: 'POST',
      body,
    }),

  updateCartItem: (itemId: string, quantity: number, sessionId?: string) =>
    apiFetch<ApiCart>(`/cart/items/${itemId}${sessionId ? `?sessionId=${sessionId}` : ''}`, {
      method: 'PUT',
      body: { quantity },
    }),

  removeCartItem: (itemId: string, sessionId?: string) =>
    apiFetch<ApiCart>(`/cart/items/${itemId}${sessionId ? `?sessionId=${sessionId}` : ''}`, {
      method: 'DELETE',
    }),

  clearCart: (sessionId?: string) =>
    apiFetch<{ success: boolean }>(`/cart${sessionId ? `?sessionId=${sessionId}` : ''}`, {
      method: 'DELETE',
    }),

  mergeCart: (sessionId: string) =>
    apiFetch<{ success: boolean }>('/cart/merge', {
      method: 'POST',
      body: { sessionId },
    }),

  // Orders
  createOrder: (body: CreateOrderBody) =>
    apiFetch<ApiOrder>('/orders', { method: 'POST', body }),

  getOrder: (id: string) =>
    apiFetch<ApiOrder>(`/orders/${id}`),

  getOrderByNumber: (orderNumber: string) =>
    apiFetch<ApiOrder>(`/orders/number/${orderNumber}`),

  getMyOrders: (page = 1) =>
    apiFetch<{ data: ApiOrder[]; total: number }>(`/orders/my?page=${page}`),

  // Payments
  initiateMpesa: (orderId: string, phone: string) =>
    apiFetch<ApiStkPushResponse>('/payments/mpesa/stk-push', {
      method: 'POST',
      body: { orderId, phone },
    }),

  queryMpesaStatus: (checkoutRequestId: string) =>
    apiFetch<ApiStkQueryResponse>(`/payments/mpesa/query/${checkoutRequestId}`),

  // Reviews (public)
  getProductReviews: (productId: string) =>
    apiFetch<{ data: ApiReview[]; total: number }>(`/reviews/product/${productId}`),

  // Admin
  adminGetAllOrders: (page = 1, status?: string) =>
    apiFetch<{ data: ApiOrder[]; total: number }>(
      `/orders?page=${page}${status ? `&status=${status}` : ''}`
    ),

  adminUpdateOrderStatus: (orderId: string, status: string) =>
    apiFetch<ApiOrder>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
    }),

  adminGetSellers: (page = 1, pageSize = 50) =>
    apiFetch<{ data: ApiSeller[]; total: number }>(`/sellers?page=${page}&pageSize=${pageSize}`),

  // KYC / Verification
  getVerificationUploadUrl: (docType: string, mimeType: string) =>
    apiFetch<{ key: string; uploadUrl: string | null; expiresInSeconds: number }>('/verification/upload-url', {
      method: 'POST',
      body: { docType, mimeType },
    }),

  submitVerification: (data: { tier: string; documents: { key: string; url: string; type: string }[]; notes?: string }) =>
    apiFetch<{ id: string; status: string }>('/verification/submit', { method: 'POST', body: data }),

  getMyVerifications: () =>
    apiFetch<{ id: string; status: string; tier: string; submittedAt: string; reviewNote: string | null }[]>('/verification/my'),

  adminGetVerifications: (page = 1, status?: string) =>
    apiFetch<{ data: ApiVerificationRequest[]; total: number }>(
      `/verification/admin/requests?page=${page}${status ? `&status=${status}` : ''}`
    ),

  adminReviewVerification: (id: string, status: string, reviewNote?: string) =>
    apiFetch<{ id: string; status: string }>(`/verification/admin/requests/${id}/review`, {
      method: 'PATCH',
      body: { status, reviewNote },
    }),
}
