import type { Metadata, Viewport } from 'next'
import './globals.css'
import MsingiNav from '@/components/landing/MsingiNav'
import MsingiFooter from '@/components/landing/MsingiFooter'

export const metadata: Metadata = {
  title: {
    template: '%s | Msingi',
    default: 'Msingi — The Commerce Foundation for African Business',
  },
  description:
    'Deploy a complete African commerce business in weeks, not months. M-PESA, WhatsApp, logistics, and trust systems built in — not bolted on.',
  keywords: [
    'African commerce',
    'commerce framework',
    'M-PESA integration',
    'WhatsApp commerce',
    'Kenya ecommerce',
    'open source commerce',
    'NestJS commerce',
    'Next.js commerce',
  ],
  authors: [{ name: 'Msingi' }],
  creator: 'Msingi',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://msingi.dev',
    siteName: 'Msingi',
    title: 'Msingi — The Commerce Foundation for African Business',
    description: 'Deploy a complete African commerce business in weeks, not months.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Msingi — Commerce Foundation for Africa',
    description: 'M-PESA, WhatsApp, logistics, and trust systems built in — not bolted on.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Msingi" />
      </head>
      <body className="font-sans bg-[#0A0A0A] text-white antialiased">
        <MsingiNav />
        <main className="min-h-screen">{children}</main>
        <MsingiFooter />
      </body>
    </html>
  )
}
