'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Search, ShoppingCart, Heart, X } from 'lucide-react'
import { useCartStore, useCartCount, useWishlistStore } from '@/lib/store'
import { categories } from '@/lib/data'

export default function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const toggleCart = useCartStore((s) => s.toggleCart)
  const cartCount = useCartCount()
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => { setMounted(true) }, [])

  const isActive = (href: string) => pathname === href

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Category drawer */}
      {catOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCatOpen(false)} />
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Browse Categories</h2>
              <button onClick={() => setCatOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setCatOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-2xl hover:bg-brand-50 transition-colors text-center"
                >
                  <span className="text-2xl">
                    {cat.slug === 'smartphones' ? '📱' :
                     cat.slug === 'laptops' ? '💻' :
                     cat.slug === 'televisions' ? '📺' :
                     cat.slug === 'fridges' ? '🧊' :
                     cat.slug === 'washing-machines' ? '🫧' :
                     cat.slug === 'audio' ? '🎧' :
                     cat.slug === 'tablets' ? '⬜' :
                     cat.slug === 'cookers' ? '🔥' : '📦'}
                  </span>
                  <span className="text-xs text-slate-700 font-medium leading-tight">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">{cat.productCount}+</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-slate-100">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <input
                autoFocus
                type="search"
                placeholder="Search phones, TVs, laptops..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
                Search
              </button>
            </form>
            <button onClick={() => setSearchOpen(false)} className="text-slate-500 shrink-0">
              <X size={22} />
            </button>
          </div>
          <div className="p-4 flex-1">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {['Samsung Galaxy', 'iPhone 15', 'MacBook', 'LG TV 55"', 'Samsung Fridge', 'Sony Headphones', 'HP Laptop', 'Airfryer'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    window.location.href = `/products?search=${encodeURIComponent(term)}`
                    setSearchOpen(false)
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-brand-100 hover:text-brand-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-100 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${isActive('/') ? 'text-brand-600' : 'text-slate-500'}`}
          >
            <Home size={22} className={isActive('/') ? 'stroke-brand-600' : ''} />
            Home
          </Link>

          <button
            onClick={() => { setCatOpen(true); setSearchOpen(false) }}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-500"
          >
            <LayoutGrid size={22} />
            Categories
          </button>

          <button
            onClick={() => { setSearchOpen(true); setCatOpen(false) }}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-500 relative"
          >
            <div className="w-12 h-12 -mt-5 bg-brand-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-600/40">
              <Search size={22} className="text-white" />
            </div>
            <span className="mt-0.5">Search</span>
          </button>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative ${isActive('/wishlist') ? 'text-brand-600' : 'text-slate-500'}`}
          >
            <Heart size={22} className={isActive('/wishlist') ? 'fill-brand-600 stroke-brand-600' : ''} />
            Wishlist
            {mounted && wishlistCount > 0 && (
              <span className="absolute top-1 right-3 bg-brand-600 text-white text-[9px] font-bold min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleCart}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-500 relative"
          >
            <ShoppingCart size={22} />
            Cart
            {mounted && cartCount > 0 && (
              <span className="absolute top-1 right-3 bg-flash-DEFAULT text-white text-[9px] font-bold min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
        {/* iPhone home indicator safe area */}
        <div className="h-safe bg-white" />
      </nav>

      {/* Bottom padding so content isn't hidden behind nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
