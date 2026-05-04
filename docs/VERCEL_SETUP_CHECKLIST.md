# Vercel Setup Checklist

Run this once when setting up the Vercel project for the first time.

## 1. Import the repository

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Authorize GitHub and select **FTHTrading/wwai**

## 2. Configure the project

| Setting | Value |
|---|---|
| Framework preset | Next.js (auto-detected) |
| Root directory | `.` (default) |
| Build command | `npm run build` (default) |
| Output directory | `.next` (default) |
| Install command | `npm ci` |

## 3. Set environment variables

Add these under **Environment Variables → Production** before the first deploy.

| Name | Value | Scope | Notes |
|---|---|---|---|
| `DEMO_ACCESS_CODE` | your private demo code | Production | Server-only. **Never** use `NEXT_PUBLIC_DEMO_ACCESS_CODE` — it leaks into the browser bundle |
| `NEXT_PUBLIC_MAP_PROVIDER` | `maplibre` | All environments | Free OSM tiles, no API key required |

Optional for future phases:

| Name | When | Notes |
|---|---|---|
| `DATABASE_URL` | Phase 1 migration | Postgres/Neon/Supabase/Turso |
| `NEXTAUTH_SECRET` | Phase 2 auth | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Phase 2 auth | Your production domain |
| `SQUARE_ACCESS_TOKEN` | Phase 4 payments | Square developer dashboard |
| `STRIPE_SECRET_KEY` | Phase 4 payments | Stripe dashboard |
| `ZOHO_CRM_TOKEN` / `HUBSPOT_TOKEN` | Phase 3 CRM | Provider dashboards |

## 4. Deploy

Click **Deploy**.

The first deploy takes ~60–90 seconds. You will get a URL like:

```
https://wwai-<hash>.vercel.app
```

## 5. Verify

- [ ] Open `https://<your-url>.vercel.app/` — homepage loads
- [ ] Open `/client-demo` — 11-step walkthrough visible
- [ ] Open `/wwai` — WWAI concierge loads
- [ ] Open `/admin` — should redirect to `/demo-access`
- [ ] Open `/billing` — should redirect to `/demo-access`
- [ ] Open `/analytics` — should redirect to `/demo-access`
- [ ] Open `/settings/integrations` — should redirect to `/demo-access`
- [ ] Open `/launch` — should redirect to `/demo-access`
- [ ] On `/demo-access`, enter wrong code — "Incorrect code" error shown
- [ ] On `/demo-access`, enter correct `DEMO_ACCESS_CODE` — redirects back to requested page

## 6. Run smoke test

```powershell
.\scripts\smoke.ps1 -BaseUrl "https://your-url.vercel.app"
```

All public routes should show `[PASS]`.
All protected routes should show `[PASS] ... GATED`.

## 7. Link local workstation (for `npm run deploy`)

```powershell
npm i -g vercel
vercel login
vercel link --yes
```

This creates `.vercel/project.json` locally (gitignored). After this, `npm run deploy` and `npm run deploy:preview` work from the command line.

## 8. Set up GitHub Actions auto-deploy

Go to: https://github.com/FTHTrading/wwai/settings/secrets/actions

Add three **Repository secrets**:

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens → create a "wwai-ci" token |
| `VERCEL_ORG_ID` | Run `Get-Content .vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | Same file |

Once all three are set, every push to `main` triggers a production deploy automatically.
A manual preview deploy can be triggered from the **Actions** tab → `deploy-vercel` → **Run workflow**.

## 9. Rotate the demo code

After every external presentation:

1. Vercel dashboard → Project → Settings → Environment Variables
2. Update `DEMO_ACCESS_CODE` to a new value
3. **Redeploy** (or push any commit to `main`) to pick up the new value

Old cookies will stop working automatically on next request.
