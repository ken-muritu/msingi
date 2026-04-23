import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { trendingProducts } from '@/lib/data'
import ProductCard from '@/components/products/ProductCard'

export default function TrendingSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              🔥 Trending on TikTok
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Products going viral right now</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
