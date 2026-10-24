'use client'

import { ExternalLink, Store, Globe, Sparkles } from 'lucide-react'

const stores = [
  {
    name: 'Varidi',
    url: 'https://varidi.vercel.app/',
    description: 'Fashion & lifestyle store with curated collections and M-PESA checkout.',
    tags: ['Fashion', 'Lifestyle'],
    color: 'from-rose-500 to-orange-500',
    icon: Store,
  },
  {
    name: 'Aang Web',
    url: 'https://aangweb.vercel.app/',
    description: 'Modern electronics storefront with product filtering, wishlists, and fast delivery.',
    tags: ['Electronics', 'Tech'],
    color: 'from-blue-500 to-cyan-500',
    icon: Globe,
  },
  {
    name: 'AddPlus',
    url: 'https://addplus.vercel.app/',
    description: 'Multi-category marketplace with vendor management and real-time inventory.',
    tags: ['Marketplace', 'Multi-vendor'],
    color: 'from-violet-500 to-purple-500',
    icon: Sparkles,
  },
]

export default function Showcase() {
  return (
    <section id="showcase" className="relative py-24 sm:py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-emerald-400 text-sm font-medium mb-3">Built on Msingi</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Live stores in the wild
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Real e-commerce stores built and deployed on the Msingi platform. Each one customised for a different vertical.
          </p>
        </div>

        {/* Store cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stores.map((store) => {
            const Icon = store.icon
            return (
              <a
                key={store.name}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
              >
                {/* Gradient header */}
                <div className={`h-32 bg-gradient-to-br ${store.color} flex items-center justify-center relative`}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-extrabold text-white tracking-tight">{store.name}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">{store.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {store.tags.map((tag) => (
                        <span key={tag} className="text-[11px] font-medium text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Msingi Store CTA */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-sm mb-4">
            Plus the official demo store →
          </p>
          <a
            href="https://msingistore.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <Store size={14} />
            Msingi Store (Official Demo)
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  )
}
