'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  sellerId: string
  sellerName: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return { items: state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => i.id === id ? { ...i, quantity } : i),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'msingi-cart' }
  )
)

export function useCartTotal(): number {
  const items = useCartStore((s) => s.items)
  return items.reduce((t, i) => t + i.price * i.quantity, 0)
}

export function useCartCount(): number {
  const items = useCartStore((s) => s.items)
  return items.reduce((t, i) => t + i.quantity, 0)
}

export interface WishlistItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
}

interface WishlistStore {
  items: WishlistItem[]
  toggle: (item: WishlistItem) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id)
          return { items: exists ? state.items.filter((i) => i.id !== item.id) : [...state.items, item] }
        }),
      has: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'msingi-wishlist' }
  )
)

interface CompareStore {
  ids: string[]
  toggle: (id: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) return { ids: state.ids.filter((i) => i !== id) }
          if (state.ids.length >= 4) return state
          return { ids: [...state.ids, id] }
        }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'msingi-compare' }
  )
)
