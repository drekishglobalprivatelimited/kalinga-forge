# Kalinga Forge — Project Status & Developer Handoff

## What Is This

**Kalinga Forge** is a full-stack 3D printing e-commerce platform built with Next.js 16 (App Router, Turbopack), React 19, Prisma 7 + PostgreSQL, NextAuth v5, Razorpay, AWS S3, and Resend.

Two business models:
1. **Custom quote flow** — customer uploads STL/STEP/OBJ/3MF → instant price estimate → admin reviews → sends payment link → production
2. **Shop** — pre-made 3D printed products with cart + checkout

---

## Environment Setup (Required Before Running)

Copy `.env` (already exists) and fill in:

```bash
# Database — local Postgres required
DATABASE_URL="postgresql://postgres:password@localhost:5432/kalinga_forge?schema=public"

# NextAuth — generate with: openssl rand -base64 32
AUTH_SECRET="..."

# AWS S3 (optional for dev — local fallback exists without these)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="kalinga-forge-uploads"

# Razorpay (required for payment flow)
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="..."

# Resend (required for email notifications)
RESEND_API_KEY="..."
EMAIL_FROM="noreply@kalingaforge.in"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
ADMIN_EMAIL="admin@kalingaforge.in"
```

### Start PostgreSQL locally

```bash
# Docker (recommended)
docker run --name kalinga-forge-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=kalinga_forge -p 5432:5432 -d postgres:16

# Then push schema and seed
npm run db:push
npm run db:seed
```

Default admin after seed: `admin@kalingaforge.in` / `Admin@123`

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
│   ├── (shop)/           # /shop (filters + sort), /shop/[slug] (product detail)
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
│   ├── home/             # OLD dark landing sections — no longer used by /, safe to delete
│   ├── storefront/       # HeroCarousel, ProductRail, SectionHeading, fields.ts (light form styles)
│   ├── layout/           # Header, Footer, Providers
│   ├── quote/            # FileUploadZone, ConfiguratorPanel, PriceBreakdown, QuoteSteps
│   ├── shop/             # ProductCard, AddToCartWrapper, CartDrawer, SortSelect
│   ├── lead/             # WhatsAppFloat, ExitIntentPopup
│   ├── shared/           # ScrollReveal, GlassCard, AnimatedCounter, StructuredData
│   └── ui/               # Radix/Shadcn primitives
├── lib/
│   ├── auth.ts           # NextAuth v5 config (Prisma adapter, providers)
│   ├── auth.config.ts    # Edge-safe auth config shared with middleware — no Node-only imports
│   ├── catalog.ts        # Storefront queries (products, product, categories); return empty on DB error
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
│   ├── materials.ts      # Materials, layer heights, infill, finish, delivery options
│   └── categories.ts     # Storefront categories + header menu (mirrors poka-products.json)
└── types/
    └── next-auth.d.ts    # Session type augmentation
```

---

## Feature Status

### Working

| Feature | Notes |
|---------|-------|
| Homepage | Light retail storefront: hero carousel, category tiles, product rails, banners, FAQ JSON-LD |
| Auth — register/login | Credentials provider. Google OAuth config exists, needs `AUTH_GOOGLE_ID` |
| Quote flow — file upload | **S3 when configured; local filesystem fallback when AWS keys empty** |
| Quote flow — STL analysis | Binary + ASCII STL full parse; STEP/OBJ/3MF size-based estimate |
| Quote flow — configurator | 9 materials, 4 layer heights, 5 infill levels, 4 finishes, 3 delivery speeds |
| Quote flow — pricing | Material weight + machine time + finish surcharge + quantity discount |
| Quote flow — submission | Guest or logged-in; stores to DB; emails customer + admin |
| Admin dashboard | Overview stats, quote list (11 statuses), quote detail, order list, customer list, product list |
| Admin — quote actions | Set final price, update status (audit log), create Razorpay payment link |
| Payment — Razorpay | Create order, payment link, webhook handler, signature verification |
| Shop page | Category chips, sort (featured/new/price), search via `?q=`; empty state if DB offline |
| Product page `/shop/[slug]` | Gallery, price, add to bag, description/material/shipping, related products, Product JSON-LD |
| Cart | Zustand persisted cart, add/remove/qty, cart drawer mounted in Header (every storefront page) |
| Contact form | Topic chips + form; saves to DB, sends admin email |
| Email notifications | Quote submitted, admin alert, status update, order update |
| Middleware | Route protection by auth status + role |

### Broken / Missing

| Issue | Root Cause | Fix Needed |
|-------|-----------|------------|
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
| Product variants | DB model exists, not used in shop | Add variant picker to `/shop/[slug]` |
| Customer & admin pages | Still old dark theme | Restyle to match storefront (`components/storefront/fields.ts`) |
| Old demo categories | Earlier seed left "Home Decor", "Engineering Parts", "Gifts & Collectibles", "Functional Parts" + 8 imageless products | Delete from DB or deactivate |
| Product photos | Some are slicer screenshots/WIP shots; some carry third-party watermarks (e.g. jtronics.de) | Replace before launch; confirm image/brand rights |
| Catalogue export script | `Catalogue/Poka Prints/export_to_website.py` still writes "Poka Print Studio" into descriptions | Update script text to Kalinga Forge |
| Blog | DB model exists, no routes | Create `/blog` |
| Marketing pages | About, Services, Materials, FAQ linked in footer but 404 | Create or redirect |

### Dev-Only Limitations

| Limitation | When Fixed By |
|-----------|--------------|
| Files stored in `public/uploads/` (not S3) | Configuring `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in `.env` |
| No DB = storefront sections render empty | Running Postgres + `npm run db:push` + `npm run db:seed` |
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
2. **Variant picker on `/shop/[slug]`** — colours from catalogue (`colors` field is dropped by seed today)
3. **Create `/checkout`** — cart checkout flow: address → payment (Razorpay order from cart items)
4. **Customer `/profile`** — name, phone, GST number, password change
5. **Customer `/invoices`** — list invoices with PDF download
6. **Wire PDF generation** — `@react-pdf/renderer` in Razorpay webhook after payment captured
7. **Admin charts** — add Recharts to `/admin` overview (revenue over time, quotes by status)
8. **Marketing pages** — `/about`, `/services`, `/faq`, `/blog` (DB model ready)
11. **Restyle customer + admin areas** to the light storefront look
9. **Configure credentials** — AWS S3, Razorpay, Resend, Google OAuth for production
10. **Remove Stripe or wire it** — currently dead code

