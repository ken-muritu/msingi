'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ShoppingCart, Star, MessageCircle, Share2, Shield,
  Truck, RefreshCw, BadgeCheck, ChevronRight, Wrench,
  CreditCard, CheckCircle2, Search, Package,
} from 'lucide-react'
import { getProductById, getRelatedProducts, reviews } from '@/lib/data'
import { useCartStore, useRecentlyViewedStore, useSellerProductsStore } from '@/lib/store'
import { formatKES, generateWhatsAppProductMessage } from '@/lib/utils'
import ProductCard from '@/components/products/ProductCard'
import MPesaModal from '@/components/checkout/MPesaModal'
import { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const sellerProducts = useSellerProductsStore((s) => s.products)

  const staticProduct = getProductById(id)
  const product = staticProduct ?? sellerProducts.find((p) => p.id === id)

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
  const [showMpesa, setShowMpesa] = useState(false)
  const [serialInput, setSerialInput] = useState('')
  const [serialStatus, setSerialStatus] = useState<'idle' | 'checking' | 'verified' | 'notfound'>('idle')
  const [installationAdded, setInstallationAdded] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const addRecent = useRecentlyViewedStore((s) => s.addItem)

  useEffect(() => {
    addRecent({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images[0], category: product.category, rating: product.rating })
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = () => {
    addItem({
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

  const handleWhatsApp = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://jenga.co.ke'}/products/${product.id}`
    const msg = generateWhatsAppProductMessage(product.name, product.price, url, product.seller.name)
    window.open(`https://wa.me/254700000000?text=${msg}`, '_blank')
  }

  const handleSerialCheck = async () => {
    if (!serialInput.trim()) return
    setSerialStatus('checking')
    await new Promise((r) => setTimeout(r, 1500))
    setSerialStatus(serialInput.length > 5 ? 'verified' : 'notfound')
  }

  const totalPrice = product.price + (installationAdded && product.installationFee ? product.installationFee : 0)

  const badgeLabel: Record<string, string> = {
    authorized: '🔵 Authorized Distributor',
    premium: '🟣 Premium Seller',
    verified: '✅ Verified Seller',
    basic: '⚪ Basic Seller',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
        <ChevronRight size={12} />
        <Link href={`/products?category=${product.category}`} className="hover:text-brand-600 transition-colors capitalize">{product.category.replace('-', ' ')}</Link>
        <ChevronRight size={12} />
        <span className="text-slate-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
            <Image
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-flash-DEFAULT text-white text-sm font-bold px-3 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}
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
          {/* Brand + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full">
              {product.brand}
            </span>
            {product.isFlashSale && (
              <span className="text-xs font-bold text-white bg-flash-DEFAULT px-2 py-0.5 rounded-full">
                ⚡ Flash Sale
              </span>
            )}
            {product.isTrending && (
              <span className="text-xs font-bold text-white bg-pink-500 px-2 py-0.5 rounded-full">
                🔥 Trending
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
            <span className="text-sm text-slate-400">({product.reviewCount} reviews)</span>
            <span className="text-sm text-brand-600 hover:underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
              Read reviews
            </span>
          </div>

          {/* Price */}
          <div className="bg-brand-50 rounded-2xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">{formatKES(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">{formatKES(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="text-sm font-bold text-flash-DEFAULT bg-red-50 px-2 py-0.5 rounded-full">
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
                {product.stockCount <= 10 && (
                  <span className="text-sm text-orange-600">· Only {product.stockCount} left!</span>
                )}
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Installation add-on */}
          {product.requiresInstallation && product.installationFee !== undefined && (
            <div
              onClick={() => setInstallationAdded(!installationAdded)}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-colors ${installationAdded ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
            >
              <Wrench size={18} className="text-brand-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Professional Installation</p>
                <p className="text-xs text-slate-500">Certified installer, delivered & set up in your home</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-700">
                  {product.installationFee === 0 ? 'FREE' : `+${formatKES(product.installationFee)}`}
                </p>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto mt-0.5 ${installationAdded ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                  {installationAdded && <CheckCircle2 size={12} className="text-white" />}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-2xl font-semibold transition-colors"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={() => setShowMpesa(true)}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-[#00A651] hover:bg-[#008742] disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-2xl font-semibold transition-colors"
            >
              <CreditCard size={18} />
              Buy Now – M-PESA
            </button>
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-2xl font-medium text-sm transition-colors"
          >
            <MessageCircle size={16} />
            Enquire on WhatsApp
          </button>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, text: product.warranty.split(' ').slice(0, 3).join(' ') },
              { icon: Truck, text: `Delivery: ${product.deliveryDays}` },
              { icon: RefreshCw, text: '7-day returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 text-center bg-slate-50 rounded-xl p-2.5">
                <Icon size={16} className="text-brand-600" />
                <span className="text-[10px] text-slate-600 leading-tight">{text}</span>
              </div>
            ))}
          </div>

          {/* Seller info */}
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

      {/* Serial Number Verification */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Search size={18} className="text-blue-600" />
          <h3 className="font-semibold text-blue-900">Verify Product Authenticity</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Anti-Counterfeit</span>
        </div>
        <p className="text-sm text-blue-700 mb-3">Enter the IMEI or serial number from the box to verify this product is genuine.</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter IMEI / Serial Number..."
            className="flex-1 border border-blue-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={serialInput}
            onChange={(e) => setSerialInput(e.target.value)}
          />
          <button
            onClick={handleSerialCheck}
            disabled={serialStatus === 'checking'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {serialStatus === 'checking' ? 'Checking…' : 'Verify'}
          </button>
        </div>
        {serialStatus === 'verified' && (
          <div className="mt-3 flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-3 py-2 text-sm">
            <CheckCircle2 size={16} /> <span>✅ Product verified — genuine {product.brand} item</span>
          </div>
        )}
        {serialStatus === 'notfound' && (
          <div className="mt-3 flex items-center gap-2 text-red-700 bg-red-50 rounded-xl px-3 py-2 text-sm">
            <Package size={16} /> <span>⚠️ Not found. Please contact support or the seller.</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8">
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
              <p className="text-slate-500 text-sm">No reviews yet. Be the first to review this product!</p>
            ) : (
              productReviews.map((review) => (
                <div key={review.id} className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                      {review.author[0]}
                    </div>
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
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Standard Delivery</p>
                  <p className="text-slate-500">KES 300 nationwide · {product.deliveryDays}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Free on orders above KES 3,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Express Delivery (Nairobi)</p>
                  <p className="text-slate-500">KES 500 · Same day if ordered before 12pm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Returns Policy</p>
                  <p className="text-slate-500">7-day returns for sealed/unused items. File a return request in your account or via WhatsApp.</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="font-semibold text-slate-800 mb-2">Warranty: {product.warranty}</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Manufacturer warranty is activated upon purchase. Keep your receipt and original packaging. For warranty claims, contact the seller or visit our dispute centre.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* M-PESA modal */}
      {showMpesa && (
        <MPesaModal
          amount={totalPrice}
          onClose={() => setShowMpesa(false)}
          onSuccess={(txId) => {
            setShowMpesa(false)
            setOrderConfirmed(true)
          }}
        />
      )}

      {/* Order confirmed banner */}
      {orderConfirmed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 size={18} />
          Order confirmed! Check WhatsApp for updates.
          <button onClick={() => setOrderConfirmed(false)} className="ml-2 text-white/70 hover:text-white">✕</button>
        </div>
      )}
    </div>
  )
}
