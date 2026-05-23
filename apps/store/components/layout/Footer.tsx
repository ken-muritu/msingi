import Link from 'next/link'
import { clientConfig } from '@/lib/config'
import { Layers, Mail, Phone, MapPin, ExternalLink, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-16">
      {/* Msingi platform CTA strip */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <p className="font-bold text-base">Build your own store with Msingi</p>
            <p className="text-indigo-200 text-sm">Open-source African commerce platform. Deploy in minutes.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={clientConfig.brand.platformUrl}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Get Started <ExternalLink size={13} />
            </a>
            <a
              href="https://github.com/ken-muritu/msingi"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Layers size={15} className="text-white" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">Msingi</span>
              <span className="text-slate-400 text-sm"> Store</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4 text-slate-500">{clientConfig.brand.tagline}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><Phone size={12} /><span>{clientConfig.business.phone}</span></div>
            <div className="flex items-center gap-2"><Mail size={12} /><span>{clientConfig.business.email}</span></div>
            <div className="flex items-center gap-2"><MapPin size={12} /><span>{clientConfig.business.address}</span></div>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-4 text-xs uppercase tracking-wider">Shop</h4>
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
          <h4 className="text-slate-200 font-semibold mb-4 text-xs uppercase tracking-wider">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns Policy</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li>
              <a href={`https://wa.me/${clientConfig.business.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                WhatsApp Support
              </a>
            </li>
          </ul>
          <h4 className="text-slate-200 font-semibold mt-6 mb-3 text-xs uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={clientConfig.brand.platformUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Msingi OS <ExternalLink size={10} /></a></li>
            <li><a href="https://github.com/ken-muritu/msingi" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">GitHub <ExternalLink size={10} /></a></li>
            <li><a href="https://github.com/ken-muritu/msingi/blob/main/README.md" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a></li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-4 text-xs uppercase tracking-wider">Payments</h4>
          <div className="space-y-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300">🟢 M-PESA STK Push</div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300">💳 Visa / Mastercard</div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300">💵 Cash on Delivery</div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300">📅 BNPL (Lipa Later)</div>
          </div>
          <div className="mt-4 text-xs text-slate-600 space-y-1">
            <p>🔒 256-bit SSL Encrypted</p>
            <p>✅ PCI DSS Compliant</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} Msingi Store Demo. Open source under MIT License.</span>
        <a href={clientConfig.brand.platformUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-400 transition-colors">
          <Layers size={11} /> Powered by Msingi
        </a>
      </div>
    </footer>
  )
}
