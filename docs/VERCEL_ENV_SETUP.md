# Vercel Environment Setup

Run these commands once before your first production deploy.

## 1. Login and link

```powershell
vercel login
vercel link --yes --project wwai
```

> The project name **must** be `wwai`. The local folder is named `fifa troptions` — if Vercel
> auto-derives a slug from that it creates an invalid project name. Always pass `--project wwai`.

## 2. Add required production env vars

### DEMO_ACCESS_CODE (required — server-only)

```powershell
vercel env add DEMO_ACCESS_CODE production
```

When prompted, enter your private demo access code. This is the code your client types at `/demo-access`.

**Security rules:**
- This value is **server-only**. Never use `NEXT_PUBLIC_DEMO_ACCESS_CODE` — it would ship in the browser bundle and be visible to anyone who opens DevTools.
- Never commit this value to git.
- Rotate after every external demo session.

### NEXT_PUBLIC_MAP_PROVIDER (required)

```powershell
vercel env add NEXT_PUBLIC_MAP_PROVIDER production
```

When prompted for the value, enter:

```
maplibre
```

This enables free OSM tiles via MapLibre GL. No API key required.

## 3. Verify vars are set

```powershell
vercel env ls production
```

You should see both `DEMO_ACCESS_CODE` and `NEXT_PUBLIC_MAP_PROVIDER` listed.

## 4. Deploy and smoke test

```powershell
npm run release:vercel
```

This single command:
1. Runs preflight checks
2. Verifies Vercel auth and link
3. Confirms env vars are set
4. Runs lint, typecheck, and build
5. Deploys to Vercel production
6. Captures the deployed URL automatically
7. Runs smoke tests against the real URL
8. Prints the safe client share URL

## 5. Share with clients

Always share the `/client-demo` path — not `/admin`, `/billing`, or `/analytics`:

```
https://wwai-<hash>.vercel.app/client-demo
```

Clients who need to see protected dashboards must enter the demo code at `/demo-access`.

## Rotating the demo code

After every external presentation:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update `DEMO_ACCESS_CODE` to a new value
3. Redeploy (push any commit to `main`, or run `npm run deploy`)

Existing cookies stop working on the next page request — no need to clear anything manually.

## How the gate works

- `middleware.ts` intercepts all requests to `/admin`, `/billing`, `/analytics`, `/settings/integrations`, `/launch`
- If the `wwai_demo_access` cookie is absent or wrong, the user is redirected to `/demo-access`
- `/demo-access/page.tsx` validates the code server-side (Server Action, `"use server"`)
- On match: sets an httpOnly, sameSite=lax, secure-in-production cookie valid for 8 hours
- The cookie value is never exposed to JavaScript

## Environment variable reference

| Name | Scope | Required | Notes |
|---|---|---|---|
| `DEMO_ACCESS_CODE` | Production | Yes | Server-only. Gates `/admin` and other protected routes |
| `NEXT_PUBLIC_MAP_PROVIDER` | All | Yes | Set to `maplibre` for free OSM tiles |
| `DATABASE_URL` | Production | Phase 1+ | Postgres connection string (Neon/Supabase) |
| `TURSO_DATABASE_URL` | Production | Phase 1+ | LibSQL/Turso for edge deployment |
| `TURSO_AUTH_TOKEN` | Production | Phase 1+ | LibSQL auth token |
| `NEXTAUTH_SECRET` | Production | Phase 2+ | Session encryption key |
| `NEXTAUTH_URL` | Production | Phase 2+ | Full production URL |

> `DATABASE_URL`, `TURSO_*`, and `NEXTAUTH_*` are not needed for the current demo-only deploy.
