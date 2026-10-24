'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { clientConfig } from '@/lib/config'

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white text-xs py-2 px-4 flex items-center justify-center gap-3 relative">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
        This is a live demo of the{' '}
        <a
          href={clientConfig.brand.platformUrl}
          target="_blank"
          rel="noreferrer"
          className="font-bold underline underline-offset-2 hover:text-indigo-200 inline-flex items-center gap-0.5"
        >
          Msingi Commerce Platform <ExternalLink size={10} />
        </a>
        — deploy your own store in minutes.
      </span>
      <a
        href={clientConfig.brand.platformUrl}
        target="_blank"
        rel="noreferrer"
        className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0"
      >
        Get Started →
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </div>
  )
}
