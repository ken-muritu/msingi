# MSINGI — Integration Testing Guide

> How to test every integration with real users, real money, and real services.

---

## Quick Start

```bash
# 1. Copy and fill in your env
cp backend/.env.example backend/.env

# 2. Start both servers
pnpm dev:backend   # http://localhost:4000
pnpm dev           # http://localhost:3000
```

The admin dashboard at `http://localhost:3000/admin` auto-detects whether the backend is live. If the backend is not running, it falls back to mock data and shows a banner.

---

## Environment Variables — Minimum Viable Set

Start here. Every integration below lists which variables it needs.

```bash
# backend/.env

# ── Required for everything ────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/msingi_dev?schema=public"
JWT_SECRET="change-me-in-production-min-32-chars"
PORT=4000
CORS_ORIGIN=http://localhost:3000

# ── M-PESA ─────────────────────────────────────────────────────────────────
MPESA_CONSUMER_KEY=        # From developer.safaricom.co.ke
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=174379     # Daraja sandbox default
MPESA_ENV=sandbox          # sandbox | production
MPESA_CALLBACK_URL=https://<your-ngrok-id>.ngrok.io/api/v1/payments/mpesa/callback

# ── Email ──────────────────────────────────────────────────────────────────
RESEND_API_KEY=            # From resend.com (free: 3,000/mo)
EMAIL_FROM=noreply@msingi.co.ke

# ── SMS ────────────────────────────────────────────────────────────────────
AT_API_KEY=                # From africastalking.com sandbox
AT_USERNAME=sandbox
AT_SENDER_ID=MSINGI

# ── Storage (KYC doc uploads) ──────────────────────────────────────────────
STORAGE_PROVIDER=local     # local | cloudflare-r2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=msingi-assets
R2_PUBLIC_URL=https://pub-XXXXXX.r2.dev/msingi-assets

# ── Search ─────────────────────────────────────────────────────────────────
MEILISEARCH_HOST=http://localhost:7700   # omit to fall back to DB search
MEILISEARCH_API_KEY=
```

---

## 1. Auth Flow

**Variables needed:** `DATABASE_URL`, `JWT_SECRET`

### Test steps

1. Go to `http://localhost:3000` → click **Sign Up**
2. Register with a real email address
3. Login → check browser `localStorage` for `msingi_token`
4. Visit `http://localhost:3000/account` — should load your profile

### API test

```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"test123456","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"you@example.com","password":"test123456"}'
# → returns { "access_token": "eyJ..." }
```

### Seed credentials (already in DB after `pnpm db:seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@jenga.co.ke` | `admin123456` |
| Seller | `samsung@jenga.co.ke` | `seller123456` |
| Buyer | `buyer@test.com` | `buyer123456` |

---

## 2. M-PESA Payments

**Variables needed:** `MPESA_*` + `MPESA_CALLBACK_URL`

### Getting Daraja sandbox credentials

1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke) → create account
2. Create an app → subscribe to **Lipa Na M-PESA Sandbox**
3. Copy **Consumer Key**, **Consumer Secret**, **Passkey**
4. Set `MPESA_SHORTCODE=174379` and `MPESA_ENV=sandbox`

### Exposing your local callback

M-PESA needs to call your backend. Use ngrok:

```bash
ngrok http 4000
# Copy the HTTPS URL e.g. https://abc123.ngrok.io
# Set: MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/v1/payments/mpesa/callback
```

Restart the backend after updating `.env`.

### Test the full checkout flow

