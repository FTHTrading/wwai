# Production Integration Checklist

Use this list to take a signed customer from demo to live. Anything not in this list is post-launch.

## 1. Brand & legal

- [ ] Confirm any league / venue / brand affiliations are licensed in writing before referencing them in copy.
- [ ] Strip any placeholder logos. Replace with the customer\u2019s logos and any sponsor logos contractually approved.
- [ ] Footer copyright year correct, T&C and privacy linked, accessibility statement linked.
- [ ] Replace generic safety language with the customer\u2019s legal-approved phrasing if they require it.

## 2. Database

- [ ] Provision Postgres (managed) and set `DATABASE_URL`.
- [ ] Run `npx prisma migrate deploy`.
- [ ] Seed approved baseline data via `prisma/seed.ts`.
- [ ] Replace localStorage writes in registration / proposals with `/api/leads` + `/api/proposals` server routes that persist to Postgres.

## 3. Auth

- [ ] Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
- [ ] Wire SSO (Azure AD, Okta, Google Workspace) for `/admin`, `/analytics`, `/billing`, `/settings/integrations`.
- [ ] Public pages stay anonymous.

## 4. Payments

- [ ] Decide Square or Stripe. Set the relevant env keys (see `/settings/integrations`).
- [ ] Add webhook endpoint and signature verification.
- [ ] Switch `Create Payment Link` button on `/billing` from disabled to live (gated on `getPaymentProviderStatus`).
- [ ] PCI scope review: this app should never see raw PAN data.

## 5. CRM

- [ ] Decide Zoho / HubSpot / Airtable. Set keys.
- [ ] Map registration → CRM contact / lead.
- [ ] Map proposal → CRM deal.
- [ ] Bidirectional status sync (approved, needs_info, rejected) if the customer wants the sales team in CRM-only.
- [ ] Manual CSV export remains available regardless.

## 6. Map & routing

- [ ] Decide outdoor provider: hosted OSRM/Valhalla, Mapbox, Azure Maps. Set `NEXT_PUBLIC_MAP_PROVIDER` and any tokens.
- [ ] Decide indoor provider per venue: Mappedin (recommended), IMDF, ArcGIS Indoors, Apple MapKit Indoor. Set `NEXT_PUBLIC_INDOOR_PROVIDER` and credentials.
- [ ] Replace public OSRM demo with hosted routing for SLAs.
- [ ] Operator review of every safety corridor before it goes live.

## 7. AI / RAG / MCP

- [ ] Decide LLM (managed: Foundry, OpenAI, Anthropic; or local).
- [ ] Build RAG index over verified data: packages, listings, hotel pickup zones, venue maps, safety procedures, language packs.
- [ ] Define MCP tools: CRM, map, billing, email/SMS, proposals, registration review, analytics, payments.
- [ ] Add approval gates for any tool that writes.
- [ ] Log every AI response in case of incident review.

## 8. Communications

- [ ] SendGrid or alternative for transactional email.
- [ ] Twilio or alternative for SMS (used by `/api/sales/sms`).
- [ ] Sender domain DKIM / SPF / DMARC configured.

## 9. Analytics

- [ ] PostHog / GA4 / equivalent.
- [ ] Replace demo analytics page values with live KPIs.
- [ ] Server-side event capture for QR scans, redemptions, route requests.

## 10. Security

- [ ] Rate limit all `/api/*` routes.
- [ ] Add CSP, HSTS, X-Frame-Options.
- [ ] OWASP Top 10 review.
- [ ] Secret manager (Azure Key Vault, AWS Secrets Manager). No keys in `.env.local` in production.

## 11. Deployment

- [ ] Pick host (Vercel, Cloudflare Pages, Azure Container Apps, AKS).
- [ ] Set all env keys in the host\u2019s secret store.
- [ ] Enable preview deployments for proposed changes.
- [ ] Backups for Postgres on a schedule.

## 12. Operations

- [ ] On-call rotation defined.
- [ ] Status page and uptime monitoring.
- [ ] Customer success runbook for the first 30 days.
- [ ] Quarterly compliance / brand review.
