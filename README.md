# KORA

**Modular Commerce Infrastructure for African Business**

> Build once, deploy for any African commerce vertical. M-PESA, WhatsApp, logistics, and trust systems built in — not bolted on.

## What is Kora?

Kora is a modular commerce framework purpose-built for African commerce behavior. Think **"Laravel for African commerce"** — a foundation that handles the hard problems (M-PESA, WhatsApp, logistics, trust) so you focus on your business.

**Kora is NOT:** a hosted SaaS, a marketplace, a WordPress plugin, or a boilerplate.
**Kora IS:** infrastructure, modules, commerce primitives, operational systems.

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
kora/
├── apps/web/              # Next.js storefront (PWA)
├── backend/               # NestJS API server
│   ├── src/modules/
│   │   ├── auth/          # Kora Auth — phone OTP, email, roles
│   │   ├── catalog/       # Kora Catalog — products, categories, variants
│   │   ├── inventory/     # Kora Inventory — stock, reservations, logs
│   │   ├── orders/        # Kora Orders — cart, checkout, lifecycle
│   │   ├── payments/      # Kora Pay — M-PESA STK Push, cards, BNPL
│   │   ├── sellers/       # Kora Merchant — seller portal, KYC, payouts
│   │   ├── search/        # Kora Search — typo-tolerant, faceted
│   │   ├── reviews/       # Kora Reviews — verified, social proof
│   │   └── notifications/ # Kora Notifications — WhatsApp, SMS, email
│   └── prisma/            # Database schema
├── packages/
│   ├── types/             # @kora/types — shared TypeScript types
│   └── config/            # @kora/config — configuration loader
├── templates/             # Vertical templates (electronics, fashion, etc.)
├── jenga.config.ts        # Reference implementation config
└── turbo.json
```

## Core Modules

| Module | Status | Description |
|--------|--------|-------------|
| **Kora Auth** | ✅ | Authentication, roles, JWT |
| **Kora Catalog** | ✅ | Products, categories, variants, brands |
| **Kora Inventory** | ✅ | Transactional stock, reservations, logs |
| **Kora Orders** | ✅ | Order lifecycle, multi-seller splitting |
| **Kora Pay** | ✅ | M-PESA STK Push, cards, refunds |
| **Kora Search** | ✅ | Full-text, autocomplete, facets |
| **Kora Reviews** | ✅ | Verified purchase reviews, seller response |
| **Kora Notifications** | ✅ | WhatsApp, SMS, email |
| **Kora Merchant** | ✅ | Seller onboarding, dashboard, payouts |

## Reference Implementation

**Jenga Electronics** — Kenya's premier electronics marketplace, built on Kora.

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

Every Kora deployment is driven by a single config file:

```typescript
// jenga.config.ts
import type { KoraConfig } from '@kora/types';

const config: KoraConfig = {
  instance: { name: 'Jenga Electronics', slug: 'jenga', vertical: 'electronics' },
  modules: { core: true, marketplace: true, bnpl: true, dispatch: true },
  payments: { mpesa: { stkPush: true, paybill: '247247' } },
  // ... full config
};
```

## License

MIT
