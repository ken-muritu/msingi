'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from './data'

const storage = createJSONStorage(() =>
  typeof window !== 'undefined'
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
)

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  category: string
  sellerId: string
  sellerName: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          })
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }], isOpen: true })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) { get().removeItem(id); return }
        set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    { name: 'jenga-cart-v1', storage }
  )
)

export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0))

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  discount?: number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: WishlistItem) => void
  hasItem: (id: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().items.find((i) => i.id === item.id))
          set({ items: [...get().items, item] })
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      toggleItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        exists ? get().removeItem(item.id) : get().addItem(item)
      },
      hasItem: (id) => !!get().items.find((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'jenga-wishlist-v1', storage }
  )
)

// ─── Recently Viewed ─────────────────────────────────────────────────────────

export interface RecentItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
  rating: number
  viewedAt: number
}

interface RecentlyViewedStore {
  items: RecentItem[]
  addItem: (item: Omit<RecentItem, 'viewedAt'>) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const filtered = get().items.filter((i) => i.id !== item.id)
        const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 12)
        set({ items: updated })
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'jenga-recent-v1', storage }
  )
)

// ─── Product Comparison ──────────────────────────────────────────────────────

export interface CompareItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
  rating: number
  specifications: Record<string, string>
  features: string[]
}

interface CompareStore {
  items: CompareItem[]
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  toggleItem: (item: CompareItem) => void
  hasItem: (id: string) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.length >= 4) return
        if (!get().items.find((i) => i.id === item.id))
          set({ items: [...get().items, item] })
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      toggleItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        exists ? get().removeItem(item.id) : get().addItem(item)
      },
      hasItem: (id) => !!get().items.find((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'jenga-compare-v1', storage }
  )
)

// ─── Seller Products ──────────────────────────────────────────────────────────

interface SellerProductsStore {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductsBySeller: (sellerId: string) => Product[]
}

export const useSellerProductsStore = create<SellerProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => set({ products: [...get().products, product] }),
      updateProduct: (id, updates) =>
        set({ products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)) }),
      deleteProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
      getProductsBySeller: (sellerId) => get().products.filter((p) => p.seller.id === sellerId),
    }),
    { name: 'jenga-seller-products-v1', storage }
  )
)
