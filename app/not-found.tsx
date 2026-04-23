import Link from 'next/link'
import { Home, Search, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-extrabold text-slate-100 select-none">404</div>
      <h1 className="text-2xl font-bold text-slate-800 -mt-4 mb-3">Page Not Found</h1>
      <p className="text-slate-500 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Try browsing our products.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          <Home size={16} /> Go Home
        </Link>
        <Link
          href="/products"
          className="flex items-center gap-2 border border-slate-200 hover:border-brand-300 text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          <ShoppingBag size={16} /> Browse Products
        </Link>
      </div>
    </div>
  )
}
