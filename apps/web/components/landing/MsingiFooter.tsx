import { Github, Twitter, Mail } from 'lucide-react'

export default function MsingiFooter() {
  return (
    <footer className="border-t border-zinc-800/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black text-xs">
              M
            </div>
            <div>
              <span className="font-bold text-white text-sm">msingi</span>
              <span className="text-zinc-500 text-sm ml-2">The Commerce Foundation for African Business</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ken-muritu/msingi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://twitter.com/maboroshiken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="mailto:hello@msingi.dev"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Msingi. Open source under MIT License.</p>
          <div className="flex items-center gap-4">
            <span>Built with Next.js, NestJS, Prisma, & Tailwind</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Made in Kenya 🇰🇪</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
