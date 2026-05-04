# Deploy TROPTIONS to troptionsfifa.unykorn.org

## Prerequisites
- Cloudflare account with `unykorn.org` DNS zone
- Wrangler CLI (installed via `npm install` — included in devDependencies)
- A remote LibSQL/Turso database (for production — the local `dev.db` won't work on CF)

---

## Step 1 — Copy logos and install

```cmd
copy-logos.bat
npm install
```

---

## Step 2 — Set up a remote Turso database

The local `dev.db` SQLite file won't work on Cloudflare's edge network.
You need a remote LibSQL database (Turso is free for small projects).

```bash
# Install Turso CLI
winget install turso

# Login
turso auth login

# Create a database
turso db create troptions-fifa

# Get the URL and token
turso db show troptions-fifa --url
turso db tokens create troptions-fifa
```

Create `.env.production.local`:
```
DATABASE_URL=libsql://troptions-fifa-<your-org>.turso.io
DATABASE_AUTH_TOKEN=<your-turso-token>
```

---

## Step 3 — Authenticate with Cloudflare

```cmd
npx wrangler login
```

This opens your browser — log in and grant access.

---

## Step 4 — Create the Cloudflare Pages project (first time only)

Go to: https://dash.cloudflare.com → Pages → Create a project → "Direct Upload"

Name it: `troptions-fifa`

OR via CLI:
```cmd
npx wrangler pages project create troptions-fifa
```

---

## Step 5 — Add secrets to Cloudflare Pages

In the Cloudflare dashboard:
Pages → troptions-fifa → Settings → Environment Variables → Production

Add:
| Name | Value |
|------|-------|
| `DATABASE_URL` | your Turso URL |
| `DATABASE_AUTH_TOKEN` | your Turso token |
| `NODE_ENV` | `production` |

---

## Step 6 — Build and deploy

```cmd
npm run deploy:cf
```

This runs:
1. `npx @cloudflare/next-on-pages@1` — compiles Next.js for CF edge
2. `wrangler pages deploy .vercel/output/static --project-name=troptions-fifa`

First deploy gives you a URL like: `troptions-fifa.pages.dev`

---

## Step 7 — Point troptionsfifa.unykorn.org to CF Pages

In Cloudflare Dashboard → `unykorn.org` DNS:
1. Go to Pages project → Custom domains → Add custom domain
2. Enter: `troptionsfifa.unykorn.org`
3. Cloudflare will automatically create the CNAME record

OR manually add DNS record:
```
Type:  CNAME
Name:  troptionsfifa
Value: troptions-fifa.pages.dev
Proxy: Enabled (orange cloud)
```

---

## Step 8 — Verify

Visit: https://troptionsfifa.unykorn.org

You should see the TROPTIONS Event OS with:
- Gold TT logo in the header
- Map, Sponsors, Sales, Dashboard pages
- Mobile PWA installable

---

## Subsequent deploys

```cmd
npm run deploy:cf
```

That's it — the domain stays, only the build updates.

---

## Notes

- The `predev` hook (`node setup-dashboard.cjs`) only runs during `npm run dev`, NOT during the CF build
- All API routes (`/api/*`) run on Cloudflare Workers edge runtime
- The `better-sqlite3` local driver will not work on edge — only the LibSQL remote driver works
- Set `ENABLE_LIVE_TELNYX=true` and `ENABLE_LIVE_CARD_CAPTURE=true` in CF env vars when ready for live comms/payments
