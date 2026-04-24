'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Tag, Clock, ArrowRight, Filter, ChevronRight } from 'lucide-react'
import { products } from '@/lib/data'
import ProductCard from '@/components/products/ProductCard'

function pad(n: number) { return String(n).padStart(2, '0') }

const dealCategories = [
  { label: 'All Deals', value: 'all' },
  { label: '⚡ Flash Sale', value: 'flash' },
  { label: '🔥 Trending', value: 'trending' },
  { label: '📱 Smartphones', value: 'smartphones' },
  { label: '💻 Laptops', value: 'laptops' },
  { label: '📺 TVs', value: 'televisions' },
  { label: '🧊 Fridges', value: 'fridges' },
]

const promos = [
  { code: 'MPESA10', discount: '10% off', desc: 'Any M-PESA order above KES 10,000', expires: '31 Dec 2025', color: 'from-green-600 to-emerald-700' },
  { code: 'JENGA50', discount: 'KES 500 off', desc: 'First order for new customers', expires: '31 Jan 2026', color: 'from-brand-600 to-brand-800' },
  { code: 'COUNTY47', discount: 'Free delivery', desc: 'Orders to any county above KES 3,000', expires: 'Ongoing', color: 'from-violet-600 to-violet-800' },
]

export default function DealsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [copiedCode, setCopiedCode] = useState('')
  const [endTime] = useState(() => {
    const d = new Date(); d.setHours(23, 59, 59, 0); return d.getTime()
  })
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now())
      setTimeLeft({ h: Math.floor(diff / 3_600_000), m: Math.floor((diff % 3_600_000) / 60_000), s: Math.floor((diff % 60_000) / 1_000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [endTime])

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return p.discount || p.isFlashSale || p.isTrending
    if (activeCategory === 'flash') return p.isFlashSale
    if (activeCategory === 'trending') return p.isTrending
    return p.category === activeCategory && (p.discount || p.isFlashSale)
  })

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 2000)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag size={22} className="text-brand-600" />
            Deals & Offers
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Best prices, flash sales & promo codes — updated daily</p>
        </div>
        <Link href="/products" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
          All products <ChevronRight size={14} />
        </Link>
      </div>

      {/* Flash sale countdown banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-lg">Today&apos;s Flash Sale</h2>
            <p className="text-red-200 text-sm">Limited stock · Ends at midnight</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-200 text-sm font-medium hidden sm:block">Ends in</span>
          {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="w-12 h-12 bg-slate-900 text-white text-lg font-extrabold rounded-xl flex items-center justify-center tabular-nums">
                {pad(val)}
              </span>
              {i < 2 && <span className="text-white font-bold text-xl">:</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Promo codes */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Tag size={16} className="text-brand-600" /> Promo Codes
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {promos.map((promo) => (
            <div key={promo.code} className={`bg-gradient-to-r ${promo.color} rounded-2xl p-4 text-white relative overflow-hidden`}>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white opacity-5 rounded-l-full" />
              <p className="text-2xl font-extrabold mb-0.5">{promo.discount}</p>
              <p className="text-sm text-white/80 mb-3">{promo.desc}</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-white/20 px-2.5 py-1.5 rounded-lg font-bold tracking-widest">
                  {promo.code}
                </code>
                <button
                  onClick={() => copyCode(promo.code)}
                  className="text-xs bg-white text-brand-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  {copiedCode === promo.code ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-white/60 mt-2 flex items-center gap-1">
                <Clock size={9} /> Expires: {promo.expires}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {dealCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat.value ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-700'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Filter size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No deals in this category right now.</p>
          <button onClick={() => setActiveCategory('all')} className="mt-3 text-brand-600 hover:underline text-sm">
            View all deals
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{filteredProducts.length} deals found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Deal alert signup */}
      <div className="mt-12 bg-brand-50 border border-brand-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg">Never miss a deal 🔔</h3>
          <p className="text-slate-500 text-sm mt-0.5">Get flash sale alerts on WhatsApp before they sell out.</p>
        </div>
        <a
          href="https://wa.me/254700000000?text=Hi%20Jenga!%20Please%20add%20me%20to%20your%20deals%20alert%20list%20%F0%9F%94%94"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors"
        >
          <ArrowRight size={16} /> Get Deal Alerts on WhatsApp
        </a>
      </div>
    </div>
  )
}
