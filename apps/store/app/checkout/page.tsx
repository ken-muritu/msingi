'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, CheckCircle2, Smartphone, CreditCard, Banknote, ArrowRight, Loader2 } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/lib/store'
import { formatKES } from '@/lib/data'
import { clientConfig } from '@/lib/config'

type Step = 'contact' | 'shipping' | 'payment'
type PayMethod = 'mpesa' | 'card' | 'cod'

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const subtotal = useCartTotal()
  const delivery = subtotal >= clientConfig.business.freeDeliveryThreshold ? 0 : clientConfig.business.standardDelivery
  const total = subtotal + delivery

  const [step, setStep] = useState<Step>('contact')
  const [method, setMethod] = useState<PayMethod>('mpesa')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Nairobi')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mpesaPrompt, setMpesaPrompt] = useState(false)

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-brand-600 hover:underline">Continue shopping →</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-2">Thank you, {firstName}! Your order has been placed.</p>
        <p className="text-sm text-slate-400 mb-6">You&apos;ll receive an SMS confirmation shortly.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const steps: { id: Step; label: string }[] = [
    { id: 'contact', label: 'Contact' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ]
  const stepIdx = steps.findIndex((s) => s.id === step)

  const handlePay = async () => {
    setLoading(true)
    if (method === 'mpesa') {
      setMpesaPrompt(true)
      await new Promise((r) => setTimeout(r, 3000))
      setMpesaPrompt(false)
    } else {
      await new Promise((r) => setTimeout(r, 1500))
    }
    clearCart()
    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => i < stepIdx && setStep(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${s.id === step ? 'bg-brand-600 text-white' : i < stepIdx ? 'bg-brand-100 text-brand-700 cursor-pointer hover:bg-brand-200' : 'bg-slate-100 text-slate-400 cursor-default'}`}
            >
              {i < stepIdx && <CheckCircle2 size={14} />}
              {i + 1}. {s.label}
            </button>
            {i < steps.length - 1 && <ChevronRight size={14} className="text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'contact' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Amina" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Hassan" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="amina@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Phone (Safaricom for M-PESA)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="0712 345 678" />
              </div>
              <button
                onClick={() => setStep('shipping')}
                disabled={!firstName || !phone}
                className="mt-6 w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Continue to Shipping <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Delivery Address</h2>
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Street Address / Estate</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Westlands, Along Waiyaki Way" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">City / Town</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setStep('payment')}
                disabled={!address}
                className="mt-6 w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Continue to Payment <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'mpesa' as PayMethod, icon: Smartphone, label: 'M-PESA STK Push', desc: 'Receive prompt on your Safaricom number', badge: 'Recommended' },
                  { id: 'card' as PayMethod, icon: CreditCard, label: 'Visa / Mastercard', desc: 'Secure card payment via Pesapal', badge: '' },
                  { id: 'cod' as PayMethod, icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when your order arrives', badge: '' },
                ].map(({ id, icon: Icon, label, desc, badge }) => (
                  <label key={id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === id ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="sr-only" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        {label}
                        {badge && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                      </p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                      {method === id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>

              {method === 'mpesa' && (
                <div className="bg-green-50 rounded-xl p-3 mb-4 text-sm text-green-800">
                  <p className="font-semibold">📱 STK Push to: {phone || '07XX XXX XXX'}</p>
                  <p className="text-xs mt-0.5 text-green-600">Enter your M-PESA PIN when prompted. Do not close this page.</p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-[#00A651] hover:bg-[#008742] disabled:bg-slate-200 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> {mpesaPrompt ? 'Waiting for M-PESA…' : 'Processing…'}</>
                ) : (
                  <>Pay {formatKES(total)} {method === 'mpesa' ? '· M-PESA' : method === 'card' ? '· Card' : '· COD'}</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
            <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full flex items-center justify-center shrink-0">{item.quantity}</span>
                  <span className="flex-1 text-slate-600 truncate">{item.name}</span>
                  <span className="font-medium text-slate-800 shrink-0">{formatKES(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="border-t border-slate-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><dt>Subtotal</dt><dd>{formatKES(subtotal)}</dd></div>
              <div className="flex justify-between text-slate-500"><dt>Delivery</dt><dd className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : formatKES(delivery)}</dd></div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-1 border-t border-slate-100"><dt>Total</dt><dd>{formatKES(total)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
