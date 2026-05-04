# Deploy automation

## Quick reference

```powershell
npm run deploy:check          # preflight + lint + typecheck + build
npm run deploy:preview        # preview URL (safe for testing)
npm run deploy                # production
.\scripts\smoke.ps1 -BaseUrl "https://wwai-<real-hash>.vercel.app"  # use the real URL from deploy output
```

## Path 1 — `npm run deploy` (one command, your workstation)

Pre-reqs (one-time):

```powershell
npm install --global vercel
vercel login
vercel link --yes --project wwai                      # IMPORTANT: always pass --project wwai
vercel env add DEMO_ACCESS_CODE production            # paste your private code
vercel env add NEXT_PUBLIC_MAP_PROVIDER production    # value: maplibre
```

> **Why `--project wwai`?** The local folder is named `fifa troptions`. If Vercel auto-derives a project name from that path it produces an invalid slug. Always pass `--project wwai` explicitly.

Every deploy after that:

```powershell
npm run deploy:check          # preflight + lint + typecheck + build
npm run deploy:preview        # preview URL (safe starting point)
npm run deploy                # production
```

`scripts/deploy.ps1` runs preflight → lint → typecheck → build automatically. Skip with `-SkipChecks` only when you know why.

## Path 2 — GitHub Actions (auto-deploy on push to `main`)

Workflow files:

- [.github/workflows/ci.yml](.github/workflows/ci.yml) — lint + typecheck + build on every PR and push, with build summary
- [.github/workflows/deploy-vercel.yml](.github/workflows/deploy-vercel.yml) — production deploy on push to `main`; skips gracefully when secrets absent; deploy URL in step summary

### GitHub repository secrets — required for auto-deploy

Go to: **https://github.com/FTHTrading/wwai/settings/secrets/actions → New repository secret**

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens → create a "wwai-ci" token |
| `VERCEL_ORG_ID` | `Get-Content .vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | Same file |

Once all three are set, every push to `main` ships to production automatically.

### Vercel project environment variables — required

Set in **Vercel dashboard → Project → Settings → Environment Variables**:

| Name | Value | Scope | Notes |
|---|---|---|---|
| `DEMO_ACCESS_CODE` | your private demo code | Production | Server-only. **Never** use `NEXT_PUBLIC_DEMO_ACCESS_CODE` |
| `NEXT_PUBLIC_MAP_PROVIDER` | `maplibre` | All | Free OSM tiles, no API key needed |

> `NEXT_PUBLIC_*` values ship in the browser bundle and are visible in page source.
> `DEMO_ACCESS_CODE` is server-only and never exposed to clients.

### Optional env vars (future phases)

| Name | Phase |
|---|---|
| `DATABASE_URL` | Phase 1 — Postgres persistence |
| `NEXTAUTH_SECRET` + `NEXTAUTH_URL` | Phase 2 — real SSO |
| `SQUARE_ACCESS_TOKEN` / `STRIPE_SECRET_KEY` | Phase 4 — payments |
| CRM tokens (Zoho/HubSpot) | Phase 3 — CRM sync |

## Preflight script (`scripts/preflight.ps1`)

Checks Node, npm, project files, middleware, env docs, git state, npm scripts. Exits nonzero only for real local blockers. Warns for remote config that can't be verified locally.

```powershell
npm run preflight
```

## Smoke test script (`scripts/smoke.ps1`)

Checks public routes return 200 and protected routes redirect to `/demo-access`.

```powershell
.\scripts\smoke.ps1 -BaseUrl "https://wwai-<real-hash>.vercel.app"
```

> **Use the real URL.** Running smoke against `https://your-url.vercel.app` (the placeholder) will exit immediately with an error. Copy the actual URL from the Vercel deploy output.
See [VERCEL_SETUP_CHECKLIST.md](VERCEL_SETUP_CHECKLIST.md) for first-time Vercel project setup.

---

## Troubleshooting

### Vercel link fails — invalid project name

**Symptom:**
```
Project names can be up to 100 characters long and must be lowercase…
cannot contain the sequence '---'
```

**Cause:** Vercel auto-detected the local folder name (`fifa troptions`), which contains spaces or produces an invalid slug.

**Fix:**
```powershell
vercel login
vercel link --yes --project wwai
```

If deploying under a Vercel team/account:
```powershell
$env:VERCEL_SCOPE = "your-team-or-account"
vercel link --yes --project wwai --scope $env:VERCEL_SCOPE
```

Then:
```powershell
npm run deploy
```

`scripts/deploy.ps1` always passes `--project wwai` (or `$env:VERCEL_PROJECT_NAME` if set) so you should not hit this again after the first link.

### Smoke test reports 404 / unreachable for every route

**Cause:** You ran smoke against the placeholder URL `https://your-url.vercel.app`.

**Fix:** Use the real Vercel URL printed after `npm run deploy`:
```powershell
.\scripts\smoke.ps1 -BaseUrl "https://wwai-<your-hash>.vercel.app"
```

The smoke script will now exit immediately with an error if a placeholder URL is detected.
