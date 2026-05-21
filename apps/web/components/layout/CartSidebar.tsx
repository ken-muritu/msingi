'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCartStore, useCartTotal } from '@/lib/store'
import { formatKES, generateWhatsAppCartMessage } from '@/lib/utils'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore()
  const total = useCartTotal()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleWhatsApp = () => {
    const msg = generateWhatsAppCartMessage(
      items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total
    )
    window.open(`https://wa.me/254700000000?text=${msg}`, '_blank')
  }

  const savings = items.reduce(
    (s, i) => s + (i.originalPrice ? (i.originalPrice - i.price) * i.quantity : 0),
    0
  )

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            <h2 className="font-semibold text-slate-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={closeCart}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-24 text-center">
              <ShoppingBag size={56} className="text-slate-200 mb-4" />
              <p className="font-semibold text-slate-500 mb-1">Your cart is empty</p>
              <p className="text-sm text-slate-400">Browse our products and add items to cart</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-5 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-slate-50 rounded-2xl p-3">
                <Link
                  href={`/products/${item.id}`}
                  onClick={closeCart}
                  className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-100"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    {item.brand}
                  </p>
                  <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-brand-700 font-bold text-sm">
                      {formatKES(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-slate-100 space-y-3 bg-white">
            {savings > 0 && (
              <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 rounded-xl px-3 py-2">
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  You save
                </span>
                <span className="font-bold">{formatKES(savings)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="font-bold text-lg text-slate-900">{formatKES(total)}</span>
            </div>
            <p className="text-xs text-slate-400">
              Delivery fees calculated at checkout based on your location.
            </p>

            {/* WhatsApp order */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-2xl text-sm font-medium transition-colors"
            >
              <MessageCircle size={16} />
              Order via WhatsApp
            </button>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-2xl text-sm font-semibold transition-colors"
            >
              Checkout – {formatKES(total)}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
