# CVCraft — AI-Powered CV Generator SaaS

A production-ready SaaS built with **Next.js 15**, **Tailwind CSS**, **Prisma**, **Supabase**, **OpenAI GPT-4o**, and **Stripe**.

---

## Features

- **Authentication** — Supabase Auth (email/password + Google + GitHub OAuth)
- **Dashboard** — Create, edit, delete, and manage CVs
- **AI CV Generation** — GPT-4o generates professional CV content from structured input
- **2 Templates** — Basic (ATS-optimized) and Modern (two-column)
- **ATS Optimization** — Score your CV (0–100) with improvement suggestions
- **Job Description Matching** — Match score + keywords to tailor your CV (Pro)
- **Cover Letter Generator** — AI-generated tailored cover letters (Pro)
- **PDF Export** — Download your CV as a PDF (watermarked on free plan)
- **Subscription System** — Free plan (1 CV) + Pro plan ($12/mo via Stripe)
- **Onboarding flow** — Two-step welcome screen after sign-up
- **Pricing page** — With FAQ and feature comparison
- **SEO-optimized** landing page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Auth | Supabase Auth |
| AI | OpenAI GPT-4o |
| Payments | Stripe |
| UI Components | Radix UI + custom components |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |

---

## Project Structure

```
cvcraft/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Sign up page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard shell (sidebar)
│   │   ├── dashboard/page.tsx      # Dashboard home
│   │   └── cv/
│   │       ├── new/page.tsx        # New CV editor
│   │       └── [id]/edit/          # Edit existing CV
│   ├── api/
│   │   ├── cv/route.ts             # List + create CVs
│   │   ├── cv/[id]/route.ts        # Get, update, delete CV
│   │   ├── ai/generate/route.ts    # AI CV generation
│   │   ├── ai/optimize/route.ts    # ATS optimization
│   │   ├── ai/match/route.ts       # Job description matching (Pro)
│   │   ├── ai/cover-letter/route.ts# Cover letter generator (Pro)
│   │   ├── stripe/checkout/route.ts# Stripe checkout
│   │   ├── stripe/portal/route.ts  # Stripe billing portal
│   │   ├── stripe/webhook/route.ts # Stripe webhook handler
│   │   ├── pdf/route.ts            # PDF generation
│   │   └── user/profile/route.ts   # Profile update
│   ├── auth/callback/route.ts      # OAuth callback handler
│   ├── onboarding/page.tsx         # Onboarding flow
│   ├── pricing/page.tsx            # Pricing page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── ui/                         # Button, Card, Input, Badge, Modal, Select, Tabs
│   ├── cv/
│   │   ├── CVForm.tsx              # Full CV creation form
│   │   ├── CVPreview.tsx           # Live template preview
│   │   └── templates/
│   │       ├── BasicTemplate.tsx   # ATS-friendly layout
│   │       └── ModernTemplate.tsx  # Two-column indigo layout
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── CVCard.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTA.tsx
│   └── pricing/PricingCard.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCV.ts
│   └── useSubscription.ts
├── lib/
│   ├── supabase/client.ts          # Browser Supabase client
│   ├── supabase/server.ts          # Server Supabase client
│   ├── prisma.ts                   # Prisma singleton
│   ├── openai.ts                   # OpenAI helpers
│   ├── stripe.ts                   # Stripe client + helpers
│   └── utils.ts                    # Shared utilities
├── types/index.ts                  # TypeScript types
├── middleware.ts                   # Route protection
├── prisma/schema.prisma            # Database schema
└── .env.example                    # Environment variables template
```

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd cvcraft
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` (see `.env.example` for details).

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **Anon Key** to `.env.local`
3. Copy the **Service Role Key** to `.env.local`
4. Copy the **Database URL** (from Project Settings → Database → Connection String → **Transaction** mode) to `DATABASE_URL`
5. Copy the **Direct URL** (Session mode) to `DIRECT_URL`
6. In Supabase Auth settings, enable **Google** and **GitHub** providers and add your OAuth credentials

### 4. Set up the database

```bash
npm run db:push      # Push schema to Supabase (first time)
# or for migrations:
npm run db:migrate   # Create and apply a migration
npm run db:generate  # Regenerate Prisma client
```

### 5. Set up Stripe

1. Create a product + monthly price in [Stripe Dashboard](https://dashboard.stripe.com)
2. Copy the Price ID to `STRIPE_PRO_PRICE_ID` in `.env.local`
3. Copy your API keys to `.env.local`
4. Set up webhook (see below)

#### Stripe webhook (local dev)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CVCraft SaaS"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables from `.env.example` in the Vercel project settings
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain (e.g. `https://cvcraft.vercel.app`)

### 3. Stripe webhook (production)

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.vercel.app/api/stripe/webhook`
3. Events to listen: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 4. Supabase Auth callback URL

In Supabase → Auth → URL Configuration:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: `https://your-domain.vercel.app/auth/callback`

---

## Subscription Plans

| Feature | Free | Pro ($12/mo) |
|---|---|---|
| CVs | 1 | Unlimited |
| Templates | 2 | All |
| AI generation | ✓ | ✓ |
| ATS check | Basic | Full |
| PDF export | Watermarked | Clean |
| Job matching | ✗ | ✓ |
| Cover letter | ✗ | ✓ |
| Free trial | — | 7 days |

---

## Environment Variables Reference

See [.env.example](.env.example) for all required variables.

---

## License

MIT
