# MSINGI — Company-Building Playbook

> Open-source core + premium tooling + services ecosystem.

---

## The Model

Msingi follows the proven pattern used by Laravel, Shopify, WordPress, and Medusa:

- **The framework is free** (MIT license) — this is the acquisition channel
- **Revenue comes from the ecosystem** — hosting, deployment, customization, support

### Precedents

| Company | Open-Source Phase | First Revenue | Breakout |
|---------|------------------|---------------|----------|
| **Shopify** | Built a snowboard store (2004) | Launched platform (2006) | $1B+ revenue |
| **Laravel** | Side project (2011), $0 for 3 years | Laravel Forge (2014) | $57M raise from Accel (2024) |
| **WordPress** | Blog engine (2003) | Automattic hosting (2005) | Powers 43% of the web |
| **Medusa** | Open-source Shopify alt | Medusa Cloud | $25.4M Series A |

**Key insight:** None of these started as platforms. They built something useful, and the platform emerged.

---

## Revenue Layers

| Layer | Product | Revenue Model | Status |
|-------|---------|---------------|--------|
| Core Framework | Msingi (open source) | FREE (MIT) | In development |
| Managed Hosting | Msingi Cloud | Monthly subscription per instance | Future |
| Deployment Tool | `msingi deploy` CLI | Free (drives hosting adoption) | Future |
| Premium Modules | Advanced analytics, AI features | One-time license | Future |
| Custom Development | Integration, customization | Project-based | Available now |
| Support Retainer | SLA, priority support | Monthly retainer | Future |
| Training | Developer certification | Per-session pricing | Future |

---

## Revenue Projections (Conservative)

### Year 1 — KES 3,300,000

| Clients | Revenue Stream | Amount |
|---------|---------------|--------|
| 3 | Custom development (3 × KES 300K) | KES 900,000 |
| 3 | Managed hosting (3 × KES 50K/mo × 12) | KES 1,800,000 |
| 2 | Support retainers (2 × KES 25K/mo × 12) | KES 600,000 |

### Year 2 — KES 15,000,000

| Clients | Revenue Stream | Amount |
|---------|---------------|--------|
| 10 | Managed hosting (10 × KES 75K/mo × 12) | KES 9,000,000 |
| 5 | Custom development (5 × KES 400K) | KES 2,000,000 |
| 5 | Support retainers (5 × KES 50K/mo × 12) | KES 3,000,000 |
| 2 | Agency partnership revenue share | KES 1,000,000 |

---

## Infrastructure Costs

Every component has a free-tier or open-source option:

| Component | Free Option | Cost | Upgrade Trigger |
|-----------|------------|------|-----------------|
| Frontend hosting | Vercel Hobby | $0 | Pro ($20/mo) for commercial use |
| Backend hosting | Render Free | $0 | Starter ($7/mo) for always-on |
| Database | Render PostgreSQL Free | $0 | Paid ($7–25/mo) for backups |
| Cache/Queues | Upstash Redis Free | $0 | ~$20/mo at scale |
| Search | MeiliSearch self-hosted | $0 | Cloud ($30/mo) |
| File Storage | Cloudflare R2 (10 GB) | $0 | $0.015/GB beyond |
| Analytics | PostHog (1M events) | $0 | Usage-based |
| Docs | Docusaurus + Vercel | $0 | Never |
| CI/CD | GitHub Actions | $0 | Free for public repos |
| Email | Resend (3K/mo) | $0 | $0.00040/email beyond |
| SMS | Africa's Talking | Pay-as-you-go | No minimum |
| SSL | Let's Encrypt | $0 | — |

### Total Cost by Phase

| Phase | Monthly | Annual |
|-------|---------|--------|
| Development (free tiers) | **$0** | **$0** |
| First client (mostly free) | ~$20 | ~$240 |
| 5 clients (production) | ~$315 | ~$3,780 |
| 10 clients (scaled) | ~$600 | ~$7,200 |

---

## Pricing Tiers (Proposed)

| Tier | Target | Monthly | Includes |
|------|--------|---------|----------|
| **Starter** | Small shops going digital | KES 25,000 | Single store, shared hosting, email support, basic analytics |
| **Business** | Growing marketplaces | KES 75,000 | Multi-seller, dedicated hosting, WhatsApp notifications, priority support |
| **Enterprise** | Large retailers, chains | KES 200,000+ | Multi-tenant, custom development, SLA, training, dedicated account manager |

