# Deploy automation

Two paths, both fully automated.

## Path 1 — `npm run deploy` (one command, your workstation)

Pre-reqs (one-time):

```powershell
npm install --global vercel
vercel login
vercel link --yes
vercel env add DEMO_ACCESS_CODE production            # paste your private code
vercel env add NEXT_PUBLIC_MAP_PROVIDER production    # value: maplibre
```

Every deploy after that:

```powershell
npm run deploy            # production
npm run deploy:preview    # ephemeral preview URL
```

The script runs lint → typecheck → build → `vercel deploy`. Skip the local checks with `-SkipChecks` if needed:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -SkipChecks
```

## Path 2 — GitHub Actions (auto-deploy on push to `main`)

Workflow files:

- [.github/workflows/ci.yml](.github/workflows/ci.yml) — lint + typecheck + build on every PR and push
- [.github/workflows/deploy-vercel.yml](.github/workflows/deploy-vercel.yml) — production deploy on push to `main`; manual `workflow_dispatch` allows preview/production choice

Add three repository secrets at https://github.com/FTHTrading/wwai/settings/secrets/actions:

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens (create a "wwai-ci" token) |
| `VERCEL_ORG_ID` | After `vercel link`, read from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | After `vercel link`, read from `.vercel/project.json` |

Print them locally:

```powershell
Get-Content .vercel/project.json
```

Once secrets are set, **every push to `main` ships to production**. Trigger a preview manually from the Actions tab → `deploy-vercel` → Run workflow → Preview.

## Vercel project env vars (set once)

| Name | Value | Scope |
|---|---|---|
| `DEMO_ACCESS_CODE` | your private code | Production (and Preview if you want gated previews) |
| `NEXT_PUBLIC_MAP_PROVIDER` | `maplibre` | All |

That's it. CI guards every change, the action ships every merge, the script ships from your workstation when needed.
