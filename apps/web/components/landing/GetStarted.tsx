import { Terminal, ArrowRight, Github, BookOpen } from 'lucide-react'

export default function GetStarted() {
  return (
    <section id="get-started" className="relative py-24 sm:py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-emerald-400 text-sm font-medium mb-3">Get Started</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From zero to commerce in 5 minutes
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Clone, configure, deploy. Your entire commerce backend is running before your coffee gets cold.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto space-y-6">
          {[
            {
              step: '01',
              title: 'Clone & install',
              code: 'git clone https://github.com/ken-muritu/msingi.git && cd msingi && pnpm install',
            },
            {
              step: '02',
              title: 'Setup database',
              code: 'cp backend/.env.example backend/.env\n# Set your DATABASE_URL\npnpm db:push && pnpm --filter @msingi/backend db:seed',
            },
            {
              step: '03',
              title: 'Start development',
              code: 'pnpm dev\n# Frontend → http://localhost:3000\n# Backend  → http://localhost:4000\n# Swagger  → http://localhost:4000/api/docs',
            },
            {
              step: '04',
              title: 'Configure your business',
              code: '// jenga.config.ts — define your entire commerce business\nconst config: MsingiConfig = {\n  instance: { name: "My Store", vertical: "electronics" },\n  payments: { mpesa: { stkPush: true } },\n  modules: { marketplace: true, bnpl: true },\n}',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-xs font-mono text-emerald-400 font-bold">{item.step}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-zinc-400 whitespace-pre-wrap">{item.code}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seed credentials */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-emerald-400" />
              Seed Credentials
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { role: 'Admin', email: 'admin@jenga.co.ke', pass: 'admin123456' },
                { role: 'Seller', email: 'samsung@jenga.co.ke', pass: 'seller123456' },
                { role: 'Buyer', email: 'buyer@test.com', pass: 'buyer123456' },
              ].map((cred) => (
                <div key={cred.role} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="text-xs text-zinc-500 mb-1">{cred.role}</div>
                  <div className="text-xs font-mono text-zinc-300 truncate">{cred.email}</div>
                  <div className="text-xs font-mono text-zinc-500">{cred.pass}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/ken-muritu/msingi"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-all text-sm"
          >
            <Github size={16} />
            Star on GitHub
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/ken-muritu/msingi#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-medium rounded-xl hover:bg-white/5 hover:border-zinc-600 transition-all text-sm"
          >
            <BookOpen size={16} />
            Read the Docs
          </a>
        </div>
      </div>
    </section>
  )
}
