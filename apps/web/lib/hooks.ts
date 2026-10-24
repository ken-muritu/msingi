'use client'

import { useState, useEffect } from 'react'
import { api, type ApiProduct, type ApiCategory, type ApiSeller, type ApiSearchResult, type ApiCart, type ApiOrder } from './api'
import { useAuthStore } from './store'
import {
  products as mockProducts,
  categories as mockCategories,
  sellers as mockSellers,
  type Product,
  type Category,
  type Seller,
} from './data'

// ─── Transform API data → frontend shape ──────────────────────────────────

function apiProductToProduct(p: ApiProduct): Product {
  const seller: Seller = {
    id: p.seller.id,
    name: p.seller.businessName,
    verified: p.seller.verified ?? true,
    isVerified: p.seller.verified ?? true,
    badge: (p.seller.badge as Seller['badge']) ?? 'basic',
    rating: p.seller.rating ?? 0,
    salesCount: 0,
    productCount: 0,
    totalRevenue: 0,
    location: '',
    responseTime: '< 2 hours',
    description: '',
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category?.slug ?? '',
    price: p.price,
    originalPrice: p.compareAtPrice ?? undefined,
    discount: p.compareAtPrice ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : undefined,
    images: p.images.length > 0 ? p.images.map((img) => img.url) : [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&q=80',
    ],
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.stockCount > 0,
    stockCount: p.stockCount,
    description: p.description,
    features: p.features,
    specifications: p.specifications,
    warranty: p.warranty,
    requiresInstallation: p.requiresInstallation,
    installationFee: p.installationFee ?? undefined,
    seller,
    tags: p.tags,
    bnplAvailable: p.bnplAvailable,
    monthlyInstallment: p.monthlyInstallment ?? undefined,
    isFlashSale: p.isFlashSale,
    isFeatured: p.isFeatured,
    isTrending: false,
    deliveryDays: '2-4 business days',
  }
}

function apiCategoryToCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    iconName: c.iconName ?? 'Package',
    productCount: c._count?.products ?? 0,
    color: 'from-blue-500 to-blue-700',
    description: c.description ?? '',
  }
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

interface UseDataResult<T> {
  data: T
  loading: boolean
  error: string | null
  isLive: boolean
}

export function useProducts(params?: Record<string, string | number>): UseDataResult<Product[]> {
  const [data, setData] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      const result = await api.getProducts(params)
      if (cancelled) return

      if (result && result.data.length > 0) {
        setData(result.data.map(apiProductToProduct))
        setIsLive(true)
      } else {
        // Fallback to mock data
        setData(mockProducts)
        setIsLive(false)
      }
      setLoading(false)
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [JSON.stringify(params)]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, isLive }
}

export function useProduct(id: string): UseDataResult<Product | null> {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchProduct() {
      setLoading(true)
      const result = await api.getProduct(id)
      if (cancelled) return

      if (result) {
        setData(apiProductToProduct(result))
        setIsLive(true)
      } else {
        // Fallback to mock data
        const mockProduct = mockProducts.find((p) => p.id === id) ?? null
        setData(mockProduct)
        setIsLive(false)
      }
      setLoading(false)
    }

    fetchProduct()
    return () => { cancelled = true }
  }, [id])

  return { data, loading, error, isLive }
}

export function useCategories(): UseDataResult<Category[]> {
  const [data, setData] = useState<Category[]>(mockCategories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      setLoading(true)
      const result = await api.getCategories()
      if (cancelled) return

      if (result && result.length > 0) {
        setData(result.map(apiCategoryToCategory))
        setIsLive(true)
      } else {
        setData(mockCategories)
        setIsLive(false)
      }
      setLoading(false)
    }

    fetchCategories()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error, isLive }
}

