'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, Package, ShoppingCart, Star, DollarSign,
  Users, AlertCircle, CheckCircle2, Clock, ChevronRight, Eye,
} from 'lucide-react'
import { mockOrders, sellers } from '@/lib/data'
import { formatKES, timeAgo } from '@/lib/utils'

const seller = sellers[0]

const stats = [
  { label: 'Total Revenue', value: formatKES(seller.totalRevenue), icon: DollarSign, color: 'bg-brand-100 text-brand-700', change: '+12.5%' },
  { label: 'Orders This Month', value: '48', icon: ShoppingCart, color: 'bg-blue-100 text-blue-700', change: '+8.2%' },
  { label: 'Total Products', value: String(seller.productCount), icon: Package, color: 'bg-violet-100 text-violet-700', change: '+3' },
  { label: 'Avg. Rating', value: `${seller.rating} / 5`, icon: Star, color: 'bg-yellow-100 text-yellow-700', change: '↑ 0.2' },
]

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">{seller.name} · {seller.badge} seller</p>
        </div>
        <div className="flex gap-3">
          <Link href="/seller/products/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {change}
              </span>
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
          <div className="flex gap-4 mt-1.5 text-xs text-white/60">
            <span>📍 {seller.location}</span>
            <span>⭐ {seller.rating} · {seller.salesCount.toLocaleString()} sales</span>
            <span>📦 {seller.productCount} products</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-semibold px-3 py-1 rounded-full ${seller.isVerified ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {seller.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
          </div>
          <p className="text-xs text-white/50 mt-1">Member since 2022</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
        <button onClick={() => setActiveTab('orders')} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
          Recent Orders
        </button>
        <button onClick={() => setActiveTab('products')} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
          Products
        </button>
      </div>

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
                  <th className="py-3 px-4"></th>
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
                      <button className="text-slate-400 hover:text-brand-600 transition-colors">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
          <Package size={48} className="text-slate-200 mb-3" />
          <p className="font-semibold text-slate-700">Products Management</p>
          <p className="text-sm text-slate-400 mt-1 mb-5">Manage your product catalog, inventory, and pricing.</p>
          <Link href="/seller/products/new" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  )
}