---

## TypeScript

`npx tsc --noEmit` passes with 0 errors (as of 2026-10-08).

---

## Key Files Quick Reference

| What | Where |
|------|-------|
| Pricing logic | `src/lib/pricing.ts` |
| STL parser | `src/lib/stl-analyzer.ts` |
| Materials/constants | `src/constants/materials.ts` |
| Auth config | `src/lib/auth.ts` (+ edge-safe `src/lib/auth.config.ts`) |
| Storefront queries | `src/lib/catalog.ts` |
| Light form styles | `src/components/storefront/fields.ts` |
| Header menu / categories | `src/constants/categories.ts` |
| Email templates | `src/lib/email.ts` |
| Quote submit action | `src/actions/quote.actions.ts:submitQuote` |
| Payment action | `src/actions/payment.actions.ts` |
| Razorpay webhook | `src/app/api/payments/razorpay/webhook/route.ts` |
| Cart store | `src/store/cartStore.ts` |
| Quote store | `src/store/quoteStore.ts` |
| DB seed | `prisma/seed.ts` |

---

## Change Log

### 2026-10-08 — Rebrand, Netlify fixes, storefront redesign

**Rebrand: Poka Print Studio → Kalinga Forge** (committed `62c658d`)
- Package renamed `kalinga_forge`; brand name, logo text, metadata, JSON-LD, emails and WhatsApp copy updated.
- Domain/emails now `kalingaforge.in`; cart storage key `kalinga-forge-cart`; S3/DB defaults renamed.
- `.env` business name and emails updated locally; `DATABASE_URL` and `AWS_S3_BUCKET` deliberately left pointing at existing resources.
- Catalogue descriptions in `prisma/data/poka-products.json` (and local DB) changed from "Poka Print Studio" to "Kalinga Forge".

**Netlify deploy fixes** (committed `08223ad`, `3596880`)
- Razorpay and Resend clients created lazily (`getRazorpay()`, `getResend()`) so builds don't crash without API keys.
- `postinstall: prisma generate` added; `netlify.toml` pins Node 22.
- Auth split into edge-safe `src/lib/auth.config.ts` used by `middleware.ts`, so the Netlify Edge Function no longer bundles Prisma/bcrypt.
- Netlify still needs: hosted Postgres `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, and the remaining keys from `.env`.

**Storefront redesign — DailyObjects-style light theme** (committed `00d97c6`)
- Global theme switched to light; tokens `ink`, `canvas`, `line`, `muted-ink`, `forge` added in `globals.css`.
- New Header (announcement bar, category menus, search, account, bag) and light Footer.
- New homepage, `/shop` (category chips + sort), new `/shop/[slug]` product page, `ProductCard`, light cart drawer.
- `src/lib/catalog.ts` centralises storefront queries; homepage is `force-dynamic`.

**Contact, quote and auth redesign** (uncommitted)
- `/contact`: page header, contact details list, topic chips (prefixed onto the message), light form, success state.
- `/quote`: light page header, `QuoteSteps` indicator, restyled `FileUploadZone`, trust grid and tips sidebar.
- `/quote/estimate`: light layout; `ConfiguratorPanel` and `PriceBreakdown` restyled (square option tiles, ink selection state).
- `/quote/submitted`: light confirmation; "Track quote" now links to `/quotes` (was the non-existent `/dashboard/quotes`).
- `/login`, `/register`: split layout (product image panel + form), square ink buttons.
- `(marketing)` and `(quote)` layouts no longer wrap pages in the dark background.
- Shared `components/ui` primitives are unchanged (still dark for admin/customer); storefront pages pass light overrides from `components/storefront/fields.ts`.

