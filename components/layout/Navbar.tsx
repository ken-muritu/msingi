'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart, Search, User, Menu, X, Zap,
  MessageCircle, Phone, ChevronDown, Bell,
} from 'lucide-react'
import { useCartStore, useCartCount } from '@/lib/store'

const navLinks = [
  { href: '/products?category=smartphones', label: '📱 Smartphones' },
  { href: '/products?category=laptops', label: '💻 Laptops' },
  { href: '/products?category=televisions', label: '📺 TVs' },
  { href: '/products?category=fridges', label: '🧊 Fridges' },
  { href: '/products?category=washing-machines', label: '🫧 Washers' },
  { href: '/products?category=audio', label: '🎧 Audio' },
  { href: '/products?category=tablets', label: '⬜ Tablets' },
  { href: '/products?category=cookers', label: '🔥 Cookers' },
]

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const toggleCart = useCartStore((s) => s.toggleCart)
  const itemCount = useCartCount()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileOpen(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-b border-slate-100'
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-brand-700 text-white text-xs py-1.5 overflow-hidden hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="tel:+254700000000"
              className="flex items-center gap-1 hover:underline"
            >
              <Phone size={10} /> +254 700 000 000
            </a>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <MessageCircle size={10} /> WhatsApp Orders
            </a>
          </div>
          <div className="flex items-center gap-4 text-brand-100">
            <span>🚚 Free delivery above KES 3,000</span>
            <span>🇰🇪 All 47 Counties</span>
            <span>💳 M-PESA Accepted</span>
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-700 transition-colors">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-slate-900 leading-none">Jenga</span>
              <div className="text-[9px] text-brand-600 font-medium leading-none">ELECTRONICS</div>
            </div>
          </Link>

          {/* Search bar – desktop */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:flex max-w-2xl">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search phones, TVs, laptops, fridges..."
                className="w-full pl-4 pr-12 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-white p-1.5 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search size={14} />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* WhatsApp CTA – desktop */}
            <a
              href="https://wa.me/254700000000?text=Hello%20Jenga!%20I%20need%20help."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>

            {/* Account */}
            <Link
              href="/account"
              className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-brand-50"
            >
              <User size={20} />
              <span className="text-[9px] hidden md:block">Account</span>
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex flex-col items-center gap-0.5 text-slate-600 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-brand-50"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              <span className="text-[9px] hidden md:block">Cart</span>
              {mounted && itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-flash-DEFAULT text-white text-[9px] font-bold min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile search */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-600 hover:text-brand-600 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav – desktop */}
      <nav className="hidden md:block border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center text-sm px-3 py-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href="/seller/dashboard"
                className="inline-flex items-center text-sm px-3 py-2 text-brand-700 hover:bg-brand-50 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                🏪 Sell on Jenga
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg">
          <div className="px-4 pt-3 pb-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={16} className="text-slate-400" />
                </button>
              </div>
            </form>
          </div>
          <ul className="px-4 pb-4 grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm px-3 py-2 text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="col-span-2 mt-1">
              <Link
                href="/seller/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-sm px-3 py-2 text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg font-medium transition-colors"
              >
                🏪 Sell on Jenga
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
