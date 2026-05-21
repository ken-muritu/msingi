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
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  const { method = 'GET', body, headers = {}, cache, revalidate } = options

  try {
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(cache ? { cache } : {}),
    }

    if (revalidate !== undefined) {
      fetchOptions.next = { revalidate }
    }

    const res = await fetch(`${API_BASE}${path}`, fetchOptions)

    if (!res.ok) return null
    return res.json()
  } catch {
    // API not reachable — caller should fall back to mock data
    return null
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
}
