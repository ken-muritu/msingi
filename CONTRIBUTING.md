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
├── apps/web/           → @msingi/web (Next.js 14 frontend)
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
| `apps/web/components/landing/` | `@msingi/web` | Framework landing page (8 components) |
| `apps/web/components/home/` | `@msingi/web` | Store homepage (Jenga reference) |
| `apps/web/lib/` | `@msingi/web` | API client, hooks, stores, utils |
| `backend/src/modules/` | `@msingi/backend` | 10 NestJS domain modules |
| `backend/prisma/` | `@msingi/backend` | Schema (12 models) + seed data |
| `packages/types/src/` | `@msingi/types` | MsingiConfig + 20 interfaces |
| `packages/config/src/` | `@msingi/config` | defineConfig, getConfig, formatPrice |

---

## Architecture

### Frontend (apps/web)

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS (dark theme for landing, store theme for demo)
- **State**: Zustand (cart, wishlist, compare)
- **API layer**: Typed fetch client with automatic fallback to mock data
- **Landing page**: 8 components in `components/landing/`

### Backend (backend/)

- **Framework**: NestJS 10 with modular architecture
- **ORM**: Prisma with PostgreSQL
- **Auth**: JWT + bcrypt, role-based (ADMIN, SELLER, BUYER)
- **API**: RESTful, all endpoints prefixed with `/api/v1/`
- **Docs**: Swagger at `/api/docs`

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
pnpm --filter @msingi/web build       # Build frontend
pnpm --filter @msingi/backend build   # Build backend
pnpm --filter @msingi/types build     # Build types package
pnpm --filter @msingi/config build    # Build config package

# Database
pnpm db:push                          # Push schema to database
pnpm --filter @msingi/backend db:seed # Seed reference data
```

---

## Code Style

- **TypeScript** everywhere — no `any` types
- **Tailwind CSS** for styling — no custom CSS unless necessary
- **NestJS conventions** — decorators, modules, services, controllers
- **Prisma** for all database access — no raw SQL unless required
- **Functional React** — hooks, no class components

---

## License

MIT — see [LICENSE](./LICENSE) for details.
