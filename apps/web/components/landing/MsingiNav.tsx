'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Github, ExternalLink } from 'lucide-react'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#modules', label: 'Modules' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#demo', label: 'Demo' },
  { href: '#showcase', label: 'Showcase' },
]

export default function MsingiNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black text-sm group-hover:scale-110 transition-transform">
              M
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              msingi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/ken-muritu/msingi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="#get-started"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Get Started
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-zinc-400 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <a
                href="https://github.com/ken-muritu/msingi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href="#get-started"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-white text-black rounded-lg"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
