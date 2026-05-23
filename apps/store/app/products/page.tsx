'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { products } from '@/lib/data'
import { clientConfig } from '@/lib/config'
import ProductCard from '@/components/product/ProductCard'

const priceRanges = [
  { label: 'Under Ksh 20,000', min: 0, max: 20000 },
  { label: 'Ksh 20,000 – 50,000', min: 20000, max: 50000 },
  { label: 'Ksh 50,000 – 100,000', min: 50000, max: 100000 },
  { label: 'Ksh 100,000 – 200,000', min: 100000, max: 200000 },
  { label: 'Over Ksh 200,000', min: 200000, max: Infinity },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [sortBy, setSortBy] = useState('relevance')

  const categoryParam = searchParams.get('category') ?? ''
  const searchParam = searchParams.get('search') ?? ''
  const saleParam = searchParams.get('sale') ?? ''

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [])

  const filtered = useMemo(() => {
    let list = [...products]
    if (categoryParam) list = list.filter((p) => p.category === categoryParam)
    if (saleParam === 'flash') list = list.filter((p) => p.isFlashSale)
    if (searchParam) {
      const q = searchParam.toLowerCase()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (selectedBrands.length > 0) list = list.filter((p) => selectedBrands.includes(p.brand))
    if (priceRange) list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)
    switch (sortBy) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating)
      case 'discount': return [...list].sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
      default: return list
    }
  }, [categoryParam, searchParam, saleParam, selectedBrands, priceRange, sortBy])

  const currentCategory = clientConfig.categories.find((c) => c.slug === categoryParam)
  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b])
  const clearFilters = () => { setSelectedBrands([]); setPriceRange(null) }
  const hasFilters = selectedBrands.length > 0 || priceRange !== null

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Category</h3>
        <ul className="space-y-1">
          <li>
            <a href="/products" className={`block text-sm px-2 py-1.5 rounded-lg transition-colors ${!categoryParam ? 'text-brand-600 bg-brand-50 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
              All Products
            </a>
          </li>
          {clientConfig.categories.map((cat) => (
            <li key={cat.slug}>
              <a href={`/products?category=${cat.slug}`} className={`block text-sm px-2 py-1.5 rounded-lg transition-colors ${categoryParam === cat.slug ? 'text-brand-600 bg-brand-50 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Brand</h3>
        <ul className="space-y-1">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 px-2 py-1">
                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="accent-brand-600 w-3.5 h-3.5" />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Price Range</h3>
        <ul className="space-y-1">
          {priceRanges.map((range) => (
            <li key={range.label}>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 px-2 py-1">
                <input type="radio" name="price" checked={priceRange?.min === range.min && priceRange?.max === range.max} onChange={() => setPriceRange({ min: range.min, max: range.max })} className="accent-brand-600 w-3.5 h-3.5" />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full text-xs text-red-500 hover:text-red-700 font-medium py-2 border border-red-200 rounded-lg transition-colors">
          Clear Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {searchParam ? `Search: "${searchParam}"` : currentCategory ? currentCategory.name : saleParam === 'flash' ? '⚡ Flash Sale' : 'All Products'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} products found</p>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-1.5 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm hover:bg-slate-50">
              <SlidersHorizontal size={14} />
              Filters {hasFilters && `(${selectedBrands.length + (priceRange ? 1 : 0)})`}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-500 hidden sm:block">Sort:</span>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-semibold text-slate-700">No products found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-brand-600 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={18} /></button>
            </div>
            <Sidebar />
            <button onClick={() => setFiltersOpen(false)} className="w-full bg-brand-600 text-white py-2.5 rounded-xl text-sm font-semibold mt-4">Apply</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
