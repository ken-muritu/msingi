import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'
import { featuredProducts } from '@/lib/data'
import ProductCard from '@/components/products/ProductCard'

export default function FeaturedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star size={22} className="text-yellow-400 fill-yellow-400" />
            Featured Products
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Hand-picked deals from top sellers</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
        >
          See all <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
