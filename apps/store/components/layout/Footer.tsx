import Link from 'next/link'
import { clientConfig } from '@/lib/config'
import { Zap, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">{clientConfig.brand.name}</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">{clientConfig.brand.tagline}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Phone size={13} /><span>{clientConfig.business.phone}</span></div>
            <div className="flex items-center gap-2"><Mail size={13} /><span>{clientConfig.business.email}</span></div>
            <div className="flex items-center gap-2"><MapPin size={13} /><span>{clientConfig.business.address}</span></div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm">
            {clientConfig.categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/products?category=${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns Policy</Link></li>
            <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty Claims</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li>
              <a href={`https://wa.me/${clientConfig.business.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Payments</h4>
          <div className="space-y-2">
            <div className="bg-white/10 rounded-lg px-3 py-2 text-sm font-medium">🟢 M-PESA STK Push</div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-sm font-medium">💳 Visa / Mastercard</div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-sm font-medium">💵 Cash on Delivery</div>
            <div className="bg-white/10 rounded-lg px-3 py-2 text-sm font-medium">📅 BNPL (Lipa Later)</div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <p>🔒 256-bit SSL Encrypted</p>
            <p>✅ PCI DSS Compliant</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {clientConfig.brand.name}. All rights reserved. Built on Msingi.
      </div>
    </footer>
  )
}
