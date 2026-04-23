'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, Truck, Shield, MapPin } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/lib/store'
import { formatKES } from '@/lib/utils'
import MPesaModal from '@/components/checkout/MPesaModal'

type Step = 1 | 2 | 3

const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Ruiru',
  'Kitale', 'Malindi', 'Garissa', 'Kisii', 'Kakamega', 'Nyeri', 'Machakos',
  'Meru', 'Embu', 'Kericho', 'Kajiado', 'Kiambu', 'Kilifi',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const total = useCartTotal()
  const delivery = total >= 3000 ? 0 : 300

  const [step, setStep] = useState<Step>(1)
  const [showMpesa, setShowMpesa] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [mpesaRef, setMpesaRef] = useState('')

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', address: '', county: 'Nairobi', notes: '',
    paymentMethod: 'mpesa',
  })

  if (items.length === 0 && !confirmed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-brand-600 hover:underline font-medium">Browse Products</Link>
      </div>
    )
  }

  const handleDeliveryNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.paymentMethod === 'mpesa') {
      setShowMpesa(true)
    } else {
      completeOrder('CASH-' + Date.now())
    }
  }

  const completeOrder = (ref: string) => {
    const id = 'ORD-' + Date.now().toString().slice(-6)
    setOrderId(id)
    setMpesaRef(ref)
    setConfirmed(true)
    clearCart()
    setStep(3)
  }

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed! 🎉</h1>
        <p className="text-slate-500 mb-1">Order ID: <span className="font-bold text-slate-800">{orderId}</span></p>
        {mpesaRef && <p className="text-slate-500 mb-6">M-PESA Ref: <span className="font-bold text-green-700">{mpesaRef}</span></p>}
        <p className="text-slate-600 text-sm mb-8">
          Your order has been confirmed and will be delivered to <strong>{form.address}</strong>, {form.county} within <strong>2–4 business days</strong>.
          You will receive an SMS and WhatsApp update.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
            Track Order
          </Link>
          <Link href="/products" className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[{ n: 1, label: 'Delivery' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Confirm' }].map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${step >= n ? 'text-brand-700' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${step > n ? 'bg-brand-600 text-white' : step === n ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > n ? '✓' : n}
              </span>
              <span className="text-sm font-medium hidden sm:block">{label}</span>
            </div>
            {i < 2 && <ChevronRight size={14} className="text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleDeliveryNext} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><MapPin size={16} className="text-brand-600" />Delivery Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                  <input required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Sarah Wanjiku" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                  <input required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0700 000 000" type="tel" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="optional" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Delivery Address *</label>
                <input required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, building, area" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">County *</label>
                <select required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })}>
                  {counties.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Order Notes</label>
                <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special delivery instructions..." />
              </div>
              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-2xl font-semibold transition-colors">
                Continue to Payment →
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentNext} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Shield size={16} className="text-brand-600" />Payment Method</h2>

              {[
                { value: 'mpesa', label: 'M-PESA', desc: 'Pay with Safaricom M-PESA STK Push', badge: 'Most Popular', color: 'text-[#00A651]' },
                { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when your order arrives', badge: '', color: 'text-slate-700' },
                { value: 'airtel', label: 'Airtel Money', desc: 'Pay with Airtel Money', badge: '', color: 'text-red-600' },
              ].map((method) => (
                <label key={method.value} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${form.paymentMethod === method.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value={method.value} checked={form.paymentMethod === method.value} onChange={() => setForm({ ...form, paymentMethod: method.value })} className="mt-0.5 accent-brand-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${method.color}`}>{method.label}</span>
                      {method.badge && <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full font-medium">{method.badge}</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                  </div>
                </label>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-2xl font-medium text-sm hover:bg-slate-50 transition-colors">
                  ← Back
                </button>
                <button type="submit" className="flex-1 bg-[#00A651] hover:bg-[#008742] text-white py-3 rounded-2xl font-semibold text-sm transition-colors">
                  Pay {formatKES(total + delivery)}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Order Summary</h3>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2.5">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 line-clamp-1 font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">×{item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-800 shrink-0">{formatKES(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span><span>{formatKES(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1"><Truck size={12} />Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : formatKES(delivery)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total</span><span>{formatKES(total + delivery)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMpesa && (
        <MPesaModal
          amount={total + delivery}
          onClose={() => setShowMpesa(false)}
          onSuccess={(ref) => { setShowMpesa(false); completeOrder(ref) }}
        />
      )}
    </div>
  )
}
