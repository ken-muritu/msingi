import { ArrowRight, Github, Terminal } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Open Source Commerce Framework
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
          <span className="text-white">The commerce </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            foundation
          </span>
          <br />
          <span className="text-white">for African business</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Deploy a complete commerce business in weeks, not months.
          M-PESA, WhatsApp, logistics, and trust systems{' '}
          <span className="text-zinc-300 font-medium">built in</span> — not bolted on.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#get-started"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-all text-sm"
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/ken-muritu/msingi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-medium rounded-xl hover:bg-white/5 hover:border-zinc-600 transition-all text-sm"
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>

        {/* Terminal preview */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-2">
                <Terminal size={12} />
                terminal
              </div>
            </div>
            <div className="p-5 text-left font-mono text-sm leading-relaxed">
              <div className="text-zinc-500">{"# Clone and start in 60 seconds"}</div>
              <div className="mt-2">
                <span className="text-emerald-400">$</span>
                <span className="text-zinc-300">{" git clone https://github.com/ken-muritu/msingi.git"}</span>
              </div>
              <div>
                <span className="text-emerald-400">$</span>
                <span className="text-zinc-300">{" cd msingi && pnpm install"}</span>
              </div>
              <div>
                <span className="text-emerald-400">$</span>
                <span className="text-zinc-300">{" pnpm db:push && pnpm dev"}</span>
              </div>
              <div className="mt-3 text-zinc-500">
                {"  ▲ Next.js 14    → http://localhost:3000"}
              </div>
              <div className="text-zinc-500">
                {"  🏗 Msingi API   → http://localhost:4000"}
              </div>
              <div className="text-zinc-500">
                {"  📚 Swagger docs → http://localhost:4000/api/docs"}
              </div>
              <div className="mt-2 text-emerald-400">
                {"  ✓ Ready in 2.5s"}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '10', label: 'Backend Modules' },
            { value: '12', label: 'Database Models' },
            { value: 'KES', label: 'Currency Native' },
            { value: 'MIT', label: 'Licensed' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
