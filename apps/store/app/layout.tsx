import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import DemoBanner from '@/components/layout/DemoBanner'
import { clientConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: { template: clientConfig.seo.titleTemplate, default: clientConfig.brand.name },
  description: clientConfig.seo.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoBanner />
        <Navbar />
        <main className="min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}
