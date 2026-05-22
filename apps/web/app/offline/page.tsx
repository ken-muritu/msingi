'use client'

import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <WifiOff className="w-10 h-10 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">You&apos;re offline</h1>
      <p className="text-gray-400 max-w-sm mb-8">
        No internet connection detected. Check your connection and try again.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
