import {
  Smartphone, MessageCircle, Truck, Shield,
  CreditCard, Search, Globe, Zap,
} from 'lucide-react'

const features = [
  {
    icon: CreditCard,
    title: 'M-PESA Native',
    description: 'STK Push, Lipa Na M-PESA, BNPL installments. Not a wrapper — deep Daraja integration with callbacks and reconciliation.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Commerce',
    description: 'Order via WhatsApp, get delivery updates, customer support — all automated with conversational commerce flows.',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: Truck,
    title: 'Logistics Built In',
    description: 'Sendy, Fargo, G4S courier integration. Same-day delivery zones, click-and-collect, installation scheduling.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Shield,
    title: 'Trust Systems',
    description: 'Verified sellers, escrow payments, dispute resolution, KEBS certification checks. Trust is not optional in African commerce.',
    color: 'from-violet-500 to-violet-700',
  },
  {
    icon: Search,
    title: 'Search & Discovery',
    description: 'Full-text search with autocomplete, faceted filtering, typo tolerance. Find products the way Kenyans actually search.',
    color: 'from-orange-500 to-orange-700',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'PWA-ready, offline-capable, optimized for 3G. 60%+ of African commerce happens on mobile — we build for that reality.',
    color: 'from-pink-500 to-pink-700',
  },
  {
    icon: Globe,
    title: 'Multi-Seller Marketplace',
    description: 'Commission management, seller dashboards, KYC verification, automated payouts. One platform, unlimited sellers.',
    color: 'from-cyan-500 to-cyan-700',
  },
  {
    icon: Zap,
    title: 'Config-Driven',
    description: 'One config file defines your entire business — modules, payments, branding, delivery zones. Switch verticals in minutes.',
    color: 'from-amber-500 to-amber-700',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-emerald-400 text-sm font-medium mb-3">Why Msingi?</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for how Africa actually trades
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Not a Shopify clone with an M-PESA plugin. Every module is designed for African commerce behavior from day one.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
