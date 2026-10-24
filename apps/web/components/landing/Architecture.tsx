export default function Architecture() {
  return (
    <section id="architecture" className="relative py-24 sm:py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-emerald-400 text-sm font-medium mb-3">Architecture</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Modern stack, zero compromises
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Turborepo monorepo with clear separation of concerns. Every piece is typed, tested, and production-ready.
          </p>
        </div>

        {/* Tech stack grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { layer: 'Frontend', tech: 'Next.js 14', detail: 'App Router, RSC, ISR for SEO', tag: 'apps/web' },
            { layer: 'Backend', tech: 'NestJS 10', detail: 'Modular, decorators, Swagger', tag: 'backend/' },
            { layer: 'Database', tech: 'PostgreSQL', detail: 'Prisma ORM, type-safe queries', tag: 'prisma/schema' },
            { layer: 'Styling', tech: 'Tailwind CSS', detail: 'Utility-first, responsive', tag: 'tailwind.config' },
            { layer: 'State', tech: 'Zustand', detail: 'Lightweight, persistent stores', tag: 'lib/store.ts' },
            { layer: 'Auth', tech: 'JWT + bcrypt', detail: 'Stateless, role-based access', tag: 'modules/auth' },
            { layer: 'Payments', tech: 'M-PESA Daraja', detail: 'STK Push, BNPL, callbacks', tag: 'modules/payments' },
            { layer: 'Types', tech: 'TypeScript', detail: 'End-to-end type safety', tag: '@msingi/types' },
            { layer: 'Monorepo', tech: 'Turborepo + pnpm', detail: 'Fast builds, workspace protocol', tag: 'turbo.json' },
          ].map((item) => (
            <div
              key={item.layer}
              className="p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{item.layer}</span>
                <code className="text-[10px] text-zinc-600 font-mono bg-zinc-800/50 px-1.5 py-0.5 rounded">{item.tag}</code>
              </div>
              <div className="text-white font-semibold">{item.tech}</div>
              <p className="text-sm text-zinc-500 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Monorepo structure */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="text-xs text-zinc-500 font-mono">project structure</span>
            </div>
            <pre className="p-5 text-sm font-mono text-zinc-400 leading-relaxed overflow-x-auto">
{`msingi/
├── apps/web/           → @msingi/web (Next.js storefront)
├── backend/            → @msingi/backend (NestJS API)
│   ├── src/modules/    → 10 domain modules
│   └── prisma/         → Schema + seed data
├── packages/
│   ├── types/          → @msingi/types (MsingiConfig system)
│   └── config/         → @msingi/config (loader + helpers)
├── templates/          → Vertical templates (electronics, fashion)
├── jenga.config.ts     → Reference implementation config
└── turbo.json          → Build pipeline`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
