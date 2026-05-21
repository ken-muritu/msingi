'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Star, CheckCircle2, GitCompareArrows } from 'lucide-react'
import { useCompareStore, useCartStore } from '@/lib/store'
import { formatKES } from '@/lib/utils'

export default function ComparePage() {
  const { items, removeItem, clear } = useCompareStore()
  const addCartItem = useCartStore((s) => s.addItem)

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <GitCompareArrows size={64} className="text-slate-200 mx-auto mb-5" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No products to compare</h2>
        <p className="text-slate-400 mb-6">Hover over any product card and click the compare icon to add products.</p>
        <Link href="/products" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  const allSpecKeys = [...new Set(items.flatMap((p) => Object.keys(p.specifications)))]
  const allFeatures = [...new Set(items.flatMap((p) => p.features))]

  const getBestPrice = () => Math.min(...items.map((p) => p.price))
  const getBestRating = () => Math.max(...items.map((p) => p.rating))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GitCompareArrows size={22} className="text-brand-600" />
            Compare Products
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Side-by-side comparison of {items.length} products</p>
        </div>
        <button onClick={clear} className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {/* Product header row */}
          <thead>
            <tr>
              <th className="w-36 text-left py-3 pr-4 text-sm font-semibold text-slate-500 align-bottom">Product</th>
              {items.map((item) => (
                <th key={item.id} className="pb-4 px-3 align-top">
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 relative text-left">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="160px" />
                    </div>
                    <p className="text-[10px] font-semibold text-brand-600 uppercase mb-1">{item.brand}</p>
                    <Link href={`/products/${item.id}`} className="text-sm font-semibold text-slate-800 hover:text-brand-700 line-clamp-2 leading-snug block mb-2">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={11} className={i < Math.round(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
                      ))}
                      <span className="text-[10px] text-slate-500">{item.rating}</span>
                    </div>
                    <p className={`text-lg font-extrabold mb-3 ${item.price === getBestPrice() ? 'text-brand-700' : 'text-slate-900'}`}>
                      {formatKES(item.price)}
                      {item.price === getBestPrice() && items.length > 1 && (
                        <span className="ml-1.5 text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full font-semibold">Best price</span>
                      )}
                    </p>
                    <button
                      onClick={() => addCartItem({ id: item.id, name: item.name, brand: item.brand, price: item.price, image: item.image, category: item.category, sellerId: '', sellerName: '' })}
                      className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Rating row */}
            <tr className="bg-slate-50/50">
              <td className="py-3 pr-4 text-sm font-semibold text-slate-600">Rating</td>
              {items.map((item) => (
                <td key={item.id} className="py-3 px-3 text-center">
                  <span className={`text-sm font-bold ${item.rating === getBestRating() ? 'text-brand-700' : 'text-slate-700'}`}>
                    ★ {item.rating}
                  </span>
                </td>
              ))}
            </tr>

            {/* Spec rows */}
            {allSpecKeys.map((key, idx) => (
              <tr key={key} className={idx % 2 === 0 ? '' : 'bg-slate-50/50'}>
                <td className="py-3 pr-4 text-sm font-medium text-slate-500 whitespace-nowrap">{key}</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-3 text-center text-sm text-slate-700">
                    {item.specifications[key] ?? <span className="text-slate-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}

            {/* Features row */}
            {allFeatures.length > 0 && (
              <tr>
                <td className="py-3 pr-4 text-sm font-semibold text-slate-600 align-top pt-5">Features</td>
                {items.map((item) => (
                  <td key={item.id} className="py-3 px-3 align-top pt-5">
                    <ul className="space-y-1.5">
                      {allFeatures.slice(0, 6).map((feat) => {
                        const has = item.features.includes(feat)
                        return (
                          <li key={feat} className={`flex items-start gap-1.5 text-xs ${has ? 'text-slate-700' : 'text-slate-300'}`}>
                            <CheckCircle2 size={12} className={`shrink-0 mt-0.5 ${has ? 'text-brand-500' : 'text-slate-200'}`} />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-sm text-brand-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    </div>
  )
}
