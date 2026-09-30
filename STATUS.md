# Poka Print Studio — Project Status & Developer Handoff

## What Is This

**Poka Print Studio** is a full-stack 3D printing e-commerce platform built with Next.js 16 (App Router, Turbopack), React 19, Prisma 7 + PostgreSQL, NextAuth v5, Razorpay, AWS S3, and Resend.

Two business models:
1. **Custom quote flow** — customer uploads STL/STEP/OBJ/3MF → instant price estimate → admin reviews → sends payment link → production
2. **Shop** — pre-made 3D printed products with cart + checkout

---

## Environment Setup (Required Before Running)

Copy `.env` (already exists) and fill in:

```bash
# Database — local Postgres required
DATABASE_URL="postgresql://postgres:password@localhost:5432/poka_print_studio?schema=public"

# NextAuth — generate with: openssl rand -base64 32
AUTH_SECRET="..."

# AWS S3 (optional for dev — local fallback exists without these)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="poka-print-studio-uploads"

# Razorpay (required for payment flow)
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="..."

# Resend (required for email notifications)
RESEND_API_KEY="..."
EMAIL_FROM="noreply@pokaprintstudio.in"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
ADMIN_EMAIL="admin@pokaprintstudio.in"
```

### Start PostgreSQL locally

```bash
# Docker (recommended)
docker run --name poka-print-studio-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=poka_print_studio -p 5432:5432 -d postgres:16

# Then push schema and seed
npm run db:push
npm run db:seed
```

Default admin after seed: `admin@pokaprintstudio.in` / `Admin@123`

---

## Running

```bash
npm install
npm run dev          # http://localhost:3000
npm run db:studio    # Prisma Studio at http://localhost:5555
```

---

## Architecture

```
src/
├── app/
│   ├── (marketing)/      # /contact
│   ├── (quote)/          # /quote, /quote/estimate, /quote/submitted
│   ├── (shop)/           # /shop, /shop/[slug]  ← /shop/[slug] PAGE MISSING
│   ├── (customer)/       # /dashboard, /quotes, /orders
│   ├── (auth)/           # /login, /register
│   ├── (admin)/          # /admin/* (role-gated)
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── upload/           # POST — S3 presign or local fallback
│       ├── upload/local/     # POST — local filesystem upload (dev)
│       ├── analyze/          # POST — STL parse or STEP/OBJ/3MF estimate
│       ├── quotes/[id]/      # GET — quote detail
│       └── payments/
│           ├── razorpay/create-order/
│           └── razorpay/webhook/
├── actions/              # Server actions (quote, payment, auth, contact)
├── components/
│   ├── home/             # Landing page sections
│   ├── layout/           # Header, Footer, Providers
│   ├── quote/            # FileUploadZone, ConfiguratorPanel, PriceBreakdown
│   ├── shop/             # AddToCartWrapper, CartDrawer
│   ├── lead/             # WhatsAppFloat, ExitIntentPopup
│   ├── shared/           # ScrollReveal, GlassCard, AnimatedCounter, StructuredData
│   └── ui/               # Radix/Shadcn primitives
├── lib/
│   ├── auth.ts           # NextAuth v5 config
│   ├── prisma.ts         # Singleton PrismaClient with PrismaPg adapter
│   ├── s3.ts             # AWS S3 presigned URLs
│   ├── pricing.ts        # Quote price calculator
│   ├── stl-analyzer.ts   # Binary/ASCII STL parser
│   ├── email.ts          # Resend transactional emails
│   ├── razorpay.ts       # Razorpay SDK helpers
│   ├── stripe.ts         # Stripe SDK (initialized, not wired)
│   └── validations.ts    # Zod schemas
├── store/
│   ├── quoteStore.ts     # Zustand — file upload state + price config
│   └── cartStore.ts      # Zustand (persisted) — cart items
├── constants/
│   └── materials.ts      # Materials, layer heights, infill, finish, delivery options
└── types/
    └── next-auth.d.ts    # Session type augmentation
```

