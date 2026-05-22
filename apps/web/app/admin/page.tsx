'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3, Users, Package, ShoppingCart, AlertTriangle,
  TrendingUp, DollarSign, Shield, Store, CheckCircle2, RefreshCw,
} from 'lucide-react'
import { sellers as mockSellers, products, mockOrders } from '@/lib/data'
import { formatKES, timeAgo } from '@/lib/utils'
import { api, type ApiOrder, type ApiSeller } from '@/lib/api'


const badgeColors: Record<string, string> = {
  authorized: 'bg-blue-100 text-blue-700',
  premium: 'bg-violet-100 text-violet-700',
  verified: 'bg-green-100 text-green-700',
  basic: 'bg-slate-100 text-slate-600',
}

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-teal-100 text-teal-700',
}

const ORDER_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'orders'>('overview')
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [liveSellers, setLiveSellers] = useState<ApiSeller[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [orderPage, setOrderPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async (page = 1, status?: string) => {
    setLoading(true)
    const result = await api.adminGetAllOrders(page, status)
    if (result) {
      setOrders(result.data)
      setTotalOrders(result.total)
      setIsLive(true)
    } else {
      setOrders(mockOrders.map((o: any) => ({ ...o, orderNumber: o.id, paymentStatus: 'paid', items: [], tax: 0, deliveryFee: 0, discount: 0, subtotal: o.total, mpesaReceiptNumber: null, mpesaTransactionId: null, shippingAddress: {} })))
      setIsLive(false)
    }
    setLoading(false)
  }, [])

  const fetchSellers = useCallback(async () => {
    const result = await api.adminGetSellers()
    if (result) setLiveSellers(result.data)
  }, [])

  useEffect(() => { fetchOrders(orderPage, statusFilter) }, [orderPage, statusFilter, fetchOrders])
  useEffect(() => { fetchSellers() }, [fetchSellers])

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId)
    await api.adminUpdateOrderStatus(orderId, status)
    await fetchOrders(orderPage, statusFilter)
    setUpdatingId(null)
  }

  const displaySellers = liveSellers.length > 0
    ? liveSellers.map((s) => ({ ...s, name: s.businessName, isVerified: s.verified, productCount: 0, totalRevenue: s.salesCount * 5000 }))
    : mockSellers

  const platformStats = [
    { label: 'Active Sellers', value: isLive ? String(liveSellers.length) : String(mockSellers.length), icon: Store, color: 'text-violet-600 bg-violet-100', change: '' },
    { label: 'Total Products', value: String(products.length), icon: Package, color: 'text-blue-600 bg-blue-100', change: '' },
    { label: 'Total Orders', value: isLive ? totalOrders.toLocaleString() : '1,248', icon: ShoppingCart, color: 'text-green-600 bg-green-100', change: '' },
    { label: 'API Status', value: isLive ? 'Live' : 'Mock', icon: DollarSign, color: isLive ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100', change: '' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-brand-600" />
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm">Jenga Platform · Manage sellers, orders, and platform health</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          All Systems Operational
        </div>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 w-fit mb-4">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Connected to live API
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {platformStats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-xs font-medium text-green-600 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-800 text-sm">3 Sellers Pending Verification</p>
          <p className="text-xs text-orange-600 mt-0.5">Review and approve seller applications to maintain platform quality.</p>
        </div>
        <button className="ml-auto text-xs text-orange-700 hover:underline font-medium shrink-0">Review →</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'sellers', label: 'Sellers' },
          { key: 'orders', label: 'Orders' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'overview' | 'sellers' | 'orders')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top categories */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={16} />Top Categories by Sales</h3>
            <div className="space-y-3">
              {[
                { name: 'Smartphones', pct: 35, value: 'KES 4.3M' },
                { name: 'Laptops', pct: 22, value: 'KES 2.7M' },
                { name: 'Televisions', pct: 18, value: 'KES 2.2M' },
                { name: 'Fridges', pct: 14, value: 'KES 1.7M' },
                { name: 'Accessories', pct: 11, value: 'KES 1.4M' },
              ].map(({ name, pct, value }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{name}</span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={16} />Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: CheckCircle2, color: 'text-green-500', text: 'New seller "TechHub Kenya" verified', time: '2h ago' },
                { icon: ShoppingCart, color: 'text-blue-500', text: '48 new orders received today', time: '3h ago' },
                { icon: AlertTriangle, color: 'text-orange-500', text: 'Dispute filed for order ORD-8821', time: '5h ago' },
                { icon: Users, color: 'text-violet-500', text: '127 new customer registrations', time: '1d ago' },
                { icon: Package, color: 'text-brand-500', text: 'Samsung added 15 new products', time: '1d ago' },
              ].map(({ icon: Icon, color, text, time }) => (
                <div key={text} className="flex items-start gap-3 text-sm">
                  <Icon size={15} className={`${color} shrink-0 mt-0.5`} />
                  <span className="flex-1 text-slate-700">{text}</span>
                  <span className="text-slate-400 text-xs shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sellers */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Seller</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Sales</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Badge</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displaySellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{seller.name}</p>
                      <p className="text-xs text-slate-400">{seller.salesCount.toLocaleString()} sales</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{seller.location ?? '—'}</td>
                    <td className="py-3 px-4">
                      <span className="text-yellow-600 font-medium">★ {seller.rating}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{seller.salesCount?.toLocaleString() ?? 0}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${badgeColors[seller.badge]}`}>
                        {seller.badge}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {seller.isVerified ? (
                        <span className="flex items-center gap-1 text-xs text-green-700"><CheckCircle2 size={12} />Verified</span>
                      ) : (
                        <button className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium hover:bg-orange-100 transition-colors">
                          Verify →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-500">Filter:</span>
            {[undefined, ...ORDER_STATUSES].map((s) => (
              <button
                key={s ?? 'all'}
                onClick={() => { setStatusFilter(s); setOrderPage(1) }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                  statusFilter === s
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s ?? 'All'}
              </button>
            ))}
            <button onClick={() => fetchOrders(orderPage, statusFilter)} className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
              <RefreshCw size={12} />{loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Order</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Payment</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Date</th>
                    {isLive && <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs">Update</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-brand-700">{order.orderNumber}</p>
                        <p className="text-xs text-slate-400">{order.id.slice(0, 8)}…</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{(order.shippingAddress as any)?.name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{order.paymentMethod}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{formatKES(order.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{order.paymentStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{timeAgo(order.createdAt)}</td>
                      {isLive && (
                        <td className="py-3 px-4">
                          <select
                            defaultValue={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {isLive && totalOrders > 20 && (
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Showing {((orderPage - 1) * 20) + 1}–{Math.min(orderPage * 20, totalOrders)} of {totalOrders}</span>
              <div className="flex gap-2">
                <button disabled={orderPage <= 1} onClick={() => setOrderPage((p) => p - 1)} className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-slate-50">← Prev</button>
                <button disabled={orderPage * 20 >= totalOrders} onClick={() => setOrderPage((p) => p + 1)} className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-slate-50">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
