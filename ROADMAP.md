# MSINGI — Production Roadmap

> 16 weeks from polished prototype to sellable product.

**Current stage:** Polished prototype — landing page live, product catalog functional with mock data, backend scaffolded but not deployed.

---

## The 18 Gaps

Ordered by severity. Every gap has a free-tier or open-source solution.

| # | Gap | Severity | Solution | Free Tier |
|---|-----|----------|----------|-----------|
| 1 | M-PESA Daraja integration | 95 | Safaricom Daraja API 2.0 | Free sandbox |
| 2 | Production database | 90 | Render PostgreSQL | 1 GB free |
| 3 | Redis + BullMQ queues | 85 | Upstash Redis + BullMQ | 256 MB / 500K cmds free |
| 4 | MeiliSearch | 80 | Self-hosted (Rust, MIT) | $0 self-hosted |
| 5 | PWA + offline support | 75 | Serwist + Next.js | Free (open source) |
| 6 | Cart state persistence | 75 | API-persisted cart (PostgreSQL) | — |
| 7 | Checkout flow | 70 | Multi-step form + payment orchestration | — |
| 8 | WhatsApp Business API | 70 | 360dialog / Twilio BSP | Service msgs free |
| 9 | Email / SMS provider | 65 | Resend + Africa's Talking | 3K emails/mo free |
| 10 | Image storage | 60 | Cloudflare R2 | 10 GB free, $0 egress |
| 11 | PostHog analytics | 55 | PostHog Cloud | 1M events/mo free |
| 12 | Multi-tenancy | 55 | PostgreSQL schema-per-tenant | — |
| 13 | Docker containerization | 50 | Multi-stage Dockerfile | — |
| 14 | Testing suite | 45 | Jest + Playwright | Free (open source) |
| 15 | Documentation site | 40 | Docusaurus + Vercel | $0 |
| 16 | CI/CD pipeline | 35 | GitHub Actions | Free for public repos |
| 17 | Company legal entity | 30 | Kenya BRS registration | ~KES 10,800 |
| 18 | KYC / trust systems | 30 | Tiered verification module | — |

---

## Phase 1: Core Infrastructure (Weeks 1–4)

**Goal:** A working backend with real database, payments, and deployment.

### Week 1 — Database + Cart

- [ ] Set up Render PostgreSQL (free tier, 1 GB)
- [ ] Deploy NestJS backend to Render web service
- [ ] Live API at `api.msingi.co.ke` (or Render subdomain)
- [ ] Add `Cart` + `CartItem` models to Prisma schema
- [ ] Create `CartModule` — POST/GET/PATCH/DELETE endpoints
- [ ] Update frontend `store.ts` to sync cart with API
- [ ] Cart survives page refresh, works across devices

### Week 2 — Payments + Queues

- [ ] Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
- [ ] Create sandbox app, get Consumer Key + Secret
- [ ] Build `MpesaService` in NestJS:
  - `POST /payments/mpesa/stkpush` — initiate STK Push
  - `POST /payments/mpesa/callback` — receive async callback
  - `POST /payments/mpesa/query` — check transaction status
  - `POST /payments/mpesa/reversal` — reverse failed txns
- [ ] Set up Upstash Redis (free tier)
- [ ] Install `bullmq` + `ioredis`
- [ ] Create queue producers for notifications
- [ ] Add `@bull-board/express` monitoring dashboard at `/admin/queues`

### Week 3 — Checkout + Notifications

- [ ] Build checkout flow: cart → address → payment → confirmation
- [ ] `OrdersModule` — create PENDING order, reserve inventory
- [ ] Server-side price recalculation (never trust frontend)
- [ ] Inventory reservation with `SELECT FOR UPDATE` locking
- [ ] Idempotency keys on every payment request
- [ ] Integrate Africa's Talking SMS — order confirmations
- [ ] Integrate Resend email — order confirmations, receipts
- [ ] BullMQ workers for async notification dispatch

### Week 4 — Production Payments + DevOps

- [ ] Apply for M-PESA production credentials (requires company registration)
  - Company KRA PIN, director IDs, CR12, bank letter, BOF
  - Approval: 7–10 working days
- [ ] Docker multi-stage Dockerfile for backend
  - `node:22-alpine`, non-root user, `pnpm install --frozen-lockfile`
  - Final image < 200 MB