1. Add products to cart → proceed to checkout
2. Enter the Daraja **test phone number**: `254708374149`
3. Click **Pay with M-PESA** → STK Push prompt appears in the simulator
4. Confirm in the [Daraja simulator](https://developer.safaricom.co.ke/MyApps) → **Simulate C2B**
5. The frontend polls every 3 seconds for up to 90 seconds
6. Order status updates to `confirmed` on successful callback

### Admin — verify the order appeared

Go to `http://localhost:3000/admin` → **Orders** tab → order should appear with `payment_status: paid`.

### API test

```bash
TOKEN="eyJ..."  # from login above

# Initiate STK Push
curl -X POST http://localhost:4000/api/v1/payments/mpesa/stk-push \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<order-id>","phone":"254708374149"}'

# Query payment status
curl -X POST http://localhost:4000/api/v1/payments/mpesa/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"checkoutRequestId":"<checkout-request-id>"}'
```

---

## 3. Notifications (Email + SMS + WhatsApp)

**Variables needed:** `RESEND_API_KEY`, `AT_API_KEY`, optionally `WHATSAPP_TOKEN`

Notifications fire automatically on:
- **Order created** → email + SMS to buyer
- **Payment confirmed** → email + SMS to buyer
- **KYC approved/rejected** → email to seller

### Email (Resend)

1. Sign up at [resend.com](https://resend.com) — free tier: 3,000 emails/month
2. Create an API key → set `RESEND_API_KEY`
3. Place an order → check inbox for confirmation email

> On localhost, Resend requires a verified domain for the `from` address. Use `onboarding@resend.dev` as `EMAIL_FROM` during development.

### SMS (Africa's Talking)

1. Sign up at [africastalking.com](https://africastalking.com) → use **Sandbox**
2. Copy API key → set `AT_API_KEY=your-key`, `AT_USERNAME=sandbox`
3. Place an order → check the AT sandbox dashboard for outbound SMS logs

### WhatsApp (Meta Cloud API)

1. Set up a Meta Business account → create a WhatsApp Business app
2. Set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID` in `.env`
3. The system automatically falls back: WhatsApp → SMS → silent fail if neither configured

---

## 4. KYC / Seller Verification

**Variables needed:** `DATABASE_URL`, `JWT_SECRET`, optionally `STORAGE_PROVIDER=cloudflare-r2` + `R2_*`

### Test steps

1. Register a seller account at `http://localhost:3000/seller`
2. Upload business documents (ID, certificate, etc.)
   - With `STORAGE_PROVIDER=local`: files saved to `backend/uploads/`
   - With R2 configured: files uploaded to Cloudflare R2 bucket
3. Submit KYC request
4. Go to `http://localhost:3000/admin` → **KYC** tab
5. Click **Approve** or **Reject**
6. Seller receives email notification (if `RESEND_API_KEY` set)

### API test

```bash
SELLER_TOKEN="eyJ..."

# Submit KYC (multipart form with documents)
curl -X POST http://localhost:4000/api/v1/verification \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -F "tier=verified" \
  -F "documents[]=@./id-copy.pdf"

# Admin approve (use admin token)
ADMIN_TOKEN="eyJ..."
curl -X PATCH http://localhost:4000/api/v1/verification/<request-id>/review \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'
```

---

## 5. Multi-Tenancy

**Variables needed:** `DATABASE_URL`, `JWT_SECRET`

### What it does

Each tenant gets an isolated PostgreSQL schema (`tenant_<slug>`). A request to `techshop.msingi.co.ke` automatically scopes all queries to `tenant_techshop`.

### Test steps

1. Go to `http://localhost:3000/admin` → **Tenants** tab
2. Fill in: **Business name**, **slug** (e.g. `techshop`), **Plan**
3. Click **Create Tenant** → a new PostgreSQL schema `tenant_techshop` is created live
4. Set the `X-Tenant-Slug` header on API requests to scope them to that tenant:

```bash
curl http://localhost:4000/api/v1/products \
  -H "X-Tenant-Slug: techshop"
```

5. Suspend or activate tenants from the Admin → Tenants table

### API test

```bash
ADMIN_TOKEN="eyJ..."

# Create tenant
curl -X POST http://localhost:4000/api/v1/tenants \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"TechShop Kenya","slug":"techshop","plan":"starter"}'

# List tenants
curl http://localhost:4000/api/v1/tenants \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 6. Search (MeiliSearch)

**Variables needed:** `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`

### Local MeiliSearch setup

```bash
# Docker (fastest)
docker run -d -p 7700:7700 getmeili/meilisearch:latest

# Or download binary from https://github.com/meilisearch/meilisearch/releases
```

Set `MEILISEARCH_HOST=http://localhost:7700` and restart backend. Products are auto-indexed on create/update.

### Force reindex

```bash
curl -X POST http://localhost:4000/api/v1/search/reindex \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Test search

```bash
curl "http://localhost:4000/api/v1/search?q=samsung"
curl "http://localhost:4000/api/v1/search?q=laptop&category=electronics"
```

> Without `MEILISEARCH_HOST`, the backend falls back to PostgreSQL `ILIKE` search automatically.

---

## 7. Cloudflare R2 Storage

**Variables needed:** `STORAGE_PROVIDER=cloudflare-r2`, `R2_*`

### Setup

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com) → R2
2. Create a bucket (e.g. `msingi-assets`)
3. Create an API token with **Object Read & Write** permissions
4. Copy `Account ID`, `Access Key ID`, `Secret Access Key`
5. Set `R2_PUBLIC_URL` to your bucket's public domain

### Test upload

```bash
TOKEN="eyJ..."
curl -X POST http://localhost:4000/api/v1/storage/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./test-image.jpg" \
  -F "folder=products"
# → returns { "url": "https://pub-xxx.r2.dev/msingi-assets/products/test-image.jpg", "key": "..." }
```

---

## 8. Running Tests

### Unit tests (Jest)

```bash
pnpm --filter @msingi/backend test
pnpm --filter @msingi/backend test:cov   # with coverage report
```

### E2E tests (Playwright)

```bash
# Requires frontend dev server running on :3000
pnpm --filter @msingi/web test:e2e

# Interactive UI mode (watch + debug)
pnpm --filter @msingi/web test:e2e:ui

# Specific suite
pnpm --filter @msingi/web test:e2e -- --grep "checkout"
```

**35 tests, 7 suites:**

| Suite | What it covers |
|-------|----------------|
| `homepage.spec.ts` | Landing page render, nav links, hero CTA, framework stats |
| `product.spec.ts` | Product listing, filter by category/price, detail page |
| `cart.spec.ts` | Add to cart, quantity update, remove item, cart total |
| `checkout.spec.ts` | Checkout flow, address form, M-PESA modal trigger |
| `cart.service.spec.ts` | resolveCart, addItem, updateItem, clearCart, mergeGuestCart |
| `orders.service.spec.ts` | createOrder, getOrderById, updateOrderStatus, getUserOrders |
| `mpesa.service.spec.ts` | formatPhone, generatePassword, validateCallback |

---

## 9. Admin Dashboard

Access at `http://localhost:3000/admin`.

| Tab | Live action |
|-----|-------------|
| **Overview** | Category revenue bars + recent activity feed |
| **Orders** | Search by order number, filter by status, update status inline |
| **Sellers** | Search sellers, see badge + verification state |
| **KYC** | Approve / Reject seller verification requests; click doc links |
| **Tenants** | Provision new tenant, suspend/activate |

The dashboard shows a **"Live data · backend connected"** indicator when the backend is running, or **"Showing mock data"** when offline.

---

## 10. Deployment Testing (Production)

### Backend on Render

```bash
# Connect repo at render.com → New > Blueprint
# render.yaml handles everything automatically

# Required secrets to set in Render dashboard:
JWT_SECRET
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_PASSKEY
MPESA_CALLBACK_URL=https://your-api.onrender.com/api/v1/payments/mpesa/callback
RESEND_API_KEY
AT_API_KEY
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

### Frontend on Vercel

```bash
# In Vercel project settings:
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
```

### Smoke test after deployment

```bash
API=https://your-api.onrender.com/api/v1

curl $API/health
# → { "status": "ok", "version": "1.0.0", "modules": [...] }

curl $API/products
# → { "data": [...], "total": N, "page": 1 }
```

---

## Troubleshooting

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| Admin shows mock data | Backend not running | Run `pnpm dev:backend` |
| M-PESA STK Push not received | Wrong callback URL | Run ngrok + update `MPESA_CALLBACK_URL` |
| KYC upload fails | `STORAGE_PROVIDER` not set | Set to `local` for dev or configure R2 |
| Emails not sending | Missing `RESEND_API_KEY` | Add key or check Resend dashboard |
| Search returns nothing | MeiliSearch not running | Start MeiliSearch or omit `MEILISEARCH_HOST` for DB fallback |
| Tenant creation fails | Slug already exists | Use a unique slug |
| JWT errors | Wrong `JWT_SECRET` | Ensure backend and any test clients share the same secret |
