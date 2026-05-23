'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlistStore, useCartStore } from '@/lib/store'
import { formatKES } from '@/lib/data'

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart size={48} className="text-slate-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h1>
        <p className="text-slate-500 mb-6">Save items you love to buy later.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/products/${item.id}`} className="relative block aspect-square bg-slate-50">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            </Link>
            <div className="p-3">
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wide">{item.brand}</p>
              <Link href={`/products/${item.id}`} className="text-sm font-medium text-slate-800 line-clamp-2 hover:text-brand-600 block mt-0.5">{item.name}</Link>
              <p className="font-bold text-slate-900 mt-1.5">{formatKES(item.price)}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => addToCart({ id: item.id, name: item.name, brand: item.brand, price: item.price, image: item.image, category: item.category, sellerId: '', sellerName: '' })}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <ShoppingCart size={12} /> Add
                </button>
                <button
                  onClick={() => toggle(item)}
                  className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-slate-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
