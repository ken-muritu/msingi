import Link from 'next/link'
import {
  Smartphone, Laptop, Tv, Thermometer, RefreshCw,
  Headphones, Tablet, Flame, ChevronRight,
} from 'lucide-react'
import { categories } from '@/lib/data'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Smartphone, Laptop, Tv, Thermometer, RefreshCw,
  Headphones, Tablet, Flame,
}

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Shop by Category</h2>
          <p className="text-sm text-slate-500 mt-0.5">Find exactly what you need</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
        >
          All products <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.iconName] ?? Smartphone
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center leading-tight">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400">{cat.productCount}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
