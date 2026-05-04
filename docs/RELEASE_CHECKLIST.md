# Release Checklist

Run before every external share. Takes < 5 minutes.

## Before release

### Automated checks

```powershell
npm run deploy:check
```

This runs preflight → lint → typecheck → build in one command. All must pass.

Also check:

- [ ] `git status` — working tree clean, everything committed
- [ ] On branch `main`
- [ ] Latest commit pushed to `FTHTrading/wwai`

### Manual page spot-check

Open these pages in a fresh private/incognito window (no cookies):

- [ ] `/` — homepage loads, no 500
- [ ] `/client-demo` — 11-step walkthrough, all links navigate
- [ ] `/wwai` — WWAI concierge loads
- [ ] `/map` — map tiles load (MapLibre + OSM)
- [ ] `/safety-routes` — route planner visible
- [ ] `/proposals` — package selector, totals update, print preview works

### Protected route gate check

Without a `wwai_demo_access` cookie, each of these should redirect to `/demo-access`:

- [ ] `/admin`
- [ ] `/billing`
- [ ] `/analytics`
- [ ] `/settings/integrations`
- [ ] `/launch`

### Content safety

- [ ] No `guaranteed safe`, `official route`, or `police-approved` in visible copy
- [ ] No real customer names, emails, or phone numbers in demo data
- [ ] All metrics labeled "Demo Data" or "Demo Projection"
- [ ] No protected brand logos not approved in writing

## Deploy

```powershell
npm run deploy        # production
# or
npm run deploy:preview  # ephemeral preview URL for internal review first
```

## After release

### Smoke test

```powershell
.\scripts\smoke.ps1 -BaseUrl "https://your-vercel-url.vercel.app"
```

All public routes: `[PASS]`
All protected routes: `[PASS] ... GATED`

### Confirm deployment

- [ ] GitHub Actions → `ci` workflow → green
- [ ] GitHub Actions → `deploy-vercel` workflow → green (if secrets are set)
- [ ] Vercel dashboard → deployment → "Ready"
- [ ] `/client-demo` loads on the deployed URL

## Sharing the link

- [ ] Share `/client-demo` — not `/admin`, `/billing`, or `/analytics`
- [ ] Demo code shared only through a password manager or signed message
- [ ] Demo URL not posted to public Slack, Twitter, or email threads

## After the presentation

- [ ] Rotate `DEMO_ACCESS_CODE` in Vercel project settings
- [ ] Trigger a redeploy (push any commit or click Redeploy in Vercel dashboard)
- [ ] Document who received the demo and when

## Important reminder

This is a **controlled demo**, not a production system.

- Do not enter real customer data
- Do not enter real payment information
- Do not enter real personal or safety-critical information
- Replace the demo gate with real SSO before any live customer data flows through these surfaces
