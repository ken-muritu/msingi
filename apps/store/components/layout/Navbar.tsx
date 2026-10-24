'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Heart, Search, X, User, Layers } from 'lucide-react'
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
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs py-1.5 px-4 text-center hidden sm:block">
        🚚 Free delivery on orders above Ksh 3,000 &nbsp;·&nbsp; 📱 M-PESA checkout &nbsp;·&nbsp; 🏪 Powered by{' '}
        <a href={clientConfig.brand.platformUrl} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-2 hover:text-indigo-200">
          Msingi
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
            <Layers size={15} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-slate-900 text-base leading-none">Msingi</span>
            <span className="text-slate-400 text-base font-normal"> Store</span>
          </div>
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
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 shrink-0">
          {clientConfig.categories.slice(0, 4).map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-brand-600 transition-colors">
              {cat.name}
            </Link>
          ))}
          <Link href="/products" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-brand-600 transition-colors">All</Link>
          <Link href="/products?sale=flash" className="ml-1 text-red-600 font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors">
            ⚡ Sale
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

          {/* Account */}
          <Link href="/account" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
            <User size={18} />
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
