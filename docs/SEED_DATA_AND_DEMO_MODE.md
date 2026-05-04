# Seed Data & Demo Mode

## Quick Start

```bash
# Seed demo data (safe to run multiple times — uses upsert)
npm run db:seed

# Full reset: wipe DB, re-migrate, re-seed (destroys all data)
npm run db:reset:demo
```

---

## What Gets Seeded

### Sponsors (6)

| Name               | Status    | Package   | Budget   |
|--------------------|-----------|-----------|----------|
| CocaCola Beverages | active    | platinum  | $75,000  |
| Delta Air Lines    | active    | title     | $150,000 |
| Truist Bank        | active    | gold      | $55,000  |
| Chick-fil-A        | active    | silver    | $30,000  |
| Marriott Bonvoy    | onboarded | gold      | $40,000  |
| Nike Atlanta       | prospect  | platinum  | $80,000  |

### Venues (8) — Atlanta Coordinates

| Venue                     | Category      | Capacity | Lat/Lng                    |
|---------------------------|---------------|----------|----------------------------|
| Mercedes-Benz Stadium     | stadium       | 71,000   | 33.7554, -84.4009          |
| State Farm Arena          | entertainment | 21,000   | 33.7573, -84.3962          |
| Hartsfield-Jackson ATL    | transit       | —        | 33.6407, -84.4277          |
| Georgia World Congress Ctr| entertainment | 150,000  | 33.7612, -84.3978          |
| Marriott Marquis Atlanta  | hotel         | 1,663    | 33.7583, -84.3874          |
| Five Points MARTA Station | transit       | —        | 33.7490, -84.3908          |
| Ponce City Market         | retail        | —        | 33.7724, -84.3655          |
| Piedmont Park Amphitheater| entertainment | 10,000   | 33.7855, -84.3725          |

### Campaigns (4)

| Campaign                      | Status    | Impressions | Redemptions |
|-------------------------------|-----------|-------------|-------------|
| CocaCola Stadium Activation Q2| active    | 84,200      | 1,842       |
| Delta ATL Airport Experience  | active    | 212,000     | 4,750       |
| Truist Fan Rewards — NBA       | active    | 41,000      | 876         |
| Chick-fil-A App Drive — GWCC  | completed | 28,500      | 1,020       |

### QR Codes (8)

| Code               | Scans | Redeems |
|--------------------|-------|---------|
| GATE-A-FREE-COKE   | 1,420 | 892     |
| HALF-OFF-COMBO     | 823   | 312     |
| SKYMILES-BONUS     | 9,200 | 3,100   |
| LOUNGE-DAY-PASS    | 4,100 | 1,200   |
| TRUIST-BONUS-PTS   | 2,800 | 650     |
| 10-OFF-CONCESSIONS | 1,100 | 226     |
| FREE-SANDWICH      | 3,800 | 850     |
| APP-5-CREDIT       | 2,200 | 420     |

### Leads (8) — Pipeline Stages

| Name             | Company              | Status      | Est. Value |
|------------------|----------------------|-------------|------------|
| James Kellerman  | SuperBrand Athletics | qualified   | $85,000    |
| Angela Wu        | FreshCo Beverages    | proposal    | $120,000   |
| Terrence Brown   | ATL Dome Properties  | new         | $200,000   |
| Sarah McIntyre   | StadiumLink Ops      | contacted   | $65,000    |
| Devon Jackson    | ReachSport Agency    | qualified   | $45,000    |
| Lisa Fontaine    | CreditOne Financial  | new         | $90,000    |
| Marcus Allen     | Sport Media Group    | contacted   | $38,000    |
| Rachel Kim       | SportswearDirect     | closed_won  | $55,000    |

---

## Seed Idempotency

The seed uses `upsert` (by slug/name/code) so it is safe to run multiple times without duplicating records. Each re-run will update existing records to match the seed values.

---

## Adding Your Own Data

To add real sponsor/venue/lead data before a demo:
1. Use the UI: `/sponsors`, `/venues`, `/contact`
2. Or add more `upsert` blocks to `prisma/seed.ts`
3. Or use Prisma Studio: `npm run db:studio`
