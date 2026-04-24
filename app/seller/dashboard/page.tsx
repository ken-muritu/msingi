'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package, ShoppingCart, Star, DollarSign, Eye,
  CheckCircle2, Pencil, Trash2, Plus, AlertTriangle, Zap, TrendingUp,
} from 'lucide-react'
import { mockOrders, sellers, products as staticProducts } from '@/lib/data'
import { useSellerProductsStore } from '@/lib/store'
import { formatKES, timeAgo } from '@/lib/utils'
import type { Product } from '@/lib/data'

const seller = sellers[0]

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-teal-100 text-teal-700',
}

function StockBadge({ count }: { count: number }) {
  if (count === 0) return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
  if (count <= 5) return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{count} left</span>
  return <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{count} in stock</span>
}

function ProductRow({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isSellerAdded = product.id.startsWith('sp-')

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm line-clamp-1">{product.name}</p>
            <p className="text-xs text-slate-400">{product.brand}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-slate-500 text-xs capitalize">{product.category.replace('-', ' ')}</td>
      <td className="py-3 px-4">
        <p className="font-semibold text-slate-800 text-sm">{formatKES(product.price)}</p>
        {product.originalPrice && (
          <p className="text-xs text-slate-400 line-through">{formatKES(product.originalPrice)}</p>
        )}
      </td>
      <td className="py-3 px-4"><StockBadge count={product.stockCount} /></td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {product.isFeatured && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded-full">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
          {product.isFlashSale && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
              <Zap size={9} fill="currentColor" /> Flash
            </span>
          )}
          {product.isTrending && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-full">
              <TrendingUp size={9} /> Hot
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Link href={`/products/${product.id}`} className="text-slate-400 hover:text-brand-600 transition-colors" title="View">
            <Eye size={15} />
          </Link>
          {isSellerAdded ? (
            <>
              <Link href={`/seller/products/${product.id}/edit`} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                <Pencil size={15} />
              </Link>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => onDelete(product.id)} className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-lg font-medium hover:bg-red-600">Delete</button>
                  <button onClick={() => setConfirmDelete(false)} className="text-[10px] text-slate-500 hover:text-slate-700">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              )}
            </>
          ) : (
            <span className="text-[10px] text-slate-400">Catalog</span>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')
  const [productFilter, setProductFilter] = useState<'all' | 'mine'>('all')
  const { products: sellerProducts, deleteProduct } = useSellerProductsStore()

  const myStaticProducts = staticProducts.filter((p) => p.seller.id === seller.id)
  const allSellerProducts = [...myStaticProducts, ...sellerProducts]
  const displayProducts = productFilter === 'mine' ? sellerProducts : allSellerProducts

  const stats = [
    { label: 'Total Revenue', value: formatKES(seller.totalRevenue), icon: DollarSign, color: 'bg-brand-100 text-brand-700', change: '+12.5%' },
    { label: 'Orders This Month', value: '48', icon: ShoppingCart, color: 'bg-blue-100 text-blue-700', change: '+8.2%' },
    { label: 'Listed Products', value: String(allSellerProducts.length + sellerProducts.length), icon: Package, color: 'bg-violet-100 text-violet-700', change: `+${sellerProducts.length} new` },
    { label: 'Avg. Rating', value: `${seller.rating} / 5`, icon: Star, color: 'bg-yellow-100 text-yellow-700', change: '↑ 0.2' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">{seller.name} · {seller.badge} seller</p>
        </div>
        <Link href="/seller/products/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Seller profile banner */}
      <div className="bg-gradient-to-r from-slate-800 to-brand-900 rounded-2xl p-5 mb-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">
          {seller.name[0]}
        </div>
        <div className="flex-1">
          <p className="font-bold">{seller.name}</p>
          <p className="text-sm text-white/70">{seller.description}</p>
          <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-white/60">
            <span>📍 {seller.location}</span>
            <span>⭐ {seller.rating} · {seller.salesCount.toLocaleString()} sales</span>
            <span>📦 {allSellerProducts.length} products</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-xs font-semibold px-3 py-1 rounded-full ${seller.isVerified ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {seller.isVerified ? '✅ Verified' : '⏳ Pending'}
          </div>
          <p className="text-xs text-white/50 mt-1">Member since 2022</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
        <button onClick={() => setActiveTab('orders')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
          Recent Orders
        </button>
        <button onClick={() => setActiveTab('products')}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
          Products {sellerProducts.length > 0 && <span className="ml-1 bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{sellerProducts.length}</span>}
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Date</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-brand-700">{order.id}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-slate-400">{order.county}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{order.items.length} item(s)</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{formatKES(order.total)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{timeAgo(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button className="text-slate-400 hover:text-brand-600 transition-colors"><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { key: 'all' as const, label: `All (${allSellerProducts.length})` },
                { key: 'mine' as const, label: `My Listings (${sellerProducts.length})` },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setProductFilter(key)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${productFilter === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
                  {label}
                </button>
              ))}
            </div>
            <Link href="/seller/products/new"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">
              <Plus size={15} /> Add Product
            </Link>
          </div>

          {displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
              <Package size={48} className="text-slate-200 mb-3" />
              <p className="font-semibold text-slate-700">No products yet</p>
              <p className="text-sm text-slate-400 mt-1 mb-5">Add your first product to start selling on Jenga Electronics.</p>
              <Link href="/seller/products/new" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {sellerProducts.length > 0 && productFilter === 'all' && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-50 border-b border-brand-100 text-xs text-brand-700">
                  <CheckCircle2 size={13} />
                  <span><strong>{sellerProducts.length}</strong> product{sellerProducts.length !== 1 ? 's' : ''} added by you are live on the platform</span>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Labels</th>
                      <th className="py-3 px-4 font-semibold text-slate-600 text-xs text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {displayProducts.map((product) => (
                      <ProductRow key={product.id} product={product} onDelete={deleteProduct} />
                    ))}
                  </tbody>
                </table>
              </div>
              {displayProducts.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <span>Showing {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}</span>
                  {productFilter === 'all' && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle size={11} />
                      Catalog items cannot be edited here — contact admin
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
