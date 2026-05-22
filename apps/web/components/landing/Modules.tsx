import {
  Shield, Package, Box, ShoppingCart,
  CreditCard, Store, Search, Star,
  Bell, Heart,
} from 'lucide-react'

const modules = [
  { icon: Heart, name: 'Health', endpoint: 'GET /health', status: 'live', description: 'Framework status & version' },
  { icon: Shield, name: 'Auth', endpoint: '/auth', status: 'live', description: 'JWT, registration, roles, OTP' },
  { icon: Package, name: 'Catalog', endpoint: '/products', status: 'live', description: 'Products, categories, variants' },
  { icon: Box, name: 'Inventory', endpoint: '/inventory', status: 'live', description: 'Transactional stock & reservations' },
  { icon: ShoppingCart, name: 'Orders', endpoint: '/orders', status: 'live', description: 'Order lifecycle, multi-seller split' },
  { icon: CreditCard, name: 'Payments', endpoint: '/payments', status: 'live', description: 'M-PESA STK Push, cards, refunds' },
  { icon: Store, name: 'Sellers', endpoint: '/sellers', status: 'live', description: 'Seller portal, KYC, payouts' },
  { icon: Search, name: 'Search', endpoint: '/search', status: 'live', description: 'Full-text, autocomplete, facets' },
  { icon: Star, name: 'Reviews', endpoint: '/reviews', status: 'live', description: 'Verified reviews, seller response' },
  { icon: Bell, name: 'Notifications', endpoint: '/notifications', status: 'live', description: 'WhatsApp, SMS, email dispatch' },
]

export default function Modules() {
  return (
    <section id="modules" className="relative py-24 sm:py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-emerald-400 text-sm font-medium mb-3">Backend Modules</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            10 modules, one API
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Every module is a NestJS service with its own controller, DTO validation, and Swagger documentation. All endpoints prefixed with <code className="text-emerald-400 text-sm bg-emerald-500/10 px-1.5 py-0.5 rounded">/api/v1/</code>
          </p>
        </div>

        {/* Module list */}
        <div className="max-w-3xl mx-auto space-y-2">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <div
                key={mod.name}
                className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium text-sm">{mod.name}</span>
                    <code className="text-xs text-zinc-500 font-mono">{mod.endpoint}</code>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{mod.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">{mod.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
