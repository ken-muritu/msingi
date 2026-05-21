# MSINGI

**The Commerce Foundation for African Business**

> Deploy a complete African commerce business in weeks, not months. M-PESA, WhatsApp, logistics, and trust systems built in — not bolted on.

---

## What is Msingi?

Msingi (Swahili: *"foundation"*) is a modular commerce framework purpose-built for African commerce behavior. Think **"Laravel for African commerce"** — a foundation that handles the hard problems (M-PESA, WhatsApp, logistics, trust) so you focus on your business.

**Msingi is NOT:** a hosted SaaS, a marketplace, a WordPress plugin, or a boilerplate.
**Msingi IS:** infrastructure, modules, commerce primitives, operational systems.

---

## Architecture

Modular monolith (Turborepo monorepo) — single deployable with module composability.

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | ✅ Running |
| Backend | NestJS 10 + Prisma ORM | ✅ Running |
| Database | PostgreSQL 15+ | ✅ Running |
| Packages | `@msingi/types` + `@msingi/config` | ✅ Building |
| Search | MeiliSearch | 🔜 Planned |
| Cache/Queue | Redis + BullMQ | 🔜 Planned |
| Payments | M-PESA (Daraja) + Pesapal + Stripe | ⚡ Scaffolded |
| Analytics | PostHog | 🔜 Planned |
| Storage | Cloudflare R2 / S3 | 🔜 Planned |
| Infra | Docker + Turborepo | ✅ Turborepo |

---

## Monorepo Structure

```
msingi/
├── apps/
│   └── web/                   # @msingi/web — Next.js 14 storefront (PWA)
│       ├── app/               # App Router pages
│       ├── components/        # React components (home, layout, products, checkout)
│       ├── lib/
│       │   ├── api.ts         # Typed Msingi API client
│       │   ├── hooks.ts       # React hooks (useProducts, useCategories, useSearch, etc.)
│       │   ├── data.ts        # Static mock data (fallback when API unavailable)
│       │   ├── store.ts       # Zustand stores (cart, wishlist, compare)
│       │   └── utils.ts       # Helpers (formatKES, WhatsApp messages, etc.)
│       └── vercel.json        # Vercel monorepo deployment config
│
├── backend/                   # @msingi/backend — NestJS API server
│   ├── src/
│   │   ├── main.ts            # Bootstrap, Swagger, CORS
│   │   ├── app.module.ts      # Root module
│   │   ├── prisma/            # PrismaService + PrismaModule
│   │   └── modules/
│   │       ├── health/        # GET /health — framework status
│   │       ├── auth/          # POST /auth/register, /auth/login, /auth/profile
│   │       ├── catalog/       # GET /products, /categories, /brands
│   │       ├── inventory/     # Stock management, reservation logs
│   │       ├── orders/        # Order lifecycle, multi-seller splitting
│   │       ├── payments/      # M-PESA STK Push, callbacks, refunds
│   │       ├── sellers/       # Seller registration, dashboard, payouts
│   │       ├── search/        # Full-text search, autocomplete, facets
│   │       ├── reviews/       # Verified purchase reviews, seller response
│   │       └── notifications/ # WhatsApp, SMS, email dispatch
│   ├── prisma/
│   │   ├── schema.prisma      # 12 models (User, Seller, Product, Order, etc.)
│   │   └── seed.ts            # Reference data seeder
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
| **Auth** | `/auth` | ✅ | Registration, login (JWT), profile |
| **Catalog** | `/products`, `/categories` | ✅ | Products with filters, pagination, sorting |
| **Inventory** | `/inventory` | ✅ | Transactional stock, reservations, logs |
| **Orders** | `/orders` | ✅ | Order lifecycle, multi-seller splitting |
| **Payments** | `/payments` | ✅ | M-PESA STK Push, callbacks, refunds |
| **Sellers** | `/sellers` | ✅ | Seller portal, dashboard, KYC, payouts |
| **Search** | `/search` | ✅ | Full-text search, autocomplete, facets |
| **Reviews** | `/reviews` | ✅ | Verified purchase reviews, seller response |
| **Notifications** | `/notifications` | ✅ | WhatsApp, SMS, email dispatch |

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

- **Storefront**: http://localhost:3000
- **Swagger API docs**: http://localhost:4000/api/docs
- **Health check**: http://localhost:4000/api/v1/health

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

Without a backend URL, the frontend gracefully falls back to mock data.

### Backend

Deploy the NestJS backend to any Node.js host:

- **Railway** / **Render** / **Fly.io** — connect to a managed PostgreSQL
- Set all env vars from `backend/.env.example`
- Run: `pnpm --filter @msingi/backend build && pnpm --filter @msingi/backend start:prod`

---

## Tech Stack

| Category | Choice | Why |
|----------|--------|-----|
| Monorepo | Turborepo + pnpm | Fast builds, workspace protocol |
| Frontend | Next.js 14 | App Router, RSC, ISR for SEO |
| Styling | Tailwind CSS | Utility-first, responsive |
| State | Zustand | Lightweight, persistent stores |
| Backend | NestJS 10 | Modular, decorators, Swagger |
| ORM | Prisma | Type-safe, migrations, schema push |
| Database | PostgreSQL | JSONB attributes, full-text search |
| Auth | JWT + bcrypt | Stateless, role-based |
| Payments | M-PESA Daraja | STK Push, BNPL, callbacks |
| Types | TypeScript | End-to-end type safety |

---

## License

MIT
