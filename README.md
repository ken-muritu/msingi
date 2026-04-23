# Jenga Electronics Store

A modern multi-vendor electronics marketplace built for the Kenyan market. Built with Next.js 14, Tailwind CSS, and Zustand.

> **Live demo:** [https://electronicsstore.vercel.app](https://electronicsstore.vercel.app)

## Features

- **Multi-vendor marketplace** — verified sellers with badges (Basic, Verified, Premium, Authorized)
- **M-PESA integration** — STK Push payment simulation at checkout
- **WhatsApp commerce** — direct WhatsApp ordering for any product or full cart
- **Product catalog** — smartphones, laptops, TVs, fridges, audio, and more
- **Flash sales** — countdown timer with discounted products
- **BNPL** — buy now, pay later monthly installment display
- **Loyalty points** — Gold/Platinum membership tiers
- **Responsive UI** — mobile-first design with Tailwind CSS
- **Cart persistence** — Zustand with `localStorage` persist middleware
- **Admin dashboard** — platform-wide analytics, seller management, order tracking
- **Seller dashboard** — revenue stats, order management, product catalog
- **PWA ready** — web app manifest and meta tags

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, flash sales, featured, trending |
| `/products` | Product listing with filters & sorting |
| `/products/[id]` | Product detail with specs, reviews, M-PESA checkout |
| `/cart` | Shopping cart with WhatsApp order option |
| `/checkout` | Multi-step checkout (delivery → payment → confirm) |
| `/account` | Customer orders, profile, loyalty points |
| `/seller/dashboard` | Seller analytics and order management |
| `/admin` | Admin platform overview, sellers, orders |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| State | Zustand (with persist) |
| Icons | Lucide React |
| Language | TypeScript |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

No environment variables required for the base setup. All data is mock/static.

## Deployment

Configured for Vercel. Push to GitHub and import the repo on [vercel.com](https://vercel.com).

```bash
npm run build   # verify build locally
```

## Project Structure

```
app/                        # Next.js App Router pages
  page.tsx                  # Home
  layout.tsx                # Root layout
  globals.css               # Global styles
  not-found.tsx             # 404
  cart/page.tsx
  checkout/page.tsx
  account/page.tsx
  products/page.tsx
  products/[id]/page.tsx
  seller/dashboard/page.tsx
  admin/page.tsx
components/
  layout/
    Navbar.tsx              # Top navigation with cart badge
    Footer.tsx              # Site-wide footer
    CartSidebar.tsx         # Slide-out cart drawer
  home/
    HeroBanner.tsx          # Hero carousel / CTA
    CategoryGrid.tsx        # Product category icons
    FlashSales.tsx          # Countdown timer deals
    FeaturedProducts.tsx    # Curated product grid
    TrendingSection.tsx     # Trending items
    WhatsAppCTA.tsx         # WhatsApp order call-to-action
  products/
    ProductCard.tsx         # Reusable product tile
  checkout/
    MPesaModal.tsx          # M-PESA STK Push modal
lib/
  data.ts                   # Mock data & TypeScript types
  store.ts                  # Zustand cart store
  utils.ts                  # KES formatting, WhatsApp helpers, etc.
public/
  manifest.json             # PWA manifest
```

## License

MIT
