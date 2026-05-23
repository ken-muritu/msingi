'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, MessageCircle } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/lib/store'
import { formatKES } from '@/lib/data'
import { clientConfig } from '@/lib/config'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const subtotal = useCartTotal()
  const deliveryFee = subtotal >= clientConfig.business.freeDeliveryThreshold ? 0 : clientConfig.business.standardDelivery
  const total = subtotal + deliveryFee

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order:\n\n${items.map((i) => `• ${i.name} x${i.quantity} — ${formatKES(i.price * i.quantity)}`).join('\n')}\n\nTotal: ${formatKES(total)}`
  )

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 shadow-sm">
              <Link href={`/products/${item.id}`} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wide">{item.brand}</p>
                <Link href={`/products/${item.id}`} className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-brand-600 transition-colors">
                  {item.name}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{item.sellerName}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-1.5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{formatKES(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>
            <dl className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal ({items.reduce((t, i) => t + i.quantity, 0)} items)</dt>
                <dd className="font-medium">{formatKES(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt className="flex items-center gap-1"><Truck size={13} /> Delivery</dt>
                <dd className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : formatKES(deliveryFee)}
                </dd>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Tag size={10} /> Add {formatKES(clientConfig.business.freeDeliveryThreshold - subtotal)} more for free delivery
                </p>
              )}
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <dt>Total</dt>
                <dd className="text-lg">{formatKES(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-2xl font-bold transition-colors"
            >
              Checkout <ArrowRight size={16} />
            </Link>

            <a
              href={`https://wa.me/${clientConfig.business.whatsapp}?text=${whatsappMessage}`}
              target="_blank" rel="noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-2xl font-medium text-sm transition-colors"
            >
              <MessageCircle size={15} /> Order via WhatsApp
            </a>
          </div>

          <div className="bg-brand-50 rounded-2xl p-4 text-sm text-brand-800">
            <p className="font-semibold mb-1">🔒 Secure Checkout</p>
            <p className="text-xs text-brand-600">Payments processed via M-PESA Daraja. Your data is encrypted and never stored.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
