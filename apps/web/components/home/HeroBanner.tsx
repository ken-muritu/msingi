'use client'

import Link from 'next/link'
import { MessageCircle, ShoppingBag, Shield, Truck, CreditCard, ChevronRight } from 'lucide-react'

const stats = [
  { icon: ShoppingBag, label: '10K+ Products', value: '' },
  { icon: Shield, label: 'Verified Sellers', value: '500+' },
  { icon: Truck, label: 'Nationwide', value: '47 Counties' },
  { icon: CreditCard, label: 'M-PESA', value: 'Accepted' },
]

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-hero-pattern" />

      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10 translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left – copy */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse-slow" />
              Kenya&apos;s #1 Electronics Platform
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-balance">
              Shop Electronics.
              <br />
              <span className="text-brand-400">Pay via M-PESA.</span>
            </h1>

            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
              Phones, laptops, TVs, fridges &amp; more — delivered to all 47 counties. Order on WhatsApp or our app. Genuine products, verified sellers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-brand-600/30"
              >
                <ShoppingBag size={18} />
                Shop Now
                <ChevronRight size={16} />
              </Link>
              <a
                href="https://wa.me/254700000000?text=Hello!%20I%20want%20to%20order%20from%20Jenga%20Electronics."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-green-600/30"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">✓</span>
                Genuine Products
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">✓</span>
                Secure M-PESA Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">✓</span>
                Easy Returns
              </span>
            </div>
          </div>

          {/* Right – feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '📱', title: 'Latest Smartphones', subtitle: 'Samsung, Apple, Xiaomi & more', href: '/products?category=smartphones', color: 'from-blue-600/20 to-blue-700/20 border-blue-500/30' },
              { emoji: '💻', title: 'Laptops & PCs', subtitle: 'Work, study & gaming', href: '/products?category=laptops', color: 'from-violet-600/20 to-violet-700/20 border-violet-500/30' },
              { emoji: '📺', title: 'Smart TVs', subtitle: '4K QLED & OLED', href: '/products?category=televisions', color: 'from-cyan-600/20 to-cyan-700/20 border-cyan-500/30' },
              { emoji: '🧊', title: 'Home Appliances', subtitle: 'Fridges, washers & cookers', href: '/products?category=fridges', color: 'from-teal-600/20 to-teal-700/20 border-teal-500/30' },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`bg-gradient-to-br ${card.color} border rounded-2xl p-4 hover:scale-105 transition-transform duration-200 group`}
              >
                <div className="text-3xl mb-2">{card.emoji}</div>
                <div className="text-sm font-semibold text-white">{card.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{card.subtitle}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div>
                {value && <div className="text-sm font-bold text-white">{value}</div>}
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
