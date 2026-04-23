'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, MessageCircle, Tag, Truck } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/lib/store'
import { formatKES, generateWhatsAppCartMessage } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const total = useCartTotal()

  const savings = items.reduce(
    (s, i) => s + (i.originalPrice ? (i.originalPrice - i.price) * i.quantity : 0),
    0
  )

  const delivery = total >= 3000 ? 0 : 300

  const handleWhatsApp = () => {
    const msg = generateWhatsAppCartMessage(
      items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total
    )
    window.open(`https://wa.me/254700000000?text=${msg}`, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="text-slate-200 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h1>
        <p className="text-slate-400 mb-8">Browse our products and add items to get started.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-2xl font-semibold transition-colors"
        >
          <ShoppingBag size={18} /> Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Shopping Cart <span className="text-slate-400 text-lg font-normal">({items.length} items)</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4">
              <Link href={`/products/${item.id}`} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider mb-0.5">{item.brand}</p>
                <Link href={`/products/${item.id}`} className="text-sm font-medium text-slate-800 line-clamp-2 hover:text-brand-700 transition-colors">
                  {item.name}
                </Link>
                <p className="text-[11px] text-slate-400 mt-0.5">Sold by {item.sellerName}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-base font-bold text-slate-900">{formatKES(item.price * item.quantity)}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <Plus size={11} />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
            <h2 className="font-semibold text-slate-900">Order Summary</h2>

            {savings > 0 && (
              <div className="flex items-center justify-between text-sm bg-green-50 text-green-700 rounded-xl px-3 py-2">
                <span className="flex items-center gap-1.5"><Tag size={13} />You save</span>
                <span className="font-bold">{formatKES(savings)}</span>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatKES(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5"><Truck size={13} />Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {delivery === 0 ? 'FREE' : formatKES(delivery)}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-[11px] text-slate-400">
                  Add {formatKES(3000 - total)} more for free delivery
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="font-extrabold text-xl text-slate-900">{formatKES(total + delivery)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-2xl font-semibold transition-colors"
            >
              Checkout <ArrowRight size={16} />
            </Link>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-2xl text-sm font-medium transition-colors"
            >
              <MessageCircle size={15} /> Order via WhatsApp
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 space-y-1.5">
            <p>🔒 Secure M-PESA checkout</p>
            <p>🚚 Delivery across all 47 counties</p>
            <p>↩️ 7-day return policy</p>
            <p>✅ Verified sellers only</p>
          </div>
        </div>
      </div>
    </div>
  )
}
