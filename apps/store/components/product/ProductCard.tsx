'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { formatKES, type Product } from '@/lib/data'

interface Props {
  product: Product
  variant?: 'grid' | 'compact'
}

export default function ProductCard({ product, variant = 'grid' }: Props) {
  const addToCart = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const inWishlist = useWishlistStore((s) => s.has(product.id))

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      category: product.category,
    })
  }

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.id}`} className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-50">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-brand-600 font-semibold uppercase tracking-wide">{product.brand}</p>
          <p className="text-sm font-medium text-slate-800 line-clamp-2">{product.name}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{formatKES(product.price)}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Zap size={8} fill="white" /> Flash
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-400 hover:text-red-500'}`}
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        {/* Add to cart hover overlay */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:bg-slate-300"
          >
            <ShoppingCart size={14} />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-0.5">{product.brand}</p>
        <p className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug mb-1.5">{product.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={11} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
            ))}
          </div>
          <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-slate-900">{formatKES(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">{formatKES(product.originalPrice)}</span>
          )}
        </div>

        {product.bnplAvailable && product.monthlyInstallment && (
          <p className="text-[10px] text-slate-500 mt-0.5">
            or {formatKES(product.monthlyInstallment)}/mo with Lipa Later
          </p>
        )}

        {!product.inStock && (
          <span className="mt-1 inline-block text-[10px] font-medium text-red-500">Out of Stock</span>
        )}
      </div>
    </Link>
  )
}
