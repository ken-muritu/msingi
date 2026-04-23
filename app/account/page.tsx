'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User, Package, Heart, Star, LogOut, ChevronRight,
  MapPin, Phone, Mail, Shield, Truck, CheckCircle2,
} from 'lucide-react'
import { mockOrders } from '@/lib/data'
import { formatKES, timeAgo } from '@/lib/utils'

const tabs = ['orders', 'profile', 'loyalty'] as const
type Tab = typeof tabs[number]

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            SW
          </div>
          <div>
            <h1 className="text-xl font-bold">Sarah Wanjiku</h1>
            <p className="text-brand-200 text-sm">sarah.wanjiku@email.com</p>
            <p className="text-brand-200 text-sm">+254 700 000 000</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-brand-300">Loyalty Points</p>
            <p className="text-2xl font-extrabold">2,450</p>
            <p className="text-xs text-brand-300">Gold Member</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-6">
        {[
          { key: 'orders', label: 'My Orders', icon: Package },
          { key: 'profile', label: 'Profile', icon: User },
          { key: 'loyalty', label: 'Loyalty', icon: Star },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as Tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === key ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Order ID</p>
                  <p className="font-bold text-sm text-slate-900">{order.id}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 line-clamp-1 flex-1">{item.name}</span>
                    <span className="text-slate-500 ml-2 shrink-0">×{item.quantity}</span>
                    <span className="text-slate-800 font-medium ml-3 shrink-0">{formatKES(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={11} />{order.county}</span>
                  <span>{timeAgo(order.createdAt)}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="font-bold text-slate-900">{formatKES(order.total)}</p>
                </div>
              </div>

              {order.status === 'shipped' && (
                <div className="mt-3 flex items-center gap-2 bg-purple-50 text-purple-700 rounded-xl px-3 py-2 text-xs">
                  <Truck size={13} />
                  <span>Out for delivery · Est. arrival today</span>
                </div>
              )}
              {order.status === 'delivered' && (
                <div className="mt-3 flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-3 py-2 text-xs">
                  <CheckCircle2 size={13} />
                  <span>Delivered · M-PESA Ref: {order.mpesaRef}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
          {[
            { icon: User, label: 'Full Name', value: 'Sarah Wanjiku' },
            { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
            { icon: Mail, label: 'Email', value: 'sarah.wanjiku@email.com' },
            { icon: MapPin, label: 'Default Address', value: 'Kilimani, Nairobi' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={16} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-800">{value}</p>
              </div>
              <button className="text-xs text-brand-600 hover:underline">Edit</button>
            </div>
          ))}
          <div className="pt-2 flex gap-3">
            <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              Save Changes
            </button>
            <button className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Loyalty tab */}
      {activeTab === 'loyalty' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white">
            <p className="text-sm font-medium opacity-80 mb-1">Your Balance</p>
            <p className="text-4xl font-extrabold">2,450 pts</p>
            <p className="text-sm opacity-80 mt-1">≈ {formatKES(2450 * 0.1)} value</p>
            <div className="mt-4 bg-white/20 rounded-xl p-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Gold Member</span>
                <span>5,000 pts to Platinum</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '49%' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">How to Earn</h3>
            <div className="space-y-3">
              {[
                { icon: '🛒', label: 'Every KES 100 spent', pts: '+1 pt' },
                { icon: '⭐', label: 'Leave a product review', pts: '+10 pts' },
                { icon: '👥', label: 'Refer a friend', pts: '+100 pts' },
                { icon: '📱', label: 'Install the app', pts: '+50 pts' },
              ].map(({ icon, label, pts }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="text-xl">{icon}</span>
                  <span className="flex-1 text-slate-600">{label}</span>
                  <span className="font-semibold text-green-600">{pts}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Redeem Points</h3>
            <p className="text-sm text-slate-500 mb-4">Use your points to get discounts on your next order.</p>
            <div className="grid grid-cols-3 gap-3">
              {[100, 500, 1000].map((pts) => (
                <button key={pts} disabled={2450 < pts} className="border-2 border-brand-200 text-brand-700 rounded-xl py-3 text-sm font-semibold hover:bg-brand-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {pts} pts<br />
                  <span className="text-xs font-normal text-slate-500">= {formatKES(pts * 0.1)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
