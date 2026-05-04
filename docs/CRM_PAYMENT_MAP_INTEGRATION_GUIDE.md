# CRM, Payment, and Map Integration Guide

This is the engineering reference for switching demo modules to live. The UI surface for status is `/settings/integrations`.

## CRM

**Library:** [src/lib/crm.ts](../src/lib/crm.ts)
**Status reader:** `getCRMProviderStatus()` — returns readiness for Zoho, HubSpot, Airtable, plus the always-on manual CSV path.

| Provider | Required env keys | Notes |
|---|---|---|
| Zoho | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN` | Server-based OAuth2 app. Use the v2 REST API. |
| HubSpot | `HUBSPOT_ACCESS_TOKEN` | Private App token. Scope: `crm.objects.contacts.write`, `crm.objects.deals.write`. |
| Airtable | `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` | Personal Access Token. Map registration types to tables. |
| Manual | none | CSV export at `/api/leads/export`. |

**Wiring steps:**
1. Add keys to `.env.local` (dev) or your host\u2019s secret store (prod).
2. Restart Next.
3. `/settings/integrations` flips from `unconfigured` to `configured`.
4. Switch the registration handler to call `pushContact()` (or equivalent) after `saveSubmission` — gated on `getActiveCRMProvider() !== "manual"`.
5. Add operator alert if a CRM push fails — never block the user.

## Payments

**Library:** [src/lib/payments.ts](../src/lib/payments.ts)
**Status reader:** `getPaymentProviderStatus()`.

| Provider | Required env keys | Notes |
|---|---|---|
| Square | `SQUARE_ACCESS_TOKEN` | Use Square Checkout API. Sandbox token for dev. |
| Stripe | `STRIPE_SECRET_KEY` (required), `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Use Payment Links or Checkout Sessions. |
| Manual | none | Always available. Records via `recordManualPayment()`. |

**Rules:**
- Never invoke a provider client unless `isSquareConfigured()` / `isStripeConfigured()` is true.
- Never log secret values. The status helpers only return safe metadata.
- Add webhook receivers under `src/app/api/payments/webhooks/<provider>/route.ts` and verify signatures.
- PCI scope: this app never sees raw card data. All entry happens on Square / Stripe hosted UIs.

## Maps

**Outdoor adapter:** [src/lib/maps/provider.ts](../src/lib/maps/provider.ts) chooses one of `demo` | `maplibre` | `mapbox`.
**Indoor adapter:** same file, `indoor` field, one of `demo` | `mappedin` | `imdf`.

| Provider | Env keys | Notes |
|---|---|---|
| MapLibre (default) | none | Uses public OSM tiles + public OSRM demo. Free, no signup. |
| Mapbox | `NEXT_PUBLIC_MAPBOX_TOKEN` | Replace [src/lib/maps/mapbox.ts](../src/lib/maps/mapbox.ts) stub with `mapbox-gl` mount + Directions API. Same adapter shape. |
| Azure Maps | `NEXT_PUBLIC_AZURE_MAPS_KEY` | Use Azure Maps Web SDK + Route Directions API. |
| Mappedin (indoor) | `NEXT_PUBLIC_MAPPEDIN_CLIENT_ID`, `NEXT_PUBLIC_MAPPEDIN_CLIENT_SECRET`, `NEXT_PUBLIC_MAPPEDIN_VENUE` | Install `@mappedin/mappedin-js`, fill in [src/lib/maps/mappedin.ts](../src/lib/maps/mappedin.ts). |
| IMDF | venue file | OGC standard. Render through Apple MapKit Indoor or a custom layer. |
| ArcGIS Indoors | ArcGIS Online org + IPS license | Enterprise venues with BIM/CAD ingest. |

**Routing fallback:** `createMapLibreAdapter().route()` calls public OSRM, falls back to a haversine straight-line. For production SLAs, host OSRM/Valhalla yourself or use Mapbox Directions / Azure Maps Route.

**Operator review:** every safety corridor must be reviewed and approved by the operator before it is shown to guests in production. Demo routes carry the demo disclaimer.

## Verification

After flipping any provider:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

Then load `/settings/integrations` and confirm the chip flipped from red `unconfigured` (or cyan `partial`) to green `configured`.
