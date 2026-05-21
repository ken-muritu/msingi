'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, ChevronRight } from 'lucide-react'
import { flashSaleProducts } from '@/lib/data'
import ProductCard from '@/components/products/ProductCard'

function getEndOfDay() {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 0)
  return end.getTime()
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function FlashSales() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })
  const [endTime] = useState(getEndOfDay)

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now())
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft({ h, m, s })
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [endTime])

  if (flashSaleProducts.length === 0) return null

  return (
    <section className="bg-gradient-to-r from-red-600 to-red-700 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Flash Sale
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                  Limited Stock
                </span>
              </h2>
              <p className="text-red-200 text-xs">Ends in:</p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1 ml-2">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="w-10 h-10 bg-slate-900 text-white text-sm font-extrabold rounded-lg flex items-center justify-center tabular-nums">
                    {pad(val)}
                  </span>
                  {i < 2 && <span className="text-white font-bold text-lg">:</span>}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/products?sale=flash"
            className="flex items-center gap-1 text-sm text-white/80 hover:text-white font-medium transition-colors whitespace-nowrap"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
