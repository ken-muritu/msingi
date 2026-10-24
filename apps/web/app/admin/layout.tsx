'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, Store, ShieldCheck,
  Building2, Menu, X, Zap, LogOut, Bell,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin?tab=orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin?tab=sellers', label: 'Sellers', icon: Store },
  { href: '/admin?tab=kyc', label: 'KYC', icon: ShieldCheck },
  { href: '/admin?tab=tenants', label: 'Tenants', icon: Building2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0f0f12] border-r border-white/[0.06] flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Zap size={14} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Msingi</p>
            <p className="text-[10px] text-white/40 mt-0.5">Admin Console</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-2 mb-2">Platform</p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname === '/admin'
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group
                  ${active
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }`}
              >
                <Icon size={15} className={active ? 'text-emerald-400' : 'text-white/30 group-hover:text-white/60'} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">Admin</p>
              <p className="text-[10px] text-white/30 truncate">admin@msingi.co.ke</p>
            </div>
            <button className="text-white/30 hover:text-white/60 transition-colors">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05]"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Systems Operational
          </div>
          <button className="relative p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
