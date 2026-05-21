import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/layout/CartSidebar'
import BottomNav from '@/components/layout/BottomNav'
import CompareBar from '@/components/products/CompareBar'

export const metadata: Metadata = {
  title: {
    template: '%s | Jenga Electronics',
    default: "Jenga Electronics – Kenya's Premier Electronics & Appliances Store",
  },
  description:
    'Shop smartphones, laptops, TVs, fridges, and home appliances. Pay via M-PESA. Fast delivery across all 47 counties in Kenya.',
  keywords: [
    'electronics Kenya',
    'M-PESA electronics',
    'phones Kenya',
    'laptops Kenya',
    'Samsung Kenya',
    'Apple Kenya',
    'LG Kenya',
  ],
  authors: [{ name: 'Jenga Electronics' }],
  creator: 'Jenga Electronics',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://jenga.co.ke',
    siteName: 'Jenga Electronics',
    title: "Jenga Electronics – Kenya's Premier Electronics Store",
    description: 'Shop electronics, pay via M-PESA, delivered across Kenya.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jenga Electronics Kenya',
    description: 'Shop electronics, pay via M-PESA, delivered across Kenya.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#00A651',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jenga" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-sans bg-slate-50 text-slate-800 antialiased">
        <Navbar />
        <CartSidebar />
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
        <CompareBar />
        <BottomNav />
      </body>
    </html>
  )
}
