'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, ShoppingCart, Heart, User } from 'lucide-react'
import { useCartCount, useWishlistStore } from '@/lib/store'

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Shop', icon: LayoutGrid },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/wishlist', label: 'Saved', icon: Heart },
  { href: '/account', label: 'Account', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 safe-area-pb">
      <div className="flex items-stretch h-16">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          const badge = href === '/cart' ? cartCount : href === '/wishlist' ? wishlistCount : 0
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${active ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className="relative">
                <Icon size={20} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