---

## Feature Status

### Working

| Feature | Notes |
|---------|-------|
| Homepage | All 7 sections, animations, JSON-LD SEO |
| Auth — register/login | Credentials provider. Google OAuth config exists, needs `AUTH_GOOGLE_ID` |
| Quote flow — file upload | **S3 when configured; local filesystem fallback when AWS keys empty** |
| Quote flow — STL analysis | Binary + ASCII STL full parse; STEP/OBJ/3MF size-based estimate |
| Quote flow — configurator | 9 materials, 4 layer heights, 5 infill levels, 4 finishes, 3 delivery speeds |
| Quote flow — pricing | Material weight + machine time + finish surcharge + quantity discount |
| Quote flow — submission | Guest or logged-in; stores to DB; emails customer + admin |
| Admin dashboard | Overview stats, quote list (11 statuses), quote detail, order list, customer list, product list |
| Admin — quote actions | Set final price, update status (audit log), create Razorpay payment link |
| Payment — Razorpay | Create order, payment link, webhook handler, signature verification |
| Shop page | Shows products from DB; **graceful "coming soon" if DB offline** |
| Cart | Zustand persisted cart, add/remove/qty, cart drawer |
| Contact form | Saves to DB, sends admin email |
| Email notifications | Quote submitted, admin alert, status update, order update |
| Middleware | Route protection by auth status + role |

### Broken / Missing

| Issue | Root Cause | Fix Needed |
|-------|-----------|------------|
| Shop — no products | DB empty (no seed run yet) | Run `npm run db:seed` after DB is up |
| Shop — `/shop/[slug]` | Product detail page not created | **Create `src/app/(shop)/shop/[slug]/page.tsx`** |
| Customer `/invoices` | Page stub, no content | Implement invoice list page |
| Customer `/profile` | Page stub, no content | Implement profile edit page |
| Admin `/admin/invoices` | Stub | Implement |
| Admin `/admin/settings` | Stub | Implement |
| Admin — recharts | Package installed, not used | Add charts to admin overview |
| PDF invoice | `@react-pdf/renderer` installed, not used | Wire up PDF generation in payment webhook |
| Stripe | SDK initialized in `lib/stripe.ts`, no webhook/checkout wired | Either wire up or remove |
| Google OAuth | Keys empty | Fill `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` |
| Email | `RESEND_API_KEY` empty | Quote submit silently swallows email errors (`.catch`) |
| Checkout (shop cart) | Cart exists, no checkout page/flow | Create `/checkout` route and payment step |
| Product variants | DB model exists, not used in shop | Implement variant selection on product detail page |
| Blog | DB model exists, no routes | Create `/blog` |
| Marketing pages | About, Services, Materials, FAQ linked in footer but 404 | Create or redirect |

### Dev-Only Limitations

| Limitation | When Fixed By |
|-----------|--------------|
| Files stored in `public/uploads/` (not S3) | Configuring `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in `.env` |
| No DB = shop shows "coming soon" | Running Postgres + `npm run db:push` + `npm run db:seed` |
| Payments non-functional | Configuring `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` |
| Emails silently fail | Configuring `RESEND_API_KEY` |

---

## Database Schema (key models)

```
User ─────────────┐
                  │ 1:N
QuoteRequest ─────┤
  ├─ status: SUBMITTED|UNDER_REVIEW|QUOTED|PAYMENT_PENDING|
  │          IN_PRODUCTION|QUALITY_CHECK|SHIPPED|DELIVERED|
  │          COMPLETED|CANCELLED|REJECTED
  ├─ fileKey (S3 key or "local:{path}")
  └─ statusLogs[]

Order ────────────┤
  ├─ type: PRODUCT|QUOTE
  ├─ status: PENDING|PAYMENT_PENDING|PAID|IN_PRODUCTION|...
  ├─ payment: Payment (RAZORPAY|STRIPE)
  └─ invoice: Invoice