- [ ] GitHub Actions CI/CD:
  - `test.yml` — lint, type-check, Jest on every PR
  - `deploy-backend.yml` — build + push to Render on merge to main
  - `deploy-frontend.yml` — Vercel auto-deploys (already configured)

---

## Phase 2: African Commerce Essentials (Weeks 5–8)

**Goal:** The features that make Msingi "African commerce" — not generic e-commerce.

### Week 5 — Search + PWA

- [ ] Deploy MeiliSearch on Render (self-hosted, free)
- [ ] `SearchModule` — index products on create/update
- [ ] Frontend search: typo-tolerant, autocomplete, faceted filters
- [ ] Install `@serwist/next` for PWA
- [ ] Create `app/manifest.ts` for install prompt
- [ ] Service worker: precache static assets, runtime cache API responses
- [ ] Offline fallback page
- [ ] Target: Lighthouse PWA score 90+

### Week 6 — WhatsApp + Image Storage

- [ ] Sign up with WhatsApp BSP (360dialog or Twilio)
- [ ] `WhatsAppModule` — send templated messages via BullMQ
- [ ] Webhook handlers for incoming WhatsApp messages
- [ ] Use cases: order confirmation, delivery updates
- [ ] Set up Cloudflare R2 bucket
- [ ] `@aws-sdk/client-s3` for uploads (R2 is S3-compatible)
- [ ] Product image upload endpoint
- [ ] Next.js `<Image>` with Cloudflare CDN loader

### Week 7 — Analytics + KYC

- [ ] Install `posthog-js` (frontend) + `posthog-node` (backend)
- [ ] Track: `product_viewed`, `added_to_cart`, `checkout_started`, `payment_initiated`, `order_completed`
- [ ] Session replay for UX debugging
- [ ] `VerificationModule` — document upload (to R2), review queue (BullMQ), admin approval
- [ ] Tiered badges: Unverified → Basic → Verified → Premium
- [ ] Display badges on seller profiles and product cards

### Week 8 — Multi-Tenancy + COD

- [ ] PostgreSQL schema-per-tenant architecture
  - `tenants` table maps domains → schemas
  - NestJS middleware: extract domain → set `search_path`
  - Prisma `$queryRaw` for schema switching
- [ ] Jenga Electronics as tenant #1
- [ ] Second demo tenant (fashion vertical)
- [ ] Cash on Delivery flow
  - Delivery zone validation
  - COD fee calculation
  - Driver confirmation workflow

---

## Phase 3: Polish & Documentation (Weeks 9–12)

**Goal:** Production polish and developer experience.

### Week 9 — Testing + Error Handling

- [ ] Jest unit tests for services, DTOs, utilities
- [ ] `supertest` integration tests for API endpoints
- [ ] Playwright E2E: browse → cart → checkout → payment callback
- [ ] Target: 80%+ coverage on critical paths (payments, orders, inventory)
- [ ] Sentry integration for production error tracking
- [ ] Structured logging with request IDs

### Week 10 — Docs + Fashion Template

- [ ] `npx create-docusaurus@latest docs/msingi-docs classic`
- [ ] Add to monorepo, deploy to Vercel
- [ ] API reference auto-generated from OpenAPI/Swagger
- [ ] Guides: Getting Started, Configuration, Deployment, M-PESA
- [ ] Fashion vertical template: categories, size guides, color swatches
- [ ] `templates/fashion/` with template.json + categories.json

### Week 11 — Admin + Performance

- [ ] Admin dashboard: order management, seller approvals, analytics
- [ ] Seller dashboard improvements: order history, payout tracking
- [ ] Performance optimization:
  - Next.js ISR for product pages
  - Database query optimization (indexes, eager loading)
  - Image lazy loading + blur placeholders
- [ ] Target: Lighthouse 90+ on mobile, <3s load time

### Week 12 — Security + Load Testing

- [ ] Security audit:
  - Input validation (class-validator DTOs)
  - XSS protection (CSP headers)
  - Rate limiting (NestJS throttler)
  - CORS configuration
  - SQL injection prevention (Prisma handles this)
- [ ] M-PESA callback IP whitelist validation
- [ ] Load testing: 100 concurrent users, <500ms response
- [ ] Database connection pooling (PgBouncer or Prisma pool)

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
- [ ] Demo site with live Jenga Electronics data
- [ ] Case study document (Jenga as reference)
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
