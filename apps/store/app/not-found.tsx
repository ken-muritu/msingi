import Link from 'next/link'
import { Home, Search, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl font-black text-slate-100 mb-4 select-none">404</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
        >
          <Home size={16} /> Back to Home
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-semibold transition-colors"
        >
          <ShoppingBag size={16} /> Browse Products
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-semibold transition-colors"
        >
          <Search size={16} /> Search
        </Link>
      </div>
    </div>
  )
}
