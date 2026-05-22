# MSINGI

**The Commerce Foundation for African Business**

> Deploy a complete African commerce business in weeks, not months. M-PESA, WhatsApp, logistics, and trust systems built in — not bolted on.

[![Live](https://img.shields.io/badge/landing-msingios.vercel.app-black?style=flat-square)](https://msingios.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#license)
[![Stage](https://img.shields.io/badge/stage-production%20ready-brightgreen?style=flat-square)](#current-status)
[![CI](https://github.com/ken-muritu/msingi/actions/workflows/ci.yml/badge.svg)](https://github.com/ken-muritu/msingi/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-31%20passing-brightgreen?style=flat-square)](#testing)

---

## What is Msingi?

Msingi (Swahili: *"foundation"*) is a modular commerce framework purpose-built for African commerce behavior. Think **"Laravel for African commerce"** — a foundation that handles the hard problems (M-PESA, WhatsApp, logistics, trust) so you focus on your business.

**Msingi is NOT:** a hosted SaaS, a marketplace, a WordPress plugin, or a boilerplate.
**Msingi IS:** infrastructure, modules, commerce primitives, operational systems.

---

## Current Status

Msingi is **production-ready** — a fully wired backend API, live M-PESA payments, API-persisted cart, real notifications, MeiliSearch, Cloudflare R2 storage, PostHog analytics, Docker containerization, CI/CD, and a test suite. The frontend is wired to the live backend with graceful mock-data fallback.

### What's Implemented

| Component | Status | Details |
|-----------|--------|----------|
| Landing page | ✅ Live | [msingios.vercel.app](https://msingios.vercel.app) |
| JWT Authentication | ✅ Production | Global `JwtAuthGuard`, `@Public()` decorator, role-based access |
| M-PESA Daraja API | ✅ Live | STK Push, STK Query, callback validation, reversal |
| Checkout flow | ✅ Wired | Order creation → STK Push → 90s polling → confirmation |
| API-persisted cart | ✅ Live | `Cart`/`CartItem` models, session+user cart, guest→user merge |
| Order lifecycle | ✅ Live | Create, status transitions, inventory reservation/release |
| Notifications | ✅ Live | WhatsApp (Meta Cloud API) → SMS (Africa's Talking) fallback + Resend email |
| MeiliSearch | ✅ Integrated | Auto-indexes on product create/update; DB fallback |
| Cloudflare R2 Storage | ✅ Live | Upload, presigned URLs, delete; S3-compatible |
| PostHog Analytics | ✅ Live | Backend event tracking + frontend pageview capture |
| Docker | ✅ Production | Multi-stage image, non-root user, runs migrations on start |
| Render deployment | ✅ Configured | `render.yaml` with managed PostgreSQL + all env vars |
| GitHub Actions CI/CD | ✅ Active | Lint + test + build on PR; deploy to Render + Vercel on `main` |
| Test suite | ✅ 31 passing | Jest unit tests: CartService, OrdersService, MpesaService |
| Database schema | ✅ 14 models | + Cart, CartItem vs original 12 |
| Backend API | ✅ 12 modules | + Cart, Storage, Analytics |
| Swagger docs | ✅ Live | `/api/docs` |

### Remaining (Next Phase)

| Component | Priority | Notes |
|-----------|----------|-------|
| PWA / offline | HIGH | Serwist + service worker |
| Multi-tenancy | MEDIUM | Schema-per-tenant PostgreSQL |
| Playwright E2E tests | MEDIUM | Checkout flow end-to-end |
| Admin dashboard | MEDIUM | Order management, seller approvals |
| Fashion vertical template | LOW | `templates/fashion/` |
| Docusaurus docs site | LOW | Auto-generated from OpenAPI |

---

## Architecture

Modular monolith (Turborepo monorepo) — single deployable with module composability.

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | ✅ Live |
| Backend | NestJS 10 + Prisma ORM | ✅ Production-ready |
| Database | PostgreSQL 15+ | ✅ Render managed |
| Packages | `@msingi/types` + `@msingi/config` | ✅ Building |
| Search | MeiliSearch | ✅ Integrated (auto-index) |
| Cache/Queue | Redis + BullMQ | ✅ BullMQ wired |
| Payments | M-PESA Daraja STK Push | ✅ Live |
| Notifications | WhatsApp + Africa's Talking + Resend | ✅ Live |
| Analytics | PostHog (backend + frontend) | ✅ Live |
| Storage | Cloudflare R2 | ✅ Live |
| Infra | Docker + Turborepo + GitHub Actions | ✅ Full CI/CD |

---

## Monorepo Structure

```
msingi/
├── apps/
│   └── web/                   # @msingi/web — Next.js 14 frontend
│       ├── app/               # App Router pages
│       │   ├── page.tsx       # Landing page (Hero → Features → Modules → Arch → Demo → GetStarted)
│       │   ├── layout.tsx     # Root layout (dark theme, MsingiNav, MsingiFooter)
│       │   ├── globals.css    # Tailwind base + dark theme styles
│       │   ├── products/      # Product listing + detail pages
│       │   ├── seller/        # Seller dashboard, product management
│       │   ├── cart/          # Shopping cart
│       │   ├── checkout/      # Checkout + M-PESA payment
│       │   └── ...            # account, admin, deals, compare, wishlist, live
│       ├── components/
│       │   ├── landing/       # Framework landing page (8 components)
│       │   │   ├── Hero.tsx           # Headline, terminal preview, stats
│       │   │   ├── Features.tsx       # 8 feature cards (M-PESA, WhatsApp, etc.)
│       │   │   ├── Modules.tsx        # 10 backend modules with status
│       │   │   ├── Architecture.tsx   # Tech stack grid + monorepo tree
│       │   │   ├── Demo.tsx           # Interactive API response viewer
│       │   │   ├── GetStarted.tsx     # 4-step setup + seed credentials
│       │   │   ├── MsingiNav.tsx      # Dark glassmorphism navbar
│       │   │   └── MsingiFooter.tsx   # Minimal dark footer
│       │   ├── home/          # Store homepage sections (Jenga reference impl)
│       │   ├── layout/        # Store layout (Navbar, Footer, CartSidebar, BottomNav)
│       │   ├── products/      # ProductCard, CompareBar
│       │   ├── checkout/      # MPesaModal (wired to live STK Push + polling)
│       │   └── providers/     # PostHogProvider (pageview tracking)
│       ├── lib/
│       │   ├── api.ts         # Typed Msingi API client — auth, cart, orders, payments
│       │   ├── hooks.ts       # React hooks — useProducts, useAuth, useCart, useOrders
│       │   ├── posthog.ts     # PostHog init + browser client
│       │   ├── data.ts        # Static mock data (fallback when API unavailable)
│       │   ├── store.ts       # Zustand stores — cart, wishlist, compare, auth
│       │   └── utils.ts       # Helpers (formatKES, WhatsApp messages, etc.)
│       └── vercel.json        # Vercel monorepo deployment config
│
├── backend/                   # @msingi/backend — NestJS API server
│   ├── src/
│   │   ├── main.ts            # Bootstrap, Swagger, CORS (multi-origin), PORT env
│   │   ├── app.module.ts      # Root module (12 feature modules + global Analytics)
│   │   ├── prisma/            # PrismaService + PrismaModule
│   │   └── modules/
│   │       ├── health/        # GET /health — framework status
│   │       ├── auth/          # JWT auth — register, login, profile, guard, strategy
│   │       ├── catalog/       # GET /products, /categories — MeiliSearch auto-index
│   │       ├── inventory/     # Transactional stock, SELECT FOR UPDATE reservation
│   │       ├── orders/        # Order lifecycle, notifications + analytics on create
│   │       ├── payments/      # M-PESA Daraja STK Push, callback, query, reversal
│   │       ├── sellers/       # Seller portal, KYC, payouts
│   │       ├── search/        # MeiliSearch integration, autocomplete, facets, reindex
│   │       ├── reviews/       # Verified purchase reviews, seller response
│   │       ├── notifications/ # WhatsApp (Meta) → SMS (AT) fallback + Resend email
│   │       ├── cart/          # API-persisted cart, session+user, guest merge
│   │       ├── storage/       # Cloudflare R2 upload, presigned URLs, delete
│   │       └── analytics/     # PostHog server-side event tracking
│   ├── prisma/
│   │   ├── schema.prisma      # 14 models (+ Cart, CartItem)
│   │   └── seed.ts            # Reference data seeder
│   ├── Dockerfile             # Multi-stage production image (node:22-alpine)
│   ├── .dockerignore
│   └── .env.example           # All environment variables documented
│
├── packages/
│   ├── types/                 # @msingi/types — MsingiConfig type system + commerce entities
│   └── config/                # @msingi/config — defineConfig(), getConfig(), formatPrice()
│
├── templates/
│   └── electronics/           # Jenga Electronics vertical template
│       ├── categories.json
│       └── template.json
│
├── jenga.config.ts            # Reference implementation config (MsingiConfig)
├── turbo.json                 # Turborepo pipeline configuration
├── pnpm-workspace.yaml        # Workspace: apps/*, packages/*, backend
├── tsconfig.base.json         # Shared TypeScript config
└── package.json               # Root scripts (dev, build, db:push, etc.)
```

---

## Core Modules

| Module | Endpoint Prefix | Status | Description |
|--------|----------------|--------|-------------|
| **Health** | `GET /health` | ✅ | Framework status, version |
| **Auth** | `/auth` | ✅ | JWT register/login/profile; global `JwtAuthGuard` |
| **Catalog** | `/products`, `/categories` | ✅ | Filters, pagination; MeiliSearch auto-index |
| **Inventory** | `/inventory` | ✅ | Transactional stock, `SELECT FOR UPDATE` reservations |
| **Orders** | `/orders` | ✅ | Lifecycle, notifications + analytics on create |
| **Payments** | `/payments` | ✅ | Live M-PESA STK Push, callback, query, reversal |
| **Sellers** | `/sellers` | ✅ | Seller portal, KYC, payouts |
| **Search** | `/search` | ✅ | MeiliSearch full-text, autocomplete, facets, reindex |
| **Reviews** | `/reviews` | ✅ | Verified purchase reviews, seller response |
| **Notifications** | `/notifications` | ✅ | WhatsApp → SMS fallback + Resend email |
| **Cart** | `/cart` | ✅ | API-persisted cart, guest+user, merge on login |
| **Storage** | `/storage` | ✅ | Cloudflare R2 upload, presigned URLs, delete |
| **Analytics** | — | ✅ | PostHog server-side (global service) |

All endpoints are prefixed with `/api/v1/`.

---

## Shared Packages

### `@msingi/types`

Exports the full `MsingiConfig` type system (20+ interfaces) and generic commerce entity types. Every deployment config is typed against `MsingiConfig`.

### `@msingi/config`

Configuration loader with deep merging and validation:

```typescript
import { defineConfig, getConfig, isModuleEnabled, formatPrice } from '@msingi/config';
```

| Export | Purpose |
|--------|---------|
| `defineConfig(config)` | Load and validate a MsingiConfig |
| `getConfig()` | Retrieve the loaded config (throws if not loaded) |
| `isModuleEnabled(module)` | Check if a module is active |
| `getInstanceName()` | Instance display name |
| `getVertical()` | Current vertical (electronics, fashion, etc.) |
| `getCurrency()` | Configured currency code |
| `formatPrice(amount)` | Format price with currency symbol |

---

## Reference Implementation

**Jenga Electronics** — Kenya's premier electronics marketplace, built on Msingi.

- **Config**: `jenga.config.ts`
- **Template**: `templates/electronics/`
- **Vertical**: `electronics`
- **Features**: M-PESA BNPL, serial verification, installation services, multi-seller marketplace

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 9+
- **PostgreSQL** 15+

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup database

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env — set your DATABASE_URL:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/msingi_dev?schema=public"

# Push schema to database
pnpm db:push

# Seed with reference data (Jenga Electronics)
pnpm --filter @msingi/backend db:seed
```

### 3. Build shared packages

```bash
pnpm --filter @msingi/types build
pnpm --filter @msingi/config build
```

### 4. Run development servers

```bash
pnpm dev              # Both frontend + backend
pnpm dev:web          # Frontend only → http://localhost:3000
pnpm dev:backend      # Backend only  → http://localhost:4000
```

### 5. Explore

- **Landing page**: http://localhost:3000 (Msingi framework site)
- **Swagger API docs**: http://localhost:4000/api/docs
- **Health check**: http://localhost:4000/api/v1/health
- **Demo store** (Jenga reference): http://localhost:3000/products

### Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@jenga.co.ke` | `admin123456` |
| Seller | `samsung@jenga.co.ke` | `seller123456` |
| Buyer | `buyer@test.com` | `buyer123456` |

---

## API Quick Reference

```bash
# Health
curl http://localhost:4000/api/v1/health

# Products (paginated, filterable)
curl http://localhost:4000/api/v1/products
curl "http://localhost:4000/api/v1/products?brand=Samsung&minPrice=50000"

# Categories
curl http://localhost:4000/api/v1/categories

# Sellers
curl http://localhost:4000/api/v1/sellers

# Search
curl "http://localhost:4000/api/v1/search?q=samsung"

# Auth
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"buyer@test.com","password":"buyer123456"}'
```

---

## Frontend API Layer

The frontend (`apps/web`) includes a typed API client with automatic fallback:

- **`lib/api.ts`** — Typed fetch client for all Msingi endpoints
- **`lib/hooks.ts`** — React hooks that try the live API, then fall back to static mock data

```typescript
import { useProducts, useCategories, useSearch } from '@/lib/hooks'

// In any client component:
const { data: products, loading, isLive } = useProducts()
const { data: categories } = useCategories()
const { data: results, totalCount } = useSearch('samsung')
```

Set `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` to point to your backend.

---

## Configuration System

Every Msingi deployment is driven by a single config file:

```typescript
// jenga.config.ts
import type { MsingiConfig } from '@msingi/types';

const config: MsingiConfig = {
  instance: {
    name: 'Jenga Electronics',
    slug: 'jenga',
    domain: 'jenga.co.ke',
    vertical: 'electronics',
  },
  branding: {
    logo: '/brand/logo.svg',
    poweredByMsingi: false,
    // ...colors, typography
  },
  modules: {
    core: true,
    marketplace: true,
    bnpl: true,
    dispatch: true,
    social: { whatsapp: 'full_bot', tiktok: false, meta: false, live: false },
    // ...
  },
  payments: {
    mpesa: { stkPush: true, paybill: '247247', lipaMdogoMdogo: true },
    cards: { provider: 'pesapal' },
    cashOnDelivery: { enabled: true, maxOrderValue: 50000 },
  },
  // ...delivery, catalog, content, infrastructure, seo
};

export default config;
```

---

## Deployment

### Vercel (Frontend)

The `apps/web/vercel.json` handles monorepo builds automatically.

1. Import the repo in Vercel
2. Set **Root Directory** to `apps/web`
3. Add env: `NEXT_PUBLIC_API_URL=https://your-api.example.com/api/v1`
4. Deploy

The landing page is fully static — no backend needed for the framework site.
The demo store pages (`/products`, `/cart`, etc.) fall back to mock data without a backend URL.

### Backend (Render — fully configured)

`render.yaml` at the repo root defines the full Render deployment — just connect the repo:

```bash
# The render.yaml handles:
# - Web service (Docker build, auto-deploy on main push)
# - Managed PostgreSQL (1 GB free)
# - All environment variables pre-mapped
```

1. Connect repo on [render.com](https://render.com) → **New > Blueprint**
2. Set secret env vars: `JWT_SECRET`, `MPESA_*`, `RESEND_API_KEY`, `AT_API_KEY`, `POSTHOG_API_KEY`, `MEILISEARCH_API_KEY`, `R2_*`
3. Push to `main` — GitHub Actions runs CI then triggers Render deploy hook

The Docker image runs `prisma migrate deploy` automatically before starting the server.

Alternatives: Railway, Fly.io, any host with Docker + PostgreSQL support.

---

## Tech Stack

| Category | Choice | Why |
|----------|--------|-----|
| Monorepo | Turborepo + pnpm | Fast builds, workspace protocol |
| Frontend | Next.js 14 | App Router, dark landing page + demo store |
| Styling | Tailwind CSS | Utility-first, responsive |
| State | Zustand | Lightweight, persistent stores |
| Backend | NestJS 10 | Modular, decorators, Swagger |
| ORM | Prisma | Type-safe, migrations, schema push |
| Database | PostgreSQL | JSONB attributes, full-text search |
| Auth | JWT + bcrypt | Stateless, role-based |
| Payments | M-PESA Daraja + Pesapal | STK Push, BNPL, callbacks, cards |
| Search | MeiliSearch | Typo-tolerant, faceted, sub-50ms — auto-indexed |
| Queue | Redis + BullMQ | Background job queue for notifications |
| Notifications | WhatsApp (Meta) + Africa's Talking + Resend | Live — WA fallback to SMS |
| Storage | Cloudflare R2 | $0 egress, S3-compatible — live |
| Analytics | PostHog | 1M events/mo free — backend + frontend live |
| Types | TypeScript | End-to-end type safety |

### Infrastructure Costs

| Phase | Monthly | Annual |
|-------|---------|--------|
| Development (free tiers) | $0 | $0 |
| First client | ~$20 | ~$240 |
| 5 clients (production) | ~$315 | ~$3,780 |
| 10 clients (scaled) | ~$600 | ~$7,200 |

---

## Testing

```bash
# Run unit tests
pnpm --filter @msingi/backend test

# With coverage
pnpm --filter @msingi/backend test:cov
```

**31 tests across 3 suites:**
- `cart.service.spec.ts` — resolveCart, addItem, updateItem, clearCart, mergeGuestCart
- `orders.service.spec.ts` — createOrder, getOrderById, updateOrderStatus, getUserOrders
- `mpesa.service.spec.ts` — formatPhone, generatePassword, validateCallback

---

## Documentation

- **[ROADMAP.md](./ROADMAP.md)** — Updated gap tracker and next-phase priorities
- **[BUSINESS.md](./BUSINESS.md)** — Company-building playbook, revenue projections, legal requirements
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Development setup, architecture guide, coding standards

---

## License

MIT — The framework is the funnel; ecosystem, hosting, and expertise are the revenue.
