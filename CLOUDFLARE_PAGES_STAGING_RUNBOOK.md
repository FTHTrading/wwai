# Cloudflare Pages Staging Runbook — TROPTIONS

## What automate.cjs does

`automate.cjs` is a safety-gated deployment automation script. By default it runs in **dry-run mode** — it audits, validates, and reports what would happen without making any changes.

## Project Boundaries

| Project | Path | Role |
|---|---|---|
| **Prototype** | `C:\Users\Kevan\fifa troptions` | This script's deploy target |
| **Verified monorepo** | `C:\Users\Kevan\troptions-event-os` | NOT touched by this script |

## Required Environment Variables

| Variable | Required for | Default |
|---|---|---|
| `DRY_RUN` | All modes | `true` (dry-run is ON by default) |
| `CONFIRM_DEPLOY` | Live deploy | `false` |
| `APP_ENV` | Live deploy | `""` (must be set to `staging`) |
| `ALLOW_SOURCE_PATCH` | Edge/Prisma patching | `false` |
| `ALLOW_CF_PROJECT_CREATE` | Create Pages project | `false` |
| `ALLOW_CF_DEPLOY` | Run wrangler deploy | `false` |
| `ALLOW_DNS_WRITE` | Create CNAME record | `false` |
| `ALLOW_DOMAIN_ATTACH` | Attach custom domain | `false` |
| `ALLOW_ENV_PUSH` | Push env vars to CF | `false` |

Tokens are read from `.env.cf` (gitignored via `.env*`):
- `CF_WORKERS_TOKEN` — Cloudflare Workers / Pages deploy token
- `CF_DNS_TOKEN` — DNS zone edit token
- `CF_DATABASE_URL` — Optional Turso/LibSQL URL for production DB
- `CF_DATABASE_AUTH_TOKEN` — Optional Turso auth token

**Never commit `.env.cf`. Never print token values in logs.**

## Staging-Only Rule

- `APP_ENV=production` is **blocked by the script** — it will refuse to run
- Always use `APP_ENV=staging` for any live deployment
- Production promotion happens manually via Cloudflare dashboard after staging is verified

## Dry-Run Command (safe to run anytime)

```cmd
cd "C:\Users\Kevan\fifa troptions"
node automate.cjs
```

Or explicitly:

```cmd
set DRY_RUN=true
node automate.cjs
```

This will:
- Print what each step would do
- Audit logo sources
- Audit API route compatibility
- Audit Prisma/database client
- Validate required tools
- NOT call any Cloudflare APIs
- NOT create DNS records
- NOT deploy anything

## Approved Staging Deploy Command

Run each flag individually so you consciously enable each dangerous action:

```cmd
cd "C:\Users\Kevan\fifa troptions"
set DRY_RUN=false
set CONFIRM_DEPLOY=true
set APP_ENV=staging
set ALLOW_SOURCE_PATCH=true
set ALLOW_CF_PROJECT_CREATE=true
set ALLOW_CF_DEPLOY=true
set ALLOW_DNS_WRITE=true
set ALLOW_DOMAIN_ATTACH=true
set ALLOW_ENV_PUSH=true
node automate.cjs
```

## Disabled Live Rails

These are **permanently blocked** until explicitly enabled:
- `APP_ENV=production` — BLOCKED always
- Live card capture — requires `ENABLE_LIVE_CARD_CAPTURE=true` in app code separately
- Telnyx live SMS/calls — mock by default in all API routes
- Blockchain payouts — not wired in prototype

## DNS / Domain Caution

- DNS CNAME records take 1–5 minutes to propagate after creation
- Creating a CNAME that already exists will skip (not overwrite) — safe to retry
- Custom domain attachment may take up to 24 hours to fully provision SSL

## Rollback Instructions

If a bad deployment goes live:

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com) → Pages → `troptions-fifa`
2. Click Deployments → find last known good deployment
3. Click "Rollback to this deployment"

To remove a bad DNS record:
1. Go to Cloudflare Dashboard → DNS → `unykorn.org`
2. Find the `troptionsfifa` CNAME
3. Delete or update it

## Token Safety Notes

- Tokens are stored in `.env.cf` only
- `.env*` is gitignored — `.env.cf` will never be committed
- The script never logs token values — it only shows `[REDACTED]`
- Never hard-code tokens in `automate.cjs` source — this is audited in Step 1

## Route Compatibility

Before any CF edge deployment, these routes require **manual review** (cannot be blindly patched):
- `api/sales/sms` — Telnyx SDK (Node.js only)
- `api/sales/call` — Telnyx SDK (Node.js only)
- `api/sales/payment` — Square SDK (Node.js only)
- `api/stats` — Prisma (requires CF-compatible adapter)
- `api/cards`, `api/listings`, `api/options` — Prisma dependent

Routes safe for edge patching are listed in the dry-run output.

## Prisma / Database

For CF Workers edge deployment, use `src/lib/prisma.cf.ts` (created by script with `ALLOW_SOURCE_PATCH=true`).

`src/lib/prisma.ts` is kept intact for local development.

API routes using Prisma must be manually updated to import from `./prisma.cf.ts` before they will work on CF Workers.