export function useSearch(query: string): UseDataResult<Product[]> & { totalCount: number; responseTimeMs: number } {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [responseTimeMs, setResponseTimeMs] = useState(0)

  useEffect(() => {
    if (!query.trim()) {
      setData([])
      setTotalCount(0)
      return
    }

    let cancelled = false

    async function performSearch() {
      setLoading(true)
      const result = await api.search(query)
      if (cancelled) return

      if (result) {
        setData(result.results.map(apiProductToProduct))
        setTotalCount(result.totalCount)
        setResponseTimeMs(result.responseTimeMs)
        setIsLive(true)
      } else {
        // Fallback to client-side search on mock data
        const q = query.toLowerCase()
        const filtered = mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
        setData(filtered)
        setTotalCount(filtered.length)
        setResponseTimeMs(0)
        setIsLive(false)
      }
      setLoading(false)
    }

    performSearch()
    return () => { cancelled = true }
  }, [query])

  return { data, loading, error, isLive, totalCount, responseTimeMs }
}

export function useSellers(): UseDataResult<Seller[]> {
  const [data, setData] = useState<Seller[]>(mockSellers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchSellers() {
      setLoading(true)
      const result = await api.getSellers()
      if (cancelled) return

      if (result && result.data.length > 0) {
        setData(result.data.map((s): Seller => ({
          id: s.id,
          name: s.businessName,
          verified: s.verified,
          isVerified: s.verified,
          badge: s.badge as Seller['badge'],
          rating: s.rating,
          salesCount: s.salesCount,
          productCount: 0,
          totalRevenue: 0,
          location: s.location ?? '',
          responseTime: '< 2 hours',
          description: s.description,
        })))
        setIsLive(true)
      } else {
        setData(mockSellers)
        setIsLive(false)
      }
      setLoading(false)
    }

    fetchSellers()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error, isLive }
}

// ─── useAuth ───────────────────────────────────────────────────────────────

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setAuth, clearAuth, user, token, isLoggedIn } = useAuthStore()

  const login = async (identifier: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.login(identifier, password)
      if (result) {
        setAuth(result.user, result.token)
        return result
      }
      throw new Error('Login failed — backend unreachable')
    } catch (e: any) {
      setError(e.message || 'Login failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: { name: string; email?: string; phone?: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.register(data)
      if (result) {
        setAuth(result.user, result.token)
        return result
      }
      throw new Error('Registration failed — backend unreachable')
    } catch (e: any) {
      setError(e.message || 'Registration failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = () => clearAuth()

  return { login, register, logout, user, token, isLoggedIn, loading, error }
}

// ─── useApiCart ────────────────────────────────────────────────────────────

export function useApiCart(sessionId?: string) {
  const [cart, setCart] = useState<ApiCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    const result = await api.getCart(sessionId)
    if (result) setCart(result)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  const addItem = async (productId: string, variantId?: string, quantity = 1) => {
    const result = await api.addToCart({ productId, variantId, quantity }, sessionId)
    if (result) setCart(result)
    return result
  }

  const updateItem = async (itemId: string, quantity: number) => {
    const result = await api.updateCartItem(itemId, quantity, sessionId)
    if (result) setCart(result)
    return result
  }

  const removeItem = async (itemId: string) => {
    const result = await api.removeCartItem(itemId, sessionId)
    if (result) setCart(result)
    return result
  }

  const clear = async () => {
    await api.clearCart(sessionId)
    setCart(null)
  }

  return { cart, loading, error, addItem, updateItem, removeItem, clear, refresh }
}

// ─── useMyOrders ───────────────────────────────────────────────────────────

export function useMyOrders(page = 1) {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchOrders() {
      setLoading(true)
      const result = await api.getMyOrders(page)
      if (cancelled) return
      if (result) {
        setOrders(result.data)
        setTotal(result.total)
      } else {
        setError('Could not load orders — are you logged in?')
      }
      setLoading(false)
    }

    fetchOrders()
    return () => { cancelled = true }
  }, [page])

  return { orders, total, loading, error }
}
