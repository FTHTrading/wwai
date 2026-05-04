# Phase 6 — Production Integration Readiness

## Summary

Phase 6 adds the production-readiness layer to the TROPTIONS Sales Operating System. The goal is to make every provider integration safe to configure and deploy without pretending live API calls work before keys exist.

## What Was Built

### Server-Only Provider Abstractions (`src/lib/`)

| File | Purpose |
|------|---------|
| `env.ts` | Typed env validation. Returns boolean readiness flags and key names. Never returns secret values. |
| `payments.ts` | Payment provider abstraction. Gates Square/Stripe API calls on key presence. |
| `crm.ts` | CRM abstraction. Routes leads to Zoho, HubSpot, Airtable, or manual CSV. |

### New API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/system-status` | GET | Returns full system readiness JSON. Used by settings and launch pages. |
| `/api/payment-status` | GET | Returns payment provider readiness. Used by billing page. |
| `/api/leads/export` | GET | Returns all leads as CSV download. |

### New Pages

- **`/settings/integrations`** — Provider status dashboard with tabs for Payments, CRM, and System. Shows configured/unconfigured/partial badges, lists env key names (not values), and links to the CSV export.

### Improved Pages

- **`/billing`** — Payment provider cards now use live data from `/api/payment-status`. Square/Stripe buttons enable automatically when keys are present.
- **`/launch`** — Static checklist now shows real `✓ Set` / `⚠ Not set` badges for known env keys using `getSystemReadiness()` directly in the async server component.

### Nav Update

`/settings/integrations` added to the main navigation.

## Design Principles

1. **Safe by default** — No real API calls happen unless provider keys are configured.
2. **No secret leakage** — All readiness functions return only boolean flags and env key names, never values.
3. **Graceful degradation** — Manual payments and CSV export are always available.
4. **Operator visible** — The integrations page shows operators exactly what to configure and why.

## Route Count

Phase 5: 55 routes → Phase 6: 58+ routes (3 new API routes + 1 new page route)