Product ──────────┘
  ├─ category: Category
  ├─ images: ProductImage[]
  ├─ variants: ProductVariant[]
  └─ reviews: Review[]
```

---

## Pricing Engine (`src/lib/pricing.ts`)

```
estimatedPrice = (materialWeight × pricePerGram + printTimeHours × ₹150 + finishSurcharge)
                 × quantityDiscount × deliveryMultiplier
```

- Min price floor: ₹150
- Machine rate: ₹150/hour
- 6 quantity discount tiers (1→0%, 5→5%, 10→10%, 25→15%, 50→20%, 100→25%)

---

## File Upload Flow

```
Browser → POST /api/upload (JSON: fileName, fileType, fileSize)
        ↓
   AWS creds set?
   YES → return { uploadUrl (S3 presigned), key }
         → Browser PUT {file} to uploadUrl directly
         → POST /api/analyze { fileKey: "uploads/...", fileName, fileSize }
         → Server fetches from S3, parses STL, returns analysis

   NO  → return { useLocal: true }
         → Browser POST /api/upload/local (FormData)
         → Server saves to public/uploads/{timestamp}/{name}
         → POST /api/analyze { fileKey: "local:timestamp/name", fileName, fileSize }
         → Server reads from filesystem, parses STL, returns analysis
```

---

## Admin Workflow

1. Customer submits quote → status `SUBMITTED`
2. Admin opens `/admin/quotes/[id]` → reviews file (download link), sets final price → status `QUOTED`
3. Admin clicks "Create Payment Link" → Razorpay payment link generated → customer gets link
4. Customer pays → Razorpay webhook fires → status `PAYMENT_PENDING` → `IN_PRODUCTION`
5. Admin updates status through: `IN_PRODUCTION` → `QUALITY_CHECK` → `SHIPPED` (add tracking no.) → `DELIVERED` → `COMPLETED`

---

## Next Actions (Priority Order)

1. **Set up Postgres** — `docker run` command above, then `npm run db:push && npm run db:seed`
2. **Create `/shop/[slug]`** — product detail page with image gallery, variant picker, add-to-cart
3. **Create `/checkout`** — cart checkout flow: address → payment (Razorpay order from cart items)
4. **Customer `/profile`** — name, phone, GST number, password change
5. **Customer `/invoices`** — list invoices with PDF download
6. **Wire PDF generation** — `@react-pdf/renderer` in Razorpay webhook after payment captured
7. **Admin charts** — add Recharts to `/admin` overview (revenue over time, quotes by status)
8. **Marketing pages** — `/about`, `/services`, `/faq`, `/blog` (DB model ready)
9. **Configure credentials** — AWS S3, Razorpay, Resend, Google OAuth for production
10. **Remove Stripe or wire it** — currently dead code

---

## Known TypeScript Errors (Pre-existing, Not Introduced Here)

`npx tsc --noEmit` shows ~20 errors, mostly:
- `next-auth` session type mismatches
- Radix UI component prop types
- Unused variable warnings

None block compilation/runtime. Fix before production.

---

## Key Files Quick Reference

| What | Where |
|------|-------|
| Pricing logic | `src/lib/pricing.ts` |
| STL parser | `src/lib/stl-analyzer.ts` |
| Materials/constants | `src/constants/materials.ts` |
| Auth config | `src/lib/auth.ts` |
| Email templates | `src/lib/email.ts` |
| Quote submit action | `src/actions/quote.actions.ts:submitQuote` |
| Payment action | `src/actions/payment.actions.ts` |
| Razorpay webhook | `src/app/api/payments/razorpay/webhook/route.ts` |
| Cart store | `src/store/cartStore.ts` |
| Quote store | `src/store/quoteStore.ts` |
| DB seed | `prisma/seed.ts` |
