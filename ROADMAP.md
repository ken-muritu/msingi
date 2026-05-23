# MSINGI — Production Roadmap

> Phase 1 + 2 + 3 complete. Phase 3.5 (Storefront) complete. Phase 4 in progress.

**Current stage:** Production-ready — live backend API, M-PESA payments, API-persisted cart, real notifications, MeiliSearch, R2 storage, PostHog analytics, Docker + CI/CD, PWA/offline, security hardening, KYC/verification, multi-tenancy, admin dashboard, 35 passing tests (Jest + Playwright). Plus a fully-branded demo storefront at [msingistore.vercel.app](https://msingistore.vercel.app) and 3 showcase stores.

---

## Gap Status

| # | Gap | Status | Notes |
|---|-----|--------|-------|
| 1 | M-PESA Daraja integration | ✅ Done | STK Push, callback, query, reversal |
| 2 | Production database | ✅ Done | `render.yaml` PostgreSQL |
| 3 | Redis + BullMQ queues | ✅ Done | BullMQ wired for notifications |
| 4 | MeiliSearch | ✅ Done | Auto-index, DB fallback |
| 5 | PWA + offline support | ✅ Done | `@serwist/next`, `manifest.ts`, service worker, offline page |
| 6 | Cart state persistence | ✅ Done | `CartModule`, session + user |
| 7 | Checkout flow | ✅ Done | Order → STK → 90s poll → confirm |
| 8 | WhatsApp Business API | ✅ Done | Meta Cloud API + SMS fallback |
| 9 | Email / SMS provider | ✅ Done | Resend + Africa's Talking |
| 10 | Image storage | ✅ Done | Cloudflare R2 + presigned URLs |
| 11 | PostHog analytics | ✅ Done | Backend events + frontend pageviews |
| 12 | Multi-tenancy | ✅ Done | Schema-per-tenant PostgreSQL, domain→schema middleware |
| 13 | Docker containerization | ✅ Done | Multi-stage, non-root, migrate on start |
| 14 | Testing suite | ✅ Done | 35 tests — Jest (3 suites) + Playwright E2E (4 suites) |
| 15 | Documentation site | 🔜 Pending | Docusaurus |
| 21 | Demo storefront (`apps/store`) | ✅ Done | [msingistore.vercel.app](https://msingistore.vercel.app) — Msingi-branded, standalone |
| 22 | Showcase section (landing page) | ✅ Done | Varidi, Aang Web, AddPlus on `#showcase` |
| 23 | Vercel corepack fix | ✅ Done | Pin pnpm@9.1.0 via corepack; `--no-frozen-lockfile` |
| 16 | CI/CD pipeline | ✅ Done | GitHub Actions ci.yml + deploy.yml |
| 17 | Company legal entity | 🔜 Pending | Kenya BRS |
| 18 | KYC / trust systems | ✅ Done | `VerificationModule` — R2 upload, tier workflow, admin approval |
| 19 | Security hardening | ✅ Done | `ThrottlerModule`, `helmet`, `class-validator` DTOs |
| 20 | Admin dashboard | ✅ Done | `/admin` — orders, sellers, KYC, tenants; dark-theme sidebar UI |

---

## Phase 1: Core Infrastructure ✅ COMPLETE

### Week 1 — Database + Cart ✅

- [x] Add `Cart` + `CartItem` models to Prisma schema
- [x] Create `CartModule` — GET/POST/PUT/DELETE + guest-merge endpoint
- [x] API-persisted cart with session + user support
- [x] `render.yaml` with managed PostgreSQL configured

### Week 2 — Payments + Queues ✅

- [x] `MpesaService` with live Daraja STK Push, STK Query, callback, reversal
- [x] BullMQ wired for async notification dispatch
- [x] Idempotency keys on all payment requests

### Week 3 — Checkout + Notifications ✅

- [x] Full checkout flow: cart → address → payment method → M-PESA STK → 90s poll → confirmation
- [x] Server-side price recalculation (frontend prices never trusted)
- [x] `SELECT FOR UPDATE` inventory reservation
- [x] Africa's Talking SMS integration (with graceful fallback)
- [x] Resend email integration (with graceful fallback)
- [x] WhatsApp via Meta Cloud API (with SMS fallback)

### Week 4 — DevOps ✅

- [x] Multi-stage Dockerfile (`node:22-alpine`, non-root user, `prisma migrate deploy` on start)
- [x] GitHub Actions `ci.yml` — lint + Jest + build on every PR
- [x] GitHub Actions `deploy.yml` — Render deploy hook + Vercel on `main`

---

## Phase 2: African Commerce Essentials ✅ COMPLETE

### Week 5 — Search ✅ / PWA ✅

- [x] `SearchService` — MeiliSearch integration with `OnModuleInit` index config
- [x] Auto-index on `CatalogService.createProduct` + `updateProduct`
- [x] `POST /search/reindex` endpoint for full reindex
- [x] DB fallback when `MEILISEARCH_HOST` not set
- [x] PWA (`@serwist/next`) — service worker, `manifest.ts`, offline page, installable

### Week 6 — WhatsApp + Image Storage ✅

- [x] WhatsApp via Meta Cloud API (`graph.facebook.com/v19.0`) with SMS fallback
- [x] `StorageModule` — Cloudflare R2 upload, presigned URLs, delete
- [x] File type + size validation on upload endpoint

### Week 7 — Analytics ✅ / KYC ✅

- [x] `posthog-node` backend — `order_created`, `payment_success`, `payment_failed`, `user_registered`
- [x] `posthog-js` frontend — `PostHogProvider` in root layout, auto pageview capture
- [x] `VerificationModule` — R2 doc upload, `basic`→`verified`→`premium` tier workflow, admin approve/reject

### Week 8 — Multi-Tenancy ✅ / Security ✅

- [x] PostgreSQL schema-per-tenant architecture (`TenantsModule`, `TenantRegistry` model)
- [x] Domain→schema middleware, `TenantPrismaService` for scoped queries
- [x] `ThrottlerModule` global rate limiting, `helmet` headers, `class-validator` DTOs

---

## Phase 3: Polish & Documentation ✅ COMPLETE

### Week 9 — Testing ✅

- [x] Jest unit tests — 35 tests: `CartService`, `OrdersService`, `MpesaService`
- [x] Jest config (`jest.config.ts`), `test` + `test:cov` npm scripts
- [x] Playwright E2E — 4 suites: homepage, product, cart, checkout
- [ ] `supertest` integration tests for API endpoints (deferred)
- [ ] Sentry integration for production error tracking (deferred)

### Week 10 — Docs + Admin + Storefront ✅

- [x] Admin dashboard — `/admin` with dark-theme sidebar layout
- [x] Admin: orders (search + filter + status update), sellers, KYC review, tenant provisioning
- [x] `TESTING.md` — integration testing guide with real M-PESA, R2, SMS, WhatsApp
- [x] `apps/store` — standalone Msingi-branded demo storefront (11 routes, 12 products)
  - Home: hero, flash countdown, trending, brand strip, trust badges
  - Products: listing + filters, detail page + sticky mobile buy bar
  - Cart: coupon codes, free delivery progress bar
  - Checkout: 3-step (contact, shipping, payment)
  - Wishlist: move-all-to-cart, empty state
  - Account: hub, login, register (with password strength meter)
  - 404 page, loading skeleton, DemoBanner ("Powered by Msingi")
  - Msingi indigo/violet brand palette, Inter font, polished CSS utilities
- [x] Showcase section on landing page — 3 live stores (Varidi, Aang Web, AddPlus) + official demo CTA
- [x] Vercel monorepo deployment fixed — corepack pnpm@9.1.0, `--no-frozen-lockfile`
- [x] Merged `store` branch into `main`, deleted remote branch
- [ ] Docusaurus docs site — deferred to Phase 4
- [ ] Fashion vertical template: `templates/fashion/` — deferred

### Week 11 — Security Hardening ✅

- [x] `class-validator` DTOs on all endpoints
- [x] NestJS `ThrottlerModule` — global rate limiting (10 req/min short, 100 req/min medium)
- [x] CSP headers + `helmet`
- [ ] M-PESA callback IP whitelist (deferred)
- [ ] Next.js ISR for product pages (deferred)

---

## Phase 4: Company Formation & Launch (Weeks 13–16)

**Goal:** Msingi is a sellable product with a legal entity.

### Week 13 — Legal Entity

- [ ] Reserve company name at [brs.go.ke](https://brs.go.ke) (~KES 150)
- [ ] Register Company Limited by Shares (~KES 10,650, 3–5 days)
- [ ] Obtain KRA PIN for company (free, 1–2 days)
- [ ] Open corporate bank account (1–2 weeks)
- [ ] Compliance: Data Protection Act 2019, Consumer Protection Act

### Week 14 — Pricing + Sales Materials

- [ ] Define 3 pricing tiers:
  - **Starter** — single store, shared hosting, email support
  - **Business** — multi-seller, dedicated hosting, WhatsApp + priority support
  - **Enterprise** — multi-tenant, custom dev, SLA, training
- [x] Demo site live: [msingistore.vercel.app](https://msingistore.vercel.app)
- [x] Showcase stores: Varidi, Aang Web, AddPlus
- [ ] Case study document (stores as reference)
- [ ] Competitor comparison: Msingi vs Shopify vs Jumia vs custom

### Week 15 — Client Acquisition

- [ ] Approach 3 prospects: physical stores in Nairobi wanting to go digital
- [ ] Partnership discussions with 2 dev agencies
- [ ] Offer aggressive Year 1 pricing to build reference clients
- [ ] Developer community outreach (Twitter/X, dev meetups, Nairobi tech events)

### Week 16 — Launch

- [ ] First paying client signed (target: KES 500K+ initial contract)
- [ ] Launch announcement: social media, dev communities, Kenyan tech press
- [ ] Apply for M-PESA Paybill with company docs
- [ ] Register domains: msingi.dev, msingi.io, msingi.co.ke

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| License | MIT | Developer adoption > code protection. Moat is ecosystem. |
| Multi-tenancy | Schema-per-tenant | Sweet spot for 5–20 clients. Better than shared tables, simpler than DB-per-tenant. |
| Hosting | Render + Vercel | Best free tiers for solo founders. Predictable paid pricing. |
| Payments | M-PESA first, Pesapal cards second | 98%+ of Kenya digital payments are M-PESA. Stripe has no direct Kenya support. |
| WhatsApp | Notifications first, bot later | Start with utility messages ($0.004), layer in catalog/ordering when stable. |
| Search | MeiliSearch self-hosted | Free, sub-50ms, typo-tolerant. Upgrade to Cloud ($30/mo) when needed. |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| M-PESA integration delays | Medium | High | Start sandbox immediately; parallel-path with test credentials |
| Client acquisition challenges | Medium | High | Use Jenga as live reference; aggressive Y1 pricing |
| Solo founder bandwidth | High | Medium | Prioritize ruthlessly; defer non-critical features |
| Competitor response (Shopify/Jumia) | Low | Medium | Differentiate on M-PESA/WhatsApp/local logistics |
| Regulatory changes (CBK, KRA) | Low | Medium | Register company early; stay compliant |
| Open-source fork | Low | Low | MIT allows it; moat is ecosystem, not code |
