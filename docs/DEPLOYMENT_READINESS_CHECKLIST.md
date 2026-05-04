# Deployment Readiness Checklist

## Pre-Deploy Verification

### ✅ Build
- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run build` — clean build, no type errors
- [ ] All new routes appear in build output

### ✅ Database
- [ ] `npx prisma migrate deploy` run against production DB
- [ ] `npx prisma generate` run after migration
- [ ] Prisma connection string set in production env: `DATABASE_URL`
- [ ] For Postgres: change `provider` in `schema.prisma` from `sqlite` → `postgresql`
  and set adapter from libsql to standard Prisma client

### ✅ Environment Variables

#### Required
```env
DATABASE_URL=file:./prisma/dev.db    # or postgresql://... for production
```

#### Sales / Comms
```env
TELNYX_API_KEY=
TELNYX_FROM_NUMBER=+1XXXXXXXXXX
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
```

#### AI (Dashboard)
```env
OPENAI_API_KEY=                      # or local Ollama endpoint
```

#### Map (Optional)
```env
NEXT_PUBLIC_MAP_PROVIDER=maplibre    # or mapbox, or omit for list fallback
NEXT_PUBLIC_MAPBOX_TOKEN=            # only if mapbox selected
```

#### Deployment Platform
```env
NEXTAUTH_SECRET=                     # if auth is added
NEXTAUTH_URL=https://yourdomain.com  # if auth is added
```

### ✅ Pages Deployed
| Route | Status |
|-------|--------|
| `/` | ✅ Home |
| `/about` | ✅ Brand page |
| `/analytics` | ✅ Analytics dashboard |
| `/campaigns` | ✅ Campaign engine |
| `/contact` | ✅ Lead capture |
| `/dashboard` | ✅ AI command center |
| `/map` | ✅ Live Ops |
| `/market` | ✅ Market |
| `/options` | ✅ Options |
| `/sales` | ✅ Sales Engine (DB-connected leads) |
| `/sponsors` | ✅ Partner portal |
| `/venues` | ✅ Venue network |
| `/wallet` | ✅ Wallet |
| `/qr/[code]` | ✅ QR redemption experience |

### ✅ API Routes
| Endpoint | Methods |
|----------|---------|
| `/api/ai/chat` | POST |
| `/api/ai/health` | GET |
| `/api/ai/presets` | GET |
| `/api/campaigns` | GET, POST |
| `/api/campaigns/[id]` | GET |
| `/api/leads` | GET, POST, PATCH |
| `/api/listings` | GET, POST |
| `/api/options` | GET |
| `/api/qr/[code]` | GET, POST |
| `/api/sales/call` | POST |
| `/api/sales/payment` | POST |
| `/api/sales/sms` | POST |
| `/api/sponsors` | GET, POST |
| `/api/sponsors/[id]` | GET, PATCH |
| `/api/stats` | GET |
| `/api/tsn` | GET |
| `/api/users` | GET |
| `/api/venues` | GET, POST |
| `/api/venues/[id]` | GET, PATCH |

### ✅ Cloudflare Pages (if using)
- [ ] See `DEPLOY_TO_CLOUDFLARE.md` and `CLOUDFLARE_PAGES_STAGING_RUNBOOK.md`
- [ ] `wrangler.toml` configured
- [ ] Build command: `npm run build`
- [ ] Output dir: `.next` (or `out` for static export)
- [ ] D1 or Hyperdrive configured if moving off SQLite

### ✅ Post-Deploy Smoke Tests
- [ ] GET `/api/stats` returns JSON with `totalSponsors`, `totalVenues`, `totalLeads`
- [ ] POST `/api/leads` creates a lead successfully
- [ ] `/contact` form submits without error
- [ ] `/analytics` loads and renders KPI grid
- [ ] `/qr/test-code` returns 404 gracefully (not a 500)
- [ ] `/dashboard` AI chat returns a response

## Rollback Plan
1. Git revert to last clean commit: `git revert HEAD`
2. Or hard reset: `git reset --hard <commit>` (destructive — confirm first)
3. Redeploy previous build artifact

## Performance Notes
- All DB queries use Prisma's `findMany` with `select` (no over-fetching)
- `/api/stats` runs 9 parallel `prisma.count()` calls via `Promise.all`
- QR scan hot path: 2 DB operations (read + update), O(1)
- Analytics page: 4 parallel API fetches, no server-side waterfall
