# WWAI / TROPTIONS Sales Operating System

**WWAI** (Worldwide AI) is an AI-powered guest concierge for live events.
**TROPTIONS** is a loyalty and payments network for event operators.

Together they form a single platform: sponsor activation, guest wayfinding, digital payments, operator dashboards, and sales proposals — all demo-ready and controlled.

---

## Local setup

```powershell
npm install
```

Copy `.env.example` to `.env.local` and set:

```env
DEMO_ACCESS_CODE=troptions-demo        # dev only — change before sharing externally
NEXT_PUBLIC_MAP_PROVIDER=maplibre      # free OSM tiles, no API key required
```

> Never commit `.env.local`. Never use `NEXT_PUBLIC_DEMO_ACCESS_CODE` — it leaks to the browser.

---

## Run dev server

```powershell
npm run dev
```

Open [http://localhost:3000/client-demo](http://localhost:3000/client-demo) — the safe demo entry point.

---

## Pre-deploy check

```powershell
npm run deploy:check
```

Runs preflight → lint → typecheck → build. All must pass before deploying.

---

## Deploy

### Local one-command deploy (Vercel)

First-time only:

```powershell
npm install --global vercel
vercel login
vercel link --yes
vercel env add DEMO_ACCESS_CODE production
vercel env add NEXT_PUBLIC_MAP_PROVIDER production    # value: maplibre
```

Every deploy after that:

```powershell
npm run deploy:preview    # ephemeral preview URL (start here)
npm run deploy            # production
```

### Push-to-deploy (GitHub Actions)

Add three secrets at https://github.com/FTHTrading/wwai/settings/secrets/actions:
`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

Every push to `main` then deploys to production automatically.

See [docs/DEPLOY_AUTOMATION.md](docs/DEPLOY_AUTOMATION.md) for full details.
See [docs/VERCEL_SETUP_CHECKLIST.md](docs/VERCEL_SETUP_CHECKLIST.md) for first-time Vercel project setup.

---

## Post-deploy smoke test

```powershell
.\scripts\smoke.ps1 -BaseUrl "https://your-vercel-url.vercel.app"
```

Checks all public routes return 200 and all protected routes are gated.

---

## Required env vars

| Name | Where | Notes |
|---|---|---|
| `DEMO_ACCESS_CODE` | Server only | Gates `/admin`, `/billing`, `/analytics`, `/settings/integrations`, `/launch` |
| `NEXT_PUBLIC_MAP_PROVIDER` | Browser-safe | `maplibre` for free OSM tiles |

---

## Demo access

- Protected routes require a `wwai_demo_access` cookie (set by `/demo-access` after submitting `DEMO_ACCESS_CODE`)
- Always share `/client-demo` first — not `/admin` or `/billing`
- Rotate `DEMO_ACCESS_CODE` in Vercel after every external presentation
- This is **demo gating, not production auth** — replace with SSO before live customer data

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before every external share.

