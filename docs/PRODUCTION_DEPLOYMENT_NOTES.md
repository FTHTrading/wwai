# Production Deployment Notes

## Supported Deployment Targets

| Platform      | DB Backend       | Notes                         |
|---------------|------------------|-------------------------------|
| Vercel        | Turso (libsql)   | Recommended for Next.js       |
| Netlify       | Turso (libsql)   | Works with Edge adapter        |
| Railway       | PostgreSQL       | Full-stack, persistent DB      |
| Fly.io        | Fly Postgres     | Dockerfile-based               |
| Self-hosted   | SQLite / Postgres| pm2 + caddy reverse proxy      |

---

## Vercel + Turso (Recommended)

### 1. Create a Turso database

```bash
turso db create troptions-prod
turso db show troptions-prod   # get DATABASE_URL
turso db tokens create troptions-prod  # get DATABASE_AUTH_TOKEN
```

### 2. Update `prisma/schema.prisma`

The schema already uses the libsql adapter. No changes needed.

### 3. Set environment variables in Vercel dashboard

```
DATABASE_URL=libsql://troptions-prod-xxx.turso.io
DATABASE_AUTH_TOKEN=your-token
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
TELNYX_API_KEY=...
SQUARE_ACCESS_TOKEN=...
SQUARE_LOCATION_ID=...
OPENAI_API_KEY=...
```

### 4. Run migrations on Turso

```bash
npx prisma migrate deploy
```

### 5. Seed production data

```bash
npm run db:seed
```

---

## Railway (PostgreSQL)

### 1. Change provider in `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Remove the libsql `adapter` block.

### 2. Generate client

```bash
npx prisma generate
```

### 3. Deploy

Railway auto-deploys from `main` branch. Set `DATABASE_URL` in Railway's Variables tab.

---

## Environment Variables Checklist

| Variable              | Required? | Default / Example                                    |
|-----------------------|-----------|------------------------------------------------------|
| `DATABASE_URL`        | ✅        | `libsql://...` or `file:./dev.db`                   |
| `DATABASE_AUTH_TOKEN` | Turso only| Turso token                                          |
| `TELNYX_API_KEY`      | Optional  | Enables SMS + calls                                  |
| `TELNYX_PHONE_NUMBER` | Optional  | `+14045550100`                                       |
| `SQUARE_ACCESS_TOKEN` | Optional  | Enables payments                                     |
| `SQUARE_LOCATION_ID`  | Optional  | Square location ID                                   |
| `SQUARE_ENVIRONMENT`  | Optional  | `sandbox` or `production`                            |
| `OPENAI_API_KEY`      | Optional  | Powers AI dashboard chat                             |
| `OPENAI_BASE_URL`     | Optional  | `http://localhost:11434/v1` for local Ollama         |
| `NEXT_PUBLIC_MAP_TILES`| Optional | Defaults to OpenFreeMap (no key required)            |
| `NEXT_PUBLIC_APP_URL` | ✅        | Your deployed URL                                    |

---

## Build Commands

```bash
# Install
npm ci

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build Next.js
npm run build

# Start
npm start
```

---

## Cloudflare Pages

See `DEPLOY_TO_CLOUDFLARE.md` for Cloudflare-specific deployment instructions including `wrangler.toml` configuration.

---

## Health Check

After deployment, verify:

```
GET /api/stats          → returns JSON with sponsor/venue/lead counts
GET /api/venues         → returns array of venues
GET /api/campaigns      → returns array of campaigns
GET /api/ai/health      → returns AI backend status
```

---

## Database Reset (Production — Destructive)

**Only do this on staging:**

```bash
npx prisma migrate reset --force
npm run db:seed
```
