'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Users, Radio, ChevronRight, ShoppingCart } from 'lucide-react'
import { products } from '@/lib/data'
import { formatKES } from '@/lib/utils'
import { useCartStore } from '@/lib/store'

const tiktokVideos = [
  { id: 't1', creator: '@TechKe254', followers: '280K', title: 'Unboxing the cheapest gaming laptop in Kenya 😱', views: '1.2M', thumbnail: products[1]?.images[0] ?? '', product: products[1] },
  { id: 't2', creator: '@GraceReviews', followers: '190K', title: 'Is this Samsung fridge worth KES 65K? Honest review 🧊', views: '890K', thumbnail: products[3]?.images[0] ?? '', product: products[3] },
  { id: 't3', creator: '@NairobiTech', followers: '140K', title: 'M-PESA hack: buy iPhone on Jenga in 3 taps 📱', views: '620K', thumbnail: products[0]?.images[0] ?? '', product: products[0] },
]

export default function SocialCommerce() {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <section className="py-10 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-extrabold text-white">TikTok</span>
              <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">× Jenga</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Shop What Kenya Watches</h2>
            <p className="text-slate-400 text-sm mt-0.5">Products trending from Kenyan creators</p>
          </div>
          <Link href="/live" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
            <Radio size={14} className="text-red-500 animate-pulse" />
            Watch Live
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* TikTok video cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tiktokVideos.map((vid) => (
            <div key={vid.id} className="bg-slate-800 rounded-2xl overflow-hidden group hover:bg-slate-700 transition-colors">
              {/* Thumbnail */}
              <div className="relative aspect-[9/14] sm:aspect-video overflow-hidden bg-slate-700">
                {vid.thumbnail && (
                  <Image src={vid.thumbnail} alt={vid.title} fill className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </div>
                {/* Creator badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {vid.creator[1].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{vid.creator}</p>
                    <p className="text-slate-300 text-[10px]">{vid.followers} followers</p>
                  </div>
                </div>
                {/* Views */}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Users size={9} /> {vid.views}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-white text-sm font-medium line-clamp-2 mb-3">{vid.title}</p>
                {vid.product && (
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
                      <Image src={vid.product.images[0]} alt={vid.product.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium line-clamp-1">{vid.product.name}</p>
                      <p className="text-brand-400 text-xs font-bold">{formatKES(vid.product.price)}</p>
                    </div>
                    <button
                      onClick={() => addItem({ id: vid.product!.id, name: vid.product!.name, brand: vid.product!.brand, price: vid.product!.price, image: vid.product!.images[0], category: vid.product!.category, sellerId: vid.product!.seller.id, sellerName: vid.product!.seller.name })}
                      className="shrink-0 w-8 h-8 bg-brand-600 hover:bg-brand-500 rounded-lg flex items-center justify-center text-white transition-colors"
                    >
                      <ShoppingCart size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live CTA banner */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-l from-white" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold uppercase tracking-wide">Live Now</span>
              </div>
              <h3 className="text-white font-extrabold text-lg">Grace Njeri is LIVE — Flash Deals on Smartphones</h3>
              <p className="text-red-200 text-sm mt-0.5 flex items-center gap-1">
                <Users size={12} /> 312 people watching right now
              </p>
            </div>
            <Link
              href="/live"
              className="flex items-center gap-2 bg-white text-red-600 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap hover:bg-red-50 transition-colors shrink-0"
            >
              <Play size={16} /> Join Live
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
