'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, ArrowRight, Share2 } from 'lucide-react'
import { useWishlistStore, useCartStore } from '@/lib/store'
import { formatKES } from '@/lib/utils'

export default function WishlistPage() {
  const { items, removeItem, clear } = useWishlistStore()
  const addCartItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (item: typeof items[0]) => {
    addCartItem({
      id: item.id, name: item.name, brand: item.brand,
      price: item.price, originalPrice: item.originalPrice,
      image: item.image, category: item.category,
      sellerId: '', sellerName: '',
    })
    removeItem(item.id)
  }

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'My Jenga Wishlist', url: window.location.href })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart size={22} className="text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={clear}
              className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={64} className="text-slate-200 mb-5" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-400 mb-6 max-w-xs">Save products you love by tapping the heart icon on any product card.</p>
          <Link href="/products" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-colors">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                <Link href={`/products/${item.id}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 25vw" />
                  {item.discount && (
                    <span className="absolute top-2 left-2 bg-flash-DEFAULT text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{item.discount}%
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); removeItem(item.id) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-400 hover:text-red-600 shadow transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </Link>
                <div className="p-3">
                  <p className="text-[10px] font-semibold text-brand-600 uppercase mb-0.5">{item.brand}</p>
                  <Link href={`/products/${item.id}`} className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug hover:text-brand-700 transition-colors">
                    {item.name}
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{formatKES(item.price)}</p>
                      {item.originalPrice && (
                        <p className="text-[11px] text-slate-400 line-through">{formatKES(item.originalPrice)}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <ShoppingCart size={12} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-brand-50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">Add all to cart?</p>
              <p className="text-sm text-slate-500">Add all {items.length} items at once to your shopping cart.</p>
            </div>
            <button
              onClick={() => { items.forEach(handleAddToCart) }}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-colors"
            >
              <ShoppingCart size={16} /> Add All to Cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}
