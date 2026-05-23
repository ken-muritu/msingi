'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, Zap } from 'lucide-react'
import { useCartCount, useWishlistStore } from '@/lib/store'
import { clientConfig } from '@/lib/config'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const cartCount = useCartCount()
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-brand-600 text-white text-xs py-1.5 px-4 text-center hidden sm:block">
        🚚 Free delivery on orders above Ksh 3,000 &nbsp;|&nbsp; 📱 Pay via M-PESA &nbsp;|&nbsp; ↩️ 7-day returns
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg hidden sm:block">{clientConfig.brand.name}</span>
        </Link>

        {/* Search — desktop */}
        <form
          action="/products"
          className="hidden md:flex flex-1 max-w-xl relative"
        >
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            name="search"
            type="text"
            placeholder="Search products, brands…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm border border-transparent focus:border-brand-400 focus:bg-white focus:outline-none transition-colors"
          />
        </form>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 shrink-0">
          {clientConfig.categories.slice(0, 4).map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="hover:text-brand-600 transition-colors">
              {cat.name}
            </Link>
          ))}
          <Link href="/products?sale=flash" className="text-red-600 font-semibold flex items-center gap-1">
            <Zap size={13} fill="currentColor" /> Sale
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
            <ShoppingCart size={16} />
            <span className="hidden sm:block">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-white text-brand-600 text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <form action="/products" className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="search"
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm border border-transparent focus:border-brand-400 focus:bg-white focus:outline-none"
            />
          </div>
        </form>
      )}
    </header>
  )
}
