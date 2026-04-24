'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Star, ChevronRight } from 'lucide-react'
import { useRecentlyViewedStore } from '@/lib/store'
import { formatKES } from '@/lib/utils'

export default function RecentlyViewed() {
  const [mounted, setMounted] = useState(false)
  const items = useRecentlyViewedStore((s) => s.items)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || items.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock size={18} className="text-brand-600" />
          Recently Viewed
        </h2>
        <button
          onClick={() => useRecentlyViewedStore.getState().clear()}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-brand-200 transition-all"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
              />
            </div>
            <div className="p-2.5">
              <p className="text-[9px] font-semibold text-brand-600 uppercase mb-0.5">{item.brand}</p>
              <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-snug">{item.name}</p>
              <div className="flex items-center gap-0.5 mt-1">
                <Star size={9} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[9px] text-slate-500">{item.rating}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">{formatKES(item.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
