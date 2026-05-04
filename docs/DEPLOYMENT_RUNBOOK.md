# Deployment Runbook

## Pre-Deployment Checklist

Before deploying to any environment, complete these steps in order.

### 1. Environment Variables

Copy `.env.example` to `.env.local` (dev) or set in your hosting provider's dashboard (production).

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | `file:./prisma/dev.db` for local; Turso `libsql://...` for production |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Yes | Full URL: `https://yourdomain.com` |
| `SQUARE_ACCESS_TOKEN` | Optional | Enable Square payments |
| `STRIPE_SECRET_KEY` | Optional | Enable Stripe payments |
| `STRIPE_PUBLISHABLE_KEY` | Optional | Required alongside STRIPE_SECRET_KEY for client elements |
| `STRIPE_WEBHOOK_SECRET` | Optional | For Stripe webhook verification |
| `ZOHO_CLIENT_ID` | Optional | Enable Zoho CRM push |
| `ZOHO_CLIENT_SECRET` | Optional | Required with ZOHO_CLIENT_ID |
| `ZOHO_REFRESH_TOKEN` | Optional | Required with Zoho client credentials |
| `HUBSPOT_ACCESS_TOKEN` | Optional | Enable HubSpot CRM push |
| `AIRTABLE_API_KEY` | Optional | Enable Airtable CRM push |
| `AIRTABLE_BASE_ID` | Optional | Required with AIRTABLE_API_KEY |
| `SENDGRID_API_KEY` | Optional | Enable automated email delivery |

### 2. Database

```bash
# Apply migrations (production)
npx prisma migrate deploy

# Generate Prisma client (always run after fresh install or schema change)
npx prisma generate

# Seed initial data (first-time only)
npx prisma db seed
```

### 3. Verify Build

```bash
npm run lint    # Must be 0/0
npm run build   # Must be clean, expect 58+ routes
```

### 4. Verify System Readiness

After starting the server, check `/settings/integrations` to confirm all required providers are showing ✓ Configured. The `/launch` checklist shows real env status for all known keys.

---

## Cloudflare Pages Deployment

See `CLOUDFLARE_PAGES_STAGING_RUNBOOK.md` for full Cloudflare-specific steps.

Quick deploy:
```bash
npm run deploy
# or
wrangler pages deploy .next/static --project-name=troptions
```

## Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set all required env vars in Vercel dashboard (Project → Settings → Environment Variables)
3. Set `DATABASE_URL` to a Turso remote connection string (not file://)
4. Push to `main` — Vercel auto-deploys

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000

---

## Post-Deploy Verification

| Check | URL | Expected |
|-------|-----|---------|
| Homepage loads | / | TROPTIONS hero page |
| API health | /api/stats | JSON stats |
| System status | /api/system-status | JSON readiness |
| Lead export | /api/leads/export | CSV download |
| Integrations page | /settings/integrations | Provider status UI |
| Map loads | /map | MapLibre map renders |

---

## Rollback

If a deployment fails:

```bash
# Revert to previous commit
git revert HEAD
git push

# Or revert specific file
git checkout HEAD~1 -- src/app/api/some/route.ts
```

For database rollbacks:
```bash
# Check migration status
npx prisma migrate status

# Reset to baseline (DESTROYS DATA in dev only)
npx prisma migrate reset
```
