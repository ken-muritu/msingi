'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, MessageCircle, Heart, Zap, BadgeCheck, GitCompareArrows, Eye } from 'lucide-react'
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store'
import { formatKES, generateWhatsAppProductMessage } from '@/lib/utils'
import type { Product } from '@/lib/data'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

function useSocialProof(id: string) {
  return useMemo(() => ({
    viewing: Math.floor(Math.random() * 18) + 2,
    soldToday: Math.floor(Math.random() * 12) + 1,
  }), [id])
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem: toggleWishlist, hasItem: inWishlist } = useWishlistStore()
  const { toggleItem: toggleCompare, hasItem: inCompare, items: compareItems } = useCompareStore()
  const wished = inWishlist(product.id)
  const compared = inCompare(product.id)
  const compareDisabled = compareItems.length >= 4 && !compared
  const proof = useSocialProof(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    addItem({
      id: product.id, name: product.name, brand: product.brand,
      price: product.price, originalPrice: product.originalPrice,
      image: product.images[0], category: product.category,
      sellerId: product.seller.id, sellerName: product.seller.name,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    toggleWishlist({
      id: product.id, name: product.name, brand: product.brand,
      price: product.price, originalPrice: product.originalPrice,
      image: product.images[0], category: product.category,
      rating: product.rating, discount: product.discount,
    })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (compareDisabled) return
    toggleCompare({
      id: product.id, name: product.name, brand: product.brand,
      price: product.price, image: product.images[0],
      category: product.category, rating: product.rating,
      specifications: product.specifications, features: product.features,
    })
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jenga.co.ke'
    const msg = generateWhatsAppProductMessage(product.name, product.price, `${origin}/products/${product.id}`, product.seller.name)
    window.open(`https://wa.me/254700000000?text=${msg}`, '_blank')
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        'group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 product-image-wrapper">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isFlashSale && (
            <span className="bg-flash-DEFAULT text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow">
              <Zap size={8} fill="white" /> FLASH
            </span>
          )}
          {!product.isFlashSale && product.discount && product.discount > 0 && (
            <span className="bg-flash-DEFAULT text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              -{product.discount}%
            </span>
          )}
          {product.isTrending && !product.isFlashSale && (
            <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              🔥 HOT
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all duration-200',
            wished
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-white text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
          )}
        >
          <Heart size={13} className={wished ? 'fill-white' : ''} />
        </button>

        {/* Quick actions (hover) */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <button
            onClick={handleWhatsApp}
            className="w-7 h-7 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#20BD5A] transition-colors"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle size={12} />
          </button>
          <button
            onClick={handleCompare}
            disabled={compareDisabled}
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-colors',
              compared ? 'bg-brand-600 text-white' : 'bg-white text-slate-500 hover:bg-brand-50 hover:text-brand-600',
              compareDisabled && 'opacity-40 cursor-not-allowed'
            )}
            aria-label={compared ? 'Remove from compare' : 'Add to compare'}
            title={compareDisabled ? 'Max 4 products' : compared ? 'Remove from compare' : 'Compare'}
          >
            <GitCompareArrows size={12} />
          </button>
        </div>

        {/* Social proof */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye size={8} />
          {proof.viewing} viewing
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Brand & verified */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider">{product.brand}</span>
          {product.seller.badge === 'authorized' && (
            <span className="flex items-center gap-0.5 text-[9px] text-blue-600 font-medium">
              <BadgeCheck size={10} /> Auth.
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 flex-1">{product.name}</h3>

        {/* Rating + sold count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={11} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
              ))}
            </div>
            <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
          </div>
          <span className="text-[9px] text-slate-400">{proof.soldToday} sold today</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <div className="text-base font-bold text-slate-900">{formatKES(product.price)}</div>
            {product.originalPrice && (
              <div className="text-[11px] text-slate-400 line-through">{formatKES(product.originalPrice)}</div>
            )}
          </div>
          {product.bnplAvailable && product.monthlyInstallment && (
            <div className="text-[9px] text-slate-500 text-right leading-tight">
              From<br /><span className="font-semibold text-brand-700">{formatKES(product.monthlyInstallment)}/mo</span>
            </div>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-xl text-xs font-semibold transition-colors"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={13} />
          Add to Cart
        </button>
      </div>
    </Link>
  )
}
