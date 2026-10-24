import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Msingi — Commerce Foundation',
    short_name: 'Msingi',
    description: 'African commerce powered by M-PESA, WhatsApp, and Msingi.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    orientation: 'portrait',
    categories: ['shopping', 'business'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Shop',
        url: '/products',
        description: 'Browse products',
      },
      {
        name: 'Cart',
        url: '/cart',
        description: 'View your cart',
      },
    ],
  }
}
