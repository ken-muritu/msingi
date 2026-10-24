'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Truck, Shield, RotateCcw, MessageCircle, ChevronRight, TrendingUp, Layers, ExternalLink } from 'lucide-react'
import { clientConfig } from '@/lib/config'
import { products, getFeaturedProducts, getFlashSaleProducts } from '@/lib/data'
import ProductCard from '@/components/product/ProductCard'

const BRANDS = ['Samsung', 'Apple', 'LG', 'Sony', 'Dell', 'Canon', 'JBL']

function FlashCountdown() {
  const [time, setTime] = useState({ h: 4, m: 0, s: 0 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        if (s > 0) return { h, m, s: s - 1 }
        if (m > 0) return { h, m: m - 1, s: 59 }
        if (h > 0) return { h: h - 1, m: 59, s: 59 }
        return { h: 3, m: 59, s: 59 }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-1 text-sm font-mono">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-lg font-bold">{v}</span>
          {i < 2 && <span className="text-red-600 font-bold">:</span>}
        </span>
      ))}
    </div>
  )
}

const CATEGORY_IMAGES: Record<string, string> = {
  smartphones:      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=75',
  laptops:          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=75',
  televisions:      'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=75',
  fridges:          'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=75',
  'washing-machines':'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75',
  audio:            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=75',
  cameras:          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=75',
  accessories:      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=75',
}

export default function HomePage() {
  const featured = getFeaturedProducts(8)
  const flashSale = getFlashSaleProducts(4)
  const trending = products.filter((p) => p.isTrending).slice(0, 4)

  return (
    <div className="space-y-12 pb-8">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <a
              href={clientConfig.brand.platformUrl}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 transition-colors"
            >
              <Layers size={11} /> Live Demo — Powered by Msingi <ExternalLink size={10} />
            </a>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              African Commerce,<br />Done Right.
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-md">
              Shop the latest electronics and appliances. Pay via M-PESA. Delivered across all 47 counties. Powered by the Msingi platform.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/products" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl transition-colors">
                Shop Now
              </Link>
              <Link href="/products?sale=flash" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                <Zap size={16} fill="white" /> Flash Sale
              </Link>
              <a
                href={clientConfig.brand.platformUrl}
                target="_blank" rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors border border-white/20"
              >
                <ExternalLink size={15} /> About Msingi
              </a>
            </div>
          </div>
          <div className="relative w-full max-w-sm aspect-square md:w-96 md:h-96 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&q=80"
              alt="Samsung Galaxy S24 Ultra"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Free Delivery', sub: 'On orders above Ksh 3,000' },
            { icon: Shield, title: 'Genuine Products', sub: '100% authentic & warranted' },
            { icon: Zap, title: 'M-PESA Checkout', sub: 'Fast, secure, instant' },
            { icon: RotateCcw, title: '7-Day Returns', sub: 'Hassle-free returns' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={20} className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Shop by Category</h2>
          <Link href="/products" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {clientConfig.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50">
                <Image
                  src={CATEGORY_IMAGES[cat.slug] ?? CATEGORY_IMAGES.accessories}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="48px"
                />
              </div>
              <span className="text-[11px] font-medium text-slate-700 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Flash Sale ── */}
      {flashSale.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <Zap size={20} className="text-orange-500 fill-orange-500" /> Flash Sale
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Ends in</span>
              <FlashCountdown />
            </h2>
            <Link href="/products?sale=flash" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
              See all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashSale.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Featured ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
          <Link href="/products" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Trending ── */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-pink-500" /> Trending Now
            </h2>
            <Link href="/products?sort=trending" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
              See all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {trending.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Brand strip ── */}
      <section className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Authorised Brands</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/products?search=${brand}`}
              className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:border-brand-300 hover:text-brand-700 hover:shadow-sm transition-all"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#25D366] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-xl font-bold mb-1">Need help choosing?</h3>
            <p className="text-white/80">Chat with our product experts on WhatsApp — instant replies, real advice.</p>
          </div>
          <a
            href={`https://wa.me/${clientConfig.business.whatsapp}?text=Hi! I need help choosing a product on Msingi Store`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-white text-[#25D366] hover:bg-green-50 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* ── All Products preview ── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">New Arrivals</h2>
          <Link href="/products" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.slice(4, 12).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

    </div>
  )
}
