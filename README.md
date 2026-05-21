# MSINGI

**The Commerce Foundation for African Business**

> Deploy a complete African commerce business in weeks, not months. M-PESA, WhatsApp, logistics, and trust systems built in — not bolted on.

## What is Msingi?

Msingi (Swahili: "foundation") is a modular commerce framework purpose-built for African commerce behavior. Think **"Laravel for African commerce"** — a foundation that handles the hard problems (M-PESA, WhatsApp, logistics, trust) so you focus on your business.

**Msingi is NOT:** a hosted SaaS, a marketplace, a WordPress plugin, or a boilerplate.
**Msingi IS:** infrastructure, modules, commerce primitives, operational systems.

## Architecture

Modular monolith (Turborepo monorepo) — single deployable with module composability.

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | NestJS + Prisma ORM |
| Database | PostgreSQL |
| Search | MeiliSearch |
| Cache/Queue | Redis + BullMQ |
| Payments | M-PESA (Daraja) + Pesapal + Stripe |
| Analytics | PostHog |
| Storage | Cloudflare R2 / S3 |
| Infra | Docker + Turborepo |

## Monorepo Structure

```
msingi/
├── apps/web/              # Next.js storefront (PWA)
├── backend/               # NestJS API server
│   ├── src/modules/
│   │   ├── auth/          # Msingi Auth — phone OTP, email, roles
│   │   ├── catalog/       # Msingi Catalog — products, categories, variants
│   │   ├── inventory/     # Msingi Inventory — stock, reservations, logs
│   │   ├── orders/        # Msingi Orders — cart, checkout, lifecycle
│   │   ├── payments/      # Msingi Pay — M-PESA STK Push, cards, BNPL
│   │   ├── sellers/       # Msingi Merchant — seller portal, KYC, payouts
│   │   ├── search/        # Msingi Search — typo-tolerant, faceted
│   │   ├── reviews/       # Msingi Reviews — verified, social proof
│   │   └── notifications/ # Msingi Notifications — WhatsApp, SMS, email
│   └── prisma/            # Database schema
├── packages/
│   ├── types/             # @msingi/types — shared TypeScript types
│   └── config/            # @msingi/config — configuration loader
├── templates/             # Vertical templates (electronics, fashion, etc.)
├── jenga.config.ts        # Reference implementation config
└── turbo.json
```

## Core Modules

| Module | Status | Description |
|--------|--------|-------------|
| **Msingi Auth** | ✅ | Authentication, roles, JWT |
| **Msingi Catalog** | ✅ | Products, categories, variants, brands |
| **Msingi Inventory** | ✅ | Transactional stock, reservations, logs |
| **Msingi Orders** | ✅ | Order lifecycle, multi-seller splitting |
| **Msingi Pay** | ✅ | M-PESA STK Push, cards, refunds |
| **Msingi Search** | ✅ | Full-text, autocomplete, facets |
| **Msingi Reviews** | ✅ | Verified purchase reviews, seller response |
| **Msingi Notifications** | ✅ | WhatsApp, SMS, email |
| **Msingi Merchant** | ✅ | Seller onboarding, dashboard, payouts |

## Reference Implementation

**Jenga Electronics** — Kenya's premier electronics marketplace, built on Msingi.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL 15+

### Install

```bash
pnpm install
```

### Setup database

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your PostgreSQL connection string
pnpm db:generate
pnpm db:push
```

### Run development

```bash
pnpm dev          # Runs both frontend + backend
pnpm dev:web      # Frontend only (port 3000)
pnpm dev:backend  # Backend only (port 4000)
```

### API Documentation

Swagger UI available at `http://localhost:4000/api/docs`

## Configuration System

Every Msingi deployment is driven by a single config file:

```typescript
// jenga.config.ts
import type { MsingiConfig } from '@msingi/types';

const config: MsingiConfig = {
  instance: { name: 'Jenga Electronics', slug: 'jenga', vertical: 'electronics' },
  modules: { core: true, marketplace: true, bnpl: true, dispatch: true },
  payments: { mpesa: { stkPush: true, paybill: '247247' } },
  // ... full config
};
```

## License

MIT
