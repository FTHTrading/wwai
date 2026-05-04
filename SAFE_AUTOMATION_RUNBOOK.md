# Safe Automation Runbook — TROPTIONS Cloudflare Deploy

## What this does

`RUN-VERIFY.bat` is the **one-click safe launcher**. It:
1. Installs PowerShell 7 (`pwsh`) if not present
2. Checks all required tools (node, npm, git, wrangler)
3. Trims any duplicate code from `automate.cjs`
4. Runs a syntax check on `automate.cjs`
5. Runs `automate.cjs` in **dry-run mode only** — nothing is deployed
6. Tests that `APP_ENV=production` is blocked
7. Scans git for tracked secrets

**Nothing is deployed. No DNS is written. No secrets are exposed.**

---

## Project Boundaries

| Project | Path | Role |
|---|---|---|
| **Prototype** | `C:\Users\Kevan\fifa troptions` | This script's deploy target |
| **Verified monorepo** | `C:\Users\Kevan\troptions-event-os` | NOT touched — separate |

These are two completely separate projects. Never run automation from one inside the other.

---

## Why dry-run first

`automate.cjs` can deploy to Cloudflare Pages, create DNS records (irreversible without manual cleanup), attach custom domains, and push env vars. Running without guardrails could create a broken deployment or push to production prematurely.

The correct order:
```
1. RUN-VERIFY.bat         → install + dry-run (safe always)
2. Staging deploy         → requires explicit flags (see below)
3. Domain attach          → separate step after deploy succeeds
4. DNS write              → last, after domain is confirmed
```

---

## Dry-run command (safe anytime)

```cmd
node automate.cjs
```

Defaults to `DRY_RUN=true` — prints only, nothing deployed.

---

## Approved staging deploy — step by step

### Step 1: Pages deploy only
```cmd
set DRY_RUN=false
set CONFIRM_DEPLOY=true
set APP_ENV=staging
set ALLOW_CF_DEPLOY=true
node automate.cjs
```
Verifies at: `https://troptions-fifa.pages.dev`

### Step 2: Domain attach (after step 1 succeeds)
```cmd
set ALLOW_DOMAIN_ATTACH=true
node automate.cjs
```

### Step 3: DNS write (after domain attach confirmed)
```cmd
set ALLOW_DNS_WRITE=true
node automate.cjs
```

---

## Per-action flags (all default false)

| Action | Flag |
|---|---|
| Patch API routes to edge | `ALLOW_SOURCE_PATCH=true` |
| Create Pages project | `ALLOW_CF_PROJECT_CREATE=true` |
| Deploy to Pages | `ALLOW_CF_DEPLOY=true` |
| Write DNS CNAME | `ALLOW_DNS_WRITE=true` |
| Attach custom domain | `ALLOW_DOMAIN_ATTACH=true` |
| Push env vars | `ALLOW_ENV_PUSH=true` |

Never set all flags at once — each is a separate checkpoint.

---

## Production is permanently blocked

`APP_ENV=production` exits immediately with FATAL. Only `APP_ENV=staging` is allowed.
Production promotion is manual via Cloudflare dashboard after staging is verified.

---

## Token safety

- Tokens in `.env.cf` only (gitignored via `.env*` rule)
- Script never prints token values — shows `[REDACTED]`
- `.env.cf` is created on first live run

---

## Rollback

Bad staging deploy → CF Dashboard → Pages → `troptions-fifa` → Deployments → Rollback

Bad DNS → CF Dashboard → `unykorn.org` → DNS → delete `troptionsfifa` CNAME
