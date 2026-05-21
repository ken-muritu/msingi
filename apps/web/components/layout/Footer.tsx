import Link from 'next/link'
import { Zap, MessageCircle, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  'Shop': [
    { label: 'Smartphones', href: '/products?category=smartphones' },
    { label: 'Laptops', href: '/products?category=laptops' },
    { label: 'Televisions', href: '/products?category=televisions' },
    { label: 'Fridges', href: '/products?category=fridges' },
    { label: 'Washing Machines', href: '/products?category=washing-machines' },
    { label: 'Audio', href: '/products?category=audio' },
  ],
  'Sellers': [
    { label: 'Sell on Jenga', href: '/seller/dashboard' },
    { label: 'Seller Dashboard', href: '/seller/dashboard' },
    { label: 'Commission Rates', href: '/seller/dashboard' },
    { label: 'Training Centre', href: '/seller/dashboard' },
    { label: 'Seller Handbook', href: '/seller/dashboard' },
  ],
  'Customer Care': [
    { label: 'Track My Order', href: '/account' },
    { label: 'Return & Refund', href: '/account' },
    { label: 'Dispute Centre', href: '/account' },
    { label: 'Installation Booking', href: '/products' },
    { label: 'FAQs', href: '/' },
  ],
  'Company': [
    { label: 'About Jenga', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Press', href: '/' },
    { label: 'Privacy Policy', href: '/' },
    { label: 'Terms of Service', href: '/' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white">Jenga</span>
                <div className="text-[9px] text-brand-400 font-medium">ELECTRONICS</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-5">
              Kenya&apos;s premier electronics and home appliances marketplace. Pay via M-PESA, order via WhatsApp, delivered nationwide.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm">
              <a
                href="tel:+254700000000"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Phone size={14} />
                +254 700 000 000
              </a>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] hover:text-[#20BD5A] transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp: +254 700 000 000
              </a>
              <a
                href="mailto:hello@jenga.co.ke"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Mail size={14} />
                hello@jenga.co.ke
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                Nairobi, Kenya – All 47 Counties
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-600 flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="TikTok"
              >
                TT
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-white font-semibold text-sm mb-4">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="text-xs text-slate-500">Secure payments via:</span>
              {['M-PESA', 'Airtel Money', 'Visa', 'Mastercard', 'BNPL'].map((pm) => (
                <span
                  key={pm}
                  className="px-2.5 py-1 bg-slate-800 rounded text-xs font-medium text-slate-300 border border-slate-700"
                >
                  {pm}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>🔒 SSL Secured</span>
              <span>📦 Nationwide Delivery</span>
              <span>↩️ Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Jenga Electronics Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
