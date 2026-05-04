# Final Client Share Checklist

Run this list before sending the demo URL to any external person. Sign and date it.

## 1. Pages render and navigate

- [ ] `/` — TROPTIONS + WWAI explained, no protected marks, no emoji
- [ ] `/wwai` — concierge demo loads, language picker works, presets respond
- [ ] `/client-demo` — every step link opens its target page in the same tab
- [ ] `/packages` — all package cards render with price, best-for, includes, CTA
- [ ] `/register` and each subroute — form renders, validation triggers
- [ ] `/area-guide` — content renders, no blank panels
- [ ] `/map` — map loads (live MapLibre when configured, demo SVG otherwise)
- [ ] `/safety-routes` — route planner runs, status line + provider chip render, indoor `VenueMap` placeholder shows below
- [ ] `/proposals` — package selection, term, add-ons, live total all update
- [ ] `/billing` — DemoGate prompts; after unlock, console + DemoWarning + provider chips render
- [ ] `/admin` — DemoGate prompts; after unlock, submissions list, filters, status buttons work
- [ ] `/settings/integrations` — DemoGate prompts; after unlock, all provider rows render with status chips
- [ ] `/launch` — DemoGate prompts; after unlock, checklist sections render

## 2. Critical CTAs

- [ ] Homepage hero buttons → land on the right page
- [ ] `/packages` `Register` button → `/register/<type>`
- [ ] `/packages` `Build Proposal` button → `/proposals?pkg=<id>`
- [ ] `/proposals` `Save Demo Proposal` → shows saved id
- [ ] `/proposals` `Print Preview` → opens browser print dialog with branded layout
- [ ] `/proposals` `Contact Sales` → `/contact`
- [ ] `/proposals` `View Billing` → `/billing`
- [ ] `/admin` approve / needs_info / reject → updates the row immediately
- [ ] `/safety-routes` Plan Route → returns a route summary

## 3. Forms

For each `/register/<type>`:
- [ ] required fields enforce validation
- [ ] submit shows confirmation with `Pending Review` chip
- [ ] confirmation links to `/admin` and `/proposals`
- [ ] submission visible in `/admin` after navigating there

## 4. Admin review

- [ ] Counts tiles match the list
- [ ] Filter by type narrows results
- [ ] Filter by status narrows results
- [ ] Approve / Needs info / Reject moves the row to the new tile

## 5. Proposal

- [ ] Customer type switch updates package list
- [ ] Add-ons toggle adjusts annual + total
- [ ] Term slider/select adjusts total
- [ ] Save creates a localStorage record
- [ ] Print Preview shows TROPTIONS + WWAI header, customer block, summary, next steps, disclaimer

## 6. Billing readiness

- [ ] DemoWarning banner visible
- [ ] Manual provider shows `configured`
- [ ] Square / Stripe show `unconfigured` unless keys are set
- [ ] No `Create Payment Link` button is enabled when provider is unconfigured

## 7. Safety wording

- [ ] No occurrence of `guaranteed safe`, `official route`, `police-approved`, `secure route`
- [ ] Every safety surface shows the emergency disclaimer
- [ ] WWAI preset answers stay informational

## 8. Protected-brand review

- [ ] No protected league / team / hotel / rideshare / restaurant marks in copy
- [ ] No protected logos in `/public`
- [ ] All affiliations referenced are documented and licensed in writing

## 9. Demo data review

- [ ] Every metric panel labeled `Demo Data` or `Demo Projection`
- [ ] No real customer names, emails, or phone numbers
- [ ] No real PII in seeded data

## 10. Build hygiene

- [ ] `npm run lint` clean
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` clean
- [ ] No console errors on the homepage in a fresh browser session

## 11. Access controls

- [ ] `DEMO_ACCESS_CODE` set on the deployed environment (server-side only — do NOT use `NEXT_PUBLIC_DEMO_ACCESS_CODE`, which leaks into the browser bundle)
- [ ] Middleware redirect verified: visiting `/admin`, `/billing`, `/analytics`, `/settings/integrations`, `/launch` while not unlocked should land on `/demo-access`
- [ ] Cookie `wwai_demo_access` is httpOnly, sameSite=lax, secure in production, max-age 8h
- [ ] Demo code shared only via password manager or signed message
- [ ] Demo URL not posted to public channels
- [ ] After every external presentation, rotate `DEMO_ACCESS_CODE`
- [ ] Plan tracked to replace demo gate with real SSO before any live customer data

## 12. Sign-off

| Role | Name | Date |
|---|---|---|
| Sales lead | | |
| Operations | | |
| Legal / brand | | |
| Engineering | | |
