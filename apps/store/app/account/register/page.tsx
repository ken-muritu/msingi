'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Zap, UserPlus, Loader2, CheckCircle2 } from 'lucide-react'
import { clientConfig } from '@/lib/config'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, email, phone, password } = form
    if (!firstName || !email || !phone || !password) { setError('Please fill in all required fields'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    await new Promise((r) => setTimeout(r, 1500))
    setDone(true); setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h1>
          <p className="text-slate-500 mb-6">Welcome to {clientConfig.brand.name}, {form.firstName}. You can now sign in.</p>
          <Link href="/account/login" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
            Sign In Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join {clientConfig.brand.name} for exclusive deals</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">First Name *</label>
              <input value={form.firstName} onChange={update('firstName')} placeholder="Amina" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Last Name</label>
              <input value={form.lastName} onChange={update('lastName')} placeholder="Hassan" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Email address *</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Phone (Safaricom) *</label>
            <input type="tel" value={form.phone} onChange={update('phone')} placeholder="0712 345 678" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Password *</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="Min. 8 characters"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${form.password.length >= i * 2 ? (form.password.length >= 8 ? 'bg-green-500' : 'bg-orange-400') : 'bg-slate-200'}`} />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-brand-600 hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link href="/account/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