### One-Time Services

| Service | Price | Deliverable |
|---------|-------|-------------|
| Store setup + launch | KES 150,000–300,000 | Configured Msingi instance, branding, product import, training |
| M-PESA integration | KES 50,000–100,000 | Daraja API, STK Push, callbacks, reconciliation |
| Custom module development | KES 100,000–500,000 | Bespoke feature built on Msingi architecture |
| WhatsApp commerce bot | KES 75,000–150,000 | Order notifications, catalog sync, cart recovery |

---

## Kenya Company Registration

### Steps

| Step | Action | Cost | Timeline |
|------|--------|------|----------|
| 1 | Reserve company name at [brs.go.ke](https://brs.go.ke) | ~KES 150 | Instant |
| 2 | File registration (Company Limited by Shares) | ~KES 10,650 | 3–5 days |
| 3 | Obtain KRA PIN for company | Free | 1–2 days |
| 4 | Open corporate bank account | Varies | 1–2 weeks |
| 5 | Apply for M-PESA Paybill / Daraja API | Free (with docs) | 7–10 days |

### M-PESA Production Documents (Limited Company)

- Company KRA PIN
- KRA PINs for all directors
- Bank Letter (from registered bank)
- Register of Beneficial Owners (BOF)
- Copies of ID/Passport for all directors
- CR12 (Companies Act 2015)
- Certificate of Incorporation
- M-Pesa C2B Service Application Form

### Legal Compliance

- **Business Registration (BRS)** — mandatory
- **KRA PIN** — tax compliance
- **Data Protection Act 2019** — privacy policy, consent, secure hosting
- **Consumer Protection Act** — fair pricing, refund policies
- **CBK-licensed payment providers** — for card processing (Pesapal)

---

## Competitive Position

### Why Not Shopify?

- No native M-PESA integration (requires third-party apps)
- Pricing in USD — expensive for small Kenyan businesses
- No WhatsApp commerce integration
- No offline/PWA support for 3G networks
- No multi-seller marketplace out of the box

### Why Not Jumia?

- Commission-heavy marketplace model (15–25%)
- Sellers don't own their customer data
- No white-label option
- Limited to Jumia's categories and rules

### Msingi's Moat

- **M-PESA native** — STK Push, BNPL, reconciliation built into the core
- **WhatsApp native** — commerce where African customers already are
- **Config-driven** — one config file defines an entire business
- **Open source** — developers can inspect, extend, and trust the code
- **African-first** — built for KES, 3G networks, WhatsApp-first commerce behavior

---

## Go-to-Market Strategy

### Phase 1: Reference Client (Weeks 13–16)

1. Launch Jenga Electronics as live reference implementation
2. Approach 3 physical stores in Nairobi wanting to go digital
3. Offer aggressive Year 1 pricing (KES 25K/mo vs market rate of 75K+)
4. Build case studies from first 3 deployments

### Phase 2: Agency Partnerships (Months 4–6)

1. Identify 2–3 Nairobi dev agencies building e-commerce
2. Offer Msingi as their commerce foundation (they deploy, you host)
3. Revenue share: 20% of hosting fees for agency-referred clients
4. Joint marketing: "Built on Msingi" badge

### Phase 3: Community (Months 6–12)

1. Developer documentation site (Docusaurus)
2. Nairobi tech meetup presentations
3. Twitter/X developer community
4. Open-source contributors program
5. "Built with Msingi" showcase page

---

## Critical Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| **License** | Keep MIT | Developer adoption > code protection. The moat is ecosystem, not code. |
| **Hosting** | Render + Vercel | Best free tiers. Predictable pricing. No Fly.io (removed free tier 2024). |
| **Payments** | M-PESA first, Pesapal cards second | 98%+ of Kenya digital payments. No direct Stripe in Kenya. |
| **Multi-tenancy** | Schema-per-tenant | Sweet spot for 5–20 clients. Year 1 scale. |
| **Investment** | Bootstrap first | Laravel bootstrapped for 13 years. Prove revenue before raising. |
