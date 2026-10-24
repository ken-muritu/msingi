'use client'

import Link from 'next/link'
import { User, ShoppingBag, Heart, MapPin, LogIn, UserPlus, Settings, Phone } from 'lucide-react'
import { clientConfig } from '@/lib/config'

export default function AccountPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">My Account</h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm mb-6">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={28} className="text-brand-600" />
        </div>
        <h2 className="font-bold text-slate-900 mb-1">Welcome back</h2>
        <p className="text-slate-500 text-sm mb-5">Sign in to access your orders, wishlist and saved addresses.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/account/login" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
            <LogIn size={15} /> Sign In
          </Link>
          <Link href="/account/register" className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
            <UserPlus size={15} /> Create Account
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: ShoppingBag, label: 'My Orders', href: '/account/orders' },
          { icon: Heart, label: 'Wishlist', href: '/wishlist' },
          { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
          { icon: Settings, label: 'Settings', href: '/account/settings' },
          { icon: Phone, label: 'Support', href: `https://wa.me/${clientConfig.business.whatsapp}` },
          { icon: UserPlus, label: 'Register', href: '/account/register' },
        ].map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow text-center">
            <Icon size={22} className="text-brand-600" />
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </Link>
        ))}
      </div>

      <div className="bg-brand-50 rounded-2xl p-4 text-sm text-brand-800 flex items-center gap-3">
        <Phone size={16} className="text-brand-600 shrink-0" />
        <span>Need help? Call or WhatsApp us at <a href={`tel:${clientConfig.business.phone}`} className="font-semibold hover:underline">{clientConfig.business.phone}</a></span>
      </div>
    </div>
  )
}
