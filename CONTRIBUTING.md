# Contributing to Msingi

## Development Setup

### Prerequisites

- **Node.js** 18+
- **pnpm** 9+ (`npm install -g pnpm`)
- **PostgreSQL** 15+

### Quick Start

```bash
git clone https://github.com/ken-muritu/msingi.git
cd msingi
pnpm install

# Build shared packages
pnpm --filter @msingi/types build
pnpm --filter @msingi/config build

# Setup database
cp backend/.env.example backend/.env
# Edit backend/.env — set DATABASE_URL
pnpm db:push
pnpm --filter @msingi/backend db:seed

# Start everything
pnpm dev
```

- **Frontend** → http://localhost:3000 (landing page)
- **Backend** → http://localhost:4000
- **Swagger** → http://localhost:4000/api/docs
- **Demo store** → http://localhost:3000/products
- **Msingi Store** → `pnpm --filter @msingi/store dev` → http://localhost:3001

### Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@jenga.co.ke` | `admin123456` |
| Seller | `samsung@jenga.co.ke` | `seller123456` |
| Buyer | `buyer@test.com` | `buyer123456` |

---

## Project Structure

```
msingi/
├── apps/web/           → @msingi/web (Next.js 14 framework site + reference store)
├── apps/store/         → @msingi/store (Msingi-branded demo storefront)
├── backend/            → @msingi/backend (NestJS 10 API)
├── packages/types/     → @msingi/types (MsingiConfig type system)
├── packages/config/    → @msingi/config (config loader + helpers)
├── templates/          → Vertical templates (electronics, fashion)
├── jenga.config.ts     → Reference implementation config
└── turbo.json          → Turborepo pipeline
```

### Key Directories

| Path | Package | Description |
|------|---------|-------------|
| `apps/web/app/` | `@msingi/web` | Next.js App Router pages |
| `apps/web/components/landing/` | `@msingi/web` | Framework landing page (9 components incl. Showcase) |
| `apps/web/components/home/` | `@msingi/web` | Store homepage (reference implementation) |
| `apps/web/lib/` | `@msingi/web` | API client, hooks, stores, utils |
| `apps/store/app/` | `@msingi/store` | Demo storefront pages (11 routes) |
| `apps/store/components/` | `@msingi/store` | DemoBanner, Navbar, Footer, BottomNav, ProductCard |
| `apps/store/lib/` | `@msingi/store` | clientConfig, mock data (12 products), Zustand stores |
| `backend/src/modules/` | `@msingi/backend` | 12 NestJS domain modules + global AnalyticsModule |
| `backend/src/types/` | `@msingi/backend` | Custom type declarations (`africastalking.d.ts`) |
| `backend/prisma/` | `@msingi/backend` | Schema (14 models) + seed data |
| `packages/types/src/` | `@msingi/types` | MsingiConfig + 20 interfaces |
| `packages/config/src/` | `@msingi/config` | defineConfig, getConfig, formatPrice |

---

## Architecture

### Frontend (apps/web)

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS (dark theme for landing, indigo/violet for store)
- **State**: Zustand (cart, wishlist, compare)
- **API layer**: Typed fetch client with automatic fallback to mock data
- **Landing page**: 8 components in `components/landing/`

### Backend (backend/)

- **Framework**: NestJS 10 with modular architecture
- **ORM**: Prisma with PostgreSQL (14 models)
- **Auth**: JWT + bcrypt via global `JwtAuthGuard`; `@Public()` decorator for open endpoints
- **API**: RESTful, all endpoints prefixed with `/api/v1/`
- **Docs**: Swagger at `/api/docs`
- **Payments**: Live M-PESA Daraja STK Push → callback → status query
- **Notifications**: WhatsApp (Meta Cloud API) → SMS (Africa's Talking) fallback → Resend email
- **Search**: MeiliSearch with DB fallback; auto-indexed on product create/update
- **Storage**: Cloudflare R2 via `@aws-sdk/client-s3`
- **Analytics**: PostHog server-side via `AnalyticsModule` (global, production-only)
- **Queue**: BullMQ for async notification dispatch
- **Cart**: API-persisted, session+user, guest→user merge on login

### Shared Packages

- **@msingi/types**: TypeScript interfaces for MsingiConfig and commerce entities
- **@msingi/config**: Config loader with `defineConfig()`, `getConfig()`, `formatPrice()`

---

## Common Commands

```bash
# Development
pnpm dev                              # Start all (frontend + backend)
pnpm dev:web                          # Frontend only
pnpm dev:backend                      # Backend only

# Building
pnpm build                            # Build all packages
pnpm --filter @msingi/web build       # Build framework site
pnpm --filter @msingi/store build     # Build demo storefront
pnpm --filter @msingi/backend build   # Build backend
pnpm --filter @msingi/types build     # Build types package
pnpm --filter @msingi/config build    # Build config package

# Database
pnpm db:push                          # Push schema to database
pnpm --filter @msingi/backend db:seed # Seed reference data

# Testing
pnpm --filter @msingi/backend test       # Run 31 Jest unit tests
pnpm --filter @msingi/backend test:cov   # With coverage report

# Production
pnpm --filter @msingi/backend start:migrate  # migrate + start (used in Docker CMD)
```

---

## Code Style

- **TypeScript** everywhere — minimise `any` types
- **Tailwind CSS** for styling — no custom CSS unless necessary
- **NestJS conventions** — decorators, modules, services, controllers
- **Prisma** for all database access — no raw SQL unless required
- **Functional React** — hooks, no class components
- **`@Public()` decorator** on any endpoint that should bypass JWT auth
- **Non-blocking side effects** — analytics + notifications are fire-and-forget (`.catch(() => null)`)

---

## License

MIT — see [LICENSE](./LICENSE) for details.
