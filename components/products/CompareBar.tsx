'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, GitCompareArrows } from 'lucide-react'
import { useCompareStore } from '@/lib/store'
import { formatKES } from '@/lib/utils'

export default function CompareBar() {
  const { items, removeItem, clear } = useCompareStore()

  if (items.length < 2) return null

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-slate-900 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <GitCompareArrows size={18} className="text-brand-400" />
          <span className="text-sm font-semibold hidden sm:block">Compare ({items.length})</span>
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <div key={item.id} className="relative shrink-0 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white/20">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="32px" />
              </div>
              <span className="text-xs font-medium max-w-[100px] truncate hidden sm:block">{item.name}</span>
              <span className="text-xs text-brand-300 hidden sm:block">{formatKES(item.price)}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-1 text-slate-400 hover:text-white transition-colors"
                aria-label="Remove from compare"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-slate-400 hover:text-white transition-colors whitespace-nowrap hidden sm:block"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            <GitCompareArrows size={15} />
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  )
}
