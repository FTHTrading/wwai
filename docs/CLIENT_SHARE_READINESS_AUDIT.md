# Client Share Readiness Audit

**Date:** 2026-05-04
**Build status:** lint clean, `tsc --noEmit` clean, `next build` clean (3.0s)
**Pages:** 30 app routes + 27 API routes (57 total)
**Mode:** Demo. No real payments, no real CRM writes, no protected-brand affiliations.

---

## 1. Positioning (verified)

- **TROPTIONS** = independent AI + Blockchain SalesOS / GuestOps for major event cities.
- **WWAI (WhichWay AI)** = guest-facing concierge. Slogan: "Nowhere to go? WhichWay AI knows."
- Layout / footer / homepage explicitly state: "not affiliated with any protected sports league, event, team, venue, hotel, rideshare brand, or restaurant brand unless separately licensed."
- Safety wording standard: `safety-informed`, `demo route`, `operator-reviewed in production`, `recommended public corridor`. Never `guaranteed`, `official`, `police-approved`.
- Emergency disclaimer present where safety routes are shown.

## 2. Route inventory

**Marketing / story (public):** `/`, `/wwai`, `/demo`, `/case-studies`, `/contact`, `/launch`, `/area-guide`
**Buyer journey:** `/packages`, `/proposals`, `/billing`
**Discovery:** `/map`, `/safety-routes`, `/restaurants`, `/bars`, `/hotels`, `/drivers`, `/sponsors`, `/venues`
**Onboarding:** `/register`, `/register/restaurant`, `/register/bar`, `/register/merchant`, `/register/hotel`, `/register/driver`, `/register/sponsor`, `/register/venue`
**Operator:** `/admin`, `/analytics`, `/campaigns`, `/agent-system`
**Added in this pass:** `/client-demo`, `/settings/integrations`

## 3. Component inventory (verified working)

| Concern | File | State |
|---|---|---|
| Shared registration form | [src/components/forms/RegistrationForm.tsx](src/components/forms/RegistrationForm.tsx) | Saves to localStorage via `saveSubmission`, status `pending`, links to `/admin` |
| Operator review | [src/components/dashboard/AdminDashboard.tsx](src/components/dashboard/AdminDashboard.tsx) | Filters by type/status, approve / needs_info / reject, counts tiles |
| Proposal builder | [src/components/proposals/ProposalBuilder.tsx](src/components/proposals/ProposalBuilder.tsx) | Customer/package/term/add-ons live preview, `saveProposal`, Print added in this pass |
| Outdoor map adapter | [src/lib/maps/provider.ts](src/lib/maps/provider.ts), [maplibre.ts](src/lib/maps/maplibre.ts), [mapbox.ts](src/lib/maps/mapbox.ts) | MapLibre live (free OSM + OSRM), Mapbox stub |
| Indoor map adapter | [src/lib/maps/mappedin.ts](src/lib/maps/mappedin.ts) | Stub interface ready for Mappedin / IMDF |
| Live map shell | [src/components/map/LiveMap.tsx](src/components/map/LiveMap.tsx) | Dynamic import, falls back to demo SVG when provider=demo |
| Indoor venue placeholder | [src/components/map/VenueMap.tsx](src/components/map/VenueMap.tsx) | Gate / Section / Seat focus, integration roadmap |
| Safety route planner | [src/components/map/SafetyRoutePlanner.tsx](src/components/map/SafetyRoutePlanner.tsx) | Live route via adapter; status chip + provider badge |
| Demo storage | [src/lib/demoStorage.ts](src/lib/demoStorage.ts) | `saveSubmission`, `saveProposal`, `loadSubmissions` |
| CRM | [src/lib/crm.ts](src/lib/crm.ts) | Manual / Zoho / HubSpot / Airtable readiness gating; never writes without keys |
| Payments | [src/lib/payments.ts](src/lib/payments.ts) | Manual / Square / Stripe; `getPaymentProviderStatus`, `createSquarePaymentLink` only fires when configured |

## 4. Demo / safety language sweep

- All map / safety route surfaces show a `disclaimer-bar`.
- All demo metrics live in `data/` files and render with "Demo Data" or "Demo Projection" chips on `/analytics`, `/billing`, `/dashboard`-style panels.
- WWAI page lists preset questions with informational-only responses; no `official` claims.
- Footer year: 2026 (verified in [src/app/layout.tsx](src/app/layout.tsx)).
- No emoji in copy; no protected-mark references in copy or images.

## 5. Demo-only vs production-ready matrix

| Capability | Demo state | Production requires |
|---|---|---|
| Registration intake | localStorage in browser | Persist to Postgres via `/api/leads` + auth |
| Admin review | localStorage approve/reject | Server-side mutation + audit trail |
| Proposals | localStorage with print | DB persistence + PDF export + e-signature |
| Payment links | Disabled unless keys present | `SQUARE_ACCESS_TOKEN` or `STRIPE_SECRET_KEY` + webhook receivers |
| CRM push | Manual CSV export | Zoho / HubSpot / Airtable env keys + mapping |
| Outdoor map | MapLibre + public OSRM | Hosted OSRM/Valhalla or Mapbox/Azure tokens |
| Indoor map | Demo placeholder | Mappedin SDK creds or IMDF venue file |
| Analytics | Demo data files | Wire to PostHog / GA4 / `/api/stats` real source |
| AI concierge | Preset Q&A in [src/lib/ai-prompts.ts](src/lib/ai-prompts.ts) | Connect `/api/ai/chat` to managed LLM with RAG over verified data |
| QR scans | Demo `/api/qr/[code]` route | Persist scans + redemption auth |

## 6. Gaps closed in this pass

1. New page **`/client-demo`** — single guided walkthrough for sales reps (Start → WWAI → Packages → Register → Map/Safety Routes → Proposal → Admin → Analytics → Billing → Launch).
2. New page **`/settings/integrations`** — single source of truth for CRM / payment / map / database / AI status; reads `lib/crm.ts` and `lib/payments.ts`; lists required env vars without exposing secrets.
3. **Print Preview** wired on `ProposalBuilder` (`window.print()`) so reps can hand a printed quote to a client on the spot.
4. **Map provider defaulted to MapLibre** so live OSM + OSRM works out of the box.
5. **Production docs** added under `docs/` (this audit + 5 companion guides — see Phase M).

## 7. Known follow-ups (not in scope this pass)

- Wire `/api/leads` to write to Postgres so admin survives page reload across devices.
- Replace public OSRM demo with a hosted routing service (Mapbox Directions, Azure Maps Route, or self-hosted OSRM/Valhalla).
- Build a real `/api/proposals` PDF generator (puppeteer or `@react-pdf/renderer`).
- Add SAML/Azure AD or NextAuth on `/admin` before any external rep accesses it.
- Compliance review of every public copy block before any client demo is recorded.

## 8. Verification commands

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

All green as of 2026-05-04.
