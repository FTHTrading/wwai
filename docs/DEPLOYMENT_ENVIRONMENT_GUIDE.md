# TROPTIONS™ Deployment Environment Guide

This guide covers all required and optional environment variables, deployment targets, and configuration steps.

---

## Quick Start

```bash
cp .env.example .env.local
# Fill in required values (see Required section below)
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

---

## Environment Variables

### Required — Core

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Database connection string | `file:./prisma/dev.db` or Turso libsql URL |
| `NEXTAUTH_SECRET` | Session signing key (32+ random bytes) | `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Full production URL | `https://troptionslive.unykorn.org` |

### Optional — Payment Providers

| Variable | Provider | Description |
|---|---|---|
| `SQUARE_ACCESS_TOKEN` | Square | Production: from Square Developer Dashboard |
| `STRIPE_SECRET_KEY` | Stripe | Production: `sk_live_...`, Testing: `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe | Production: `pk_live_...`, Testing: `pk_test_...` |

When payment provider keys are not set:
- Billing dashboard shows "Not configured" status
- "Create Payment Link" buttons are disabled
- Manual payment tracking remains fully functional

### Optional — AI

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Used by AI chat assistant (`/api/ai/chat`). Falls back gracefully if not set. |

### Optional — CRM / Email

| Variable | Description |
|---|---|
| `CRM_WEBHOOK_URL` | POST target when a new lead or proposal is created |
| `SENDGRID_API_KEY` | For automated invoice email delivery |

---

## Database Setup

### SQLite (Development / Simple Deployment)

```bash
# .env.local
DATABASE_URL="file:./prisma/dev.db"
```

Run migrations:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### Turso LibSQL (Production / Edge)

```bash
# .env.local
DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-token-here"
```

See `prisma.config.ts` — the `@prisma/adapter-libsql` adapter is pre-configured.

---

## Deployment Targets

### Cloudflare Pages (Primary)

See `CLOUDFLARE_PAGES_STAGING_RUNBOOK.md` for the full step-by-step.

```bash
# Deploy command (from wrangler.toml config)
npm run deploy
# or
wrangler pages deploy .next/static --project-name=troptions
```

Set environment variables in Cloudflare Dashboard → Pages → Settings → Environment Variables.

### Vercel

```bash
vercel --prod
```

Set environment variables in Vercel Dashboard → Settings → Environment Variables.

### Self-hosted (Node.js)

```bash
npm run build
npm run start
# or use PM2:
pm2 start "npm run start" --name troptions-web
```

---

## Production Checklist

- [ ] `NEXTAUTH_SECRET` is a unique, random 32+ byte string (not reused from dev)
- [ ] `DATABASE_URL` points to production database, not dev.db
- [ ] `npx prisma migrate deploy` has been run (not migrate dev)
- [ ] Seed data is present (`npx prisma db seed` if starting fresh)
- [ ] `npm run build` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors/warnings
- [ ] Payment provider keys configured (or billing operates in manual-only mode)
- [ ] `.env.local` is in `.gitignore` (it is by default)
- [ ] Custom domain configured in deployment platform

---

## Security Notes

- Never commit `.env.local` or `.env` files containing real secrets to source control
- Rotate `NEXTAUTH_SECRET` if it is ever exposed
- Use Stripe test keys (`sk_test_...`) in staging, live keys (`sk_live_...`) only in production
- Square sandbox tokens in staging, production access tokens only in production
- All API routes in `/api/` are server-side only — env vars are not exposed to the client

---

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init    # if running for the first time
npx prisma db seed
npm run dev                           # starts on http://localhost:3000
```
