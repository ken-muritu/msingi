'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, ChevronRight, BadgeCheck, MessageCircle, CreditCard, CheckCircle2, Minus, Plus } from 'lucide-react'
import { getProductById, getRelatedProducts, reviews, formatKES } from '@/lib/data'
import { clientConfig } from '@/lib/config'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const product = getProductById(id)

  if (!product) notFound()

  const related = getRelatedProducts(product)
  const productReviews = reviews.filter((r) => r.productId === id)

  return <ProductDetail product={product} related={related} productReviews={productReviews} />
}

function ProductDetail({
  product,
  related,
  productReviews,
}: {
  product: NonNullable<ReturnType<typeof getProductById>>
  related: ReturnType<typeof getRelatedProducts>
  productReviews: typeof reviews
}) {
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const inWishlist = useWishlistStore((s) => s.has(product.id))
  const router = useRouter()

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
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
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    const el = document.getElementById('product-actions')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const badgeLabel: Record<string, string> = {
    authorized: '🔵 Authorized Distributor',
    premium: '🟣 Premium Seller',
    verified: '✅ Verified Seller',
    basic: '⚪ Basic Seller',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Sticky mobile buy bar */}
      {stickyVisible && (
        <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 shadow-lg animate-slide-up">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 truncate">{product.name}</p>
            <p className="font-bold text-slate-900">{formatKES(product.price)}</p>
          </div>
          <button onClick={handleAddToCart} disabled={!product.inStock} className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-colors">
            <ShoppingCart size={15} /> Add
          </button>
          <button onClick={handleBuyNow} disabled={!product.inStock} className="bg-[#00A651] hover:bg-[#008742] disabled:bg-slate-200 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
            Buy Now
          </button>
        </div>
      )}
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
        <ChevronRight size={12} />
        <Link href={`/products?category=${product.category}`} className="hover:text-brand-600 transition-colors capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 mb-3 shadow-sm">
            <Image
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-6"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}
            <button
              onClick={() => toggleWishlist({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images[0], category: product.category })}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors ${inWishlist ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
            >
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-brand-500' : 'border-slate-100'}`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full">{product.brand}</span>
            {product.isFlashSale && <span className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">⚡ Flash Sale</span>}
            {product.isTrending && <span className="text-xs font-bold text-white bg-pink-500 px-2 py-0.5 rounded-full">🔥 Trending</span>}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
            <span className="text-sm text-slate-400">({product.reviewCount} reviews)</span>
            <button className="text-sm text-brand-600 hover:underline" onClick={() => setActiveTab('reviews')}>Read reviews</button>
          </div>

          {/* Price */}
          <div className="bg-brand-50 rounded-2xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">{formatKES(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">{formatKES(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  Save {formatKES(product.originalPrice! - product.price)}
                </span>
              )}
            </div>
            {product.bnplAvailable && product.monthlyInstallment && (
              <p className="text-sm text-slate-500 mt-1.5">
                Or pay <span className="font-semibold text-brand-700">{formatKES(product.monthlyInstallment)}/month</span> with Lipa Later BNPL
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">In Stock</span>
                {product.stockCount <= 10 && <span className="text-sm text-orange-600">· Only {product.stockCount} left!</span>}
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Qty:</span>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg"><Minus size={14} /></button>
              <span className="w-8 text-center font-semibold text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg"><Plus size={14} /></button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3" id="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all ${added ? 'bg-green-600 text-white' : 'bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white'}`}
            >
              {added ? <><CheckCircle2 size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-[#00A651] hover:bg-[#008742] disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-2xl font-semibold transition-colors"
            >
              <CreditCard size={18} /> Buy Now · M-PESA
            </button>
          </div>

          <a
            href={`https://wa.me/${clientConfig.business.whatsapp}?text=Hi! I'm interested in ${product.name} (${formatKES(product.price)})`}
            target="_blank" rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-2xl font-medium text-sm transition-colors"
          >
            <MessageCircle size={16} /> Enquire on WhatsApp
          </a>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, text: product.warranty.split(' ').slice(0, 3).join(' ') },
              { icon: Truck, text: `Delivery: ${product.deliveryDays}` },
              { icon: RotateCcw, text: '7-day returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 text-center bg-slate-50 rounded-xl p-2.5">
                <Icon size={16} className="text-brand-600" />
                <span className="text-[10px] text-slate-600 leading-tight">{text}</span>
              </div>
            ))}
          </div>

          {/* Seller */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-bold text-sm">
              {product.seller.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{product.seller.name}</p>
              <p className="text-xs text-slate-500">{badgeLabel[product.seller.badge]}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>★ {product.seller.rating}</p>
              <p className="text-slate-400">{product.seller.salesCount.toLocaleString()} sales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-1 border-b border-slate-200 mb-6">
          {(['specs', 'reviews', 'shipping'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab === 'specs' ? 'Specifications' : tab === 'reviews' ? `Reviews (${productReviews.length})` : 'Delivery & Returns'}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-brand-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Technical Specifications</h3>
              <dl className="divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex py-2 text-sm gap-4">
                    <dt className="text-slate-500 min-w-[120px] shrink-0">{key}</dt>
                    <dd className="text-slate-800 font-medium">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <p className="text-slate-500 text-sm">No reviews yet. Be the first!</p>
            ) : (
              productReviews.map((review) => (
                <div key={review.id} className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">{review.author[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{review.author}</p>
                      <p className="text-xs text-slate-400">{review.location} · {review.date}</p>
                    </div>
                    {review.verified && (
                      <span className="ml-auto text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BadgeCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex mb-1.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={13} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
                    ))}
                  </div>
                  <p className="font-semibold text-sm text-slate-800 mb-1">{review.title}</p>
                  <p className="text-sm text-slate-600">{review.body}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              {[
                { icon: Truck, color: 'text-brand-600', title: 'Standard Delivery', desc: `${formatKES(clientConfig.business.standardDelivery)} nationwide · ${product.deliveryDays}`, note: `Free on orders above ${formatKES(clientConfig.business.freeDeliveryThreshold)}` },
                { icon: Truck, color: 'text-orange-500', title: 'Express Delivery (Nairobi)', desc: `${formatKES(clientConfig.business.expressDelivery)} · Same day if ordered before 12pm` },
                { icon: RotateCcw, color: 'text-blue-500', title: 'Returns Policy', desc: '7-day returns for sealed/unused items. Contact support or use WhatsApp.' },
              ].map(({ icon: Icon, color, title, desc, note }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-semibold text-slate-800">{title}</p>
                    <p className="text-slate-500">{desc}</p>
                    {note && <p className="text-slate-500 text-xs mt-0.5">{note}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="font-semibold text-slate-800 mb-2">Warranty: {product.warranty}</p>
              <p className="text-slate-500 text-xs leading-relaxed">Keep your receipt and original packaging. For warranty claims, contact the seller or visit our support centre.</p>
            </div>
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
