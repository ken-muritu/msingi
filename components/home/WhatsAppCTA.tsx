import { MessageCircle, Phone, Clock, ShieldCheck } from 'lucide-react'

export default function WhatsAppCTA() {
  const whatsappLink =
    'https://wa.me/254700000000?text=Hello%20Jenga!%20I%20need%20help%20finding%20a%20product.'

  return (
    <section className="bg-[#075E54] py-12 overflow-hidden relative">
      {/* Background dots */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ left: `${(i * 13) % 100}%`, top: `${(i * 17) % 100}%` }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
        {/* WhatsApp icon */}
        <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
          <MessageCircle size={32} />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
          Order directly on WhatsApp
        </h2>
        <p className="text-[#B2DFDB] text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Chat with our team, get product advice, share your cart, and pay via M-PESA — all without leaving WhatsApp.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {[
            { icon: Clock, text: 'Reply in under 2 minutes' },
            { icon: ShieldCheck, text: 'Safe M-PESA checkout' },
            { icon: Phone, text: 'Voice note support' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 text-sm">
              <Icon size={16} className="text-[#25D366] shrink-0" />
              {text}
            </div>
          ))}
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-0.5"
        >
          <MessageCircle size={20} />
          Start WhatsApp Chat
        </a>

        <p className="text-[#B2DFDB] text-xs mt-4">
          +254 700 000 000 · Available 8am–9pm EAT, 7 days a week
        </p>
      </div>
    </section>
  )
}
