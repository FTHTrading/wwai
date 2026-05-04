# Backend Migration Roadmap

This is the engineering plan to move TROPTIONS + WWAI from demo (browser localStorage, demo data, no auth) to a live production system.

Current state: every protected operator surface (`/admin`, `/billing`, `/analytics`, `/settings/integrations`, `/launch`) is gated by a session-only demo code. Submissions, proposals, leads live in browser localStorage. Map runs on free MapLibre + public OSRM. AI is preset-only.

## Phase 1 — Persistence (replace localStorage)

**Today:** [src/lib/demoStorage.ts](../src/lib/demoStorage.ts) writes `saveSubmission`, `saveProposal` to `window.localStorage`.

**Goal:** every write goes to Postgres via Prisma.

1. Provision Postgres (Neon / Supabase / Azure Database for PostgreSQL).
2. Set `DATABASE_URL` and run `npx prisma migrate deploy`.
3. Add Prisma models for `Submission`, `Proposal`, `Lead`, `Approval`. Schema lives in [prisma/schema.prisma](../prisma/schema.prisma) — extend, don\u2019t replace.
4. Create server routes:
   - `POST /api/submissions` — replaces `saveSubmission`.
   - `POST /api/proposals` — replaces `saveProposal`.
   - `PATCH /api/submissions/:id/status` — replaces `setStatus` in `AdminDashboard`.
5. Update [src/components/forms/RegistrationForm.tsx](../src/components/forms/RegistrationForm.tsx) and [src/components/proposals/ProposalBuilder.tsx](../src/components/proposals/ProposalBuilder.tsx) to call those routes.
6. Update [src/components/dashboard/AdminDashboard.tsx](../src/components/dashboard/AdminDashboard.tsx) to fetch from `/api/submissions` instead of reading localStorage.
7. Keep `demoStorage.ts` as a typed local cache for offline demos — toggle by env.

## Phase 2 — Auth (replace DemoGate)

**Today:** [src/components/auth/DemoGate.tsx](../src/components/auth/DemoGate.tsx) — sessionStorage password gate.

**Goal:** real SSO with role-based access control.

1. Pick provider: NextAuth (drop-in), Azure AD, Okta, Auth0, Clerk.
2. Define roles: `guest` (public), `sales` (proposals + register), `operator` (admin), `finance` (billing), `superadmin` (integrations + launch).
3. Replace each `<DemoGate>` layout with a NextAuth `auth()` check + role gate.
4. Add a server action that issues short-lived demo links for client previews (signed JWT) so sales reps can still share specific surfaces without giving full access.

## Phase 3 — CRM sync

**Today:** [src/lib/crm.ts](../src/lib/crm.ts) has provider readiness, no live writes.

**Goal:** every approved submission flows to CRM as a contact + deal.

1. Set provider env keys (Zoho, HubSpot, Airtable). See [docs/CRM_PAYMENT_MAP_INTEGRATION_GUIDE.md](CRM_PAYMENT_MAP_INTEGRATION_GUIDE.md).
2. Implement `pushContact()` and `pushDeal()` helpers in `crm.ts` — each gated on its readiness check.
3. Hook into the admin approve handler: on `approved`, push to CRM; on failure, alert operator and queue for retry.
4. Add a CSV exporter (already at `/api/leads/export`) as the manual fallback.

## Phase 4 — Payments

**Today:** [src/lib/payments.ts](../src/lib/payments.ts) has provider abstraction, all flows return error if unconfigured.

**Goal:** real invoice creation and payment links.

1. Decide Square or Stripe per customer.
2. Set keys; `getPaymentProviderStatus()` flips to `configured`.
3. Implement `createSquarePaymentLink()` and `createStripePaymentLink()` (today they are stubs that bail out).
4. Add webhook receivers under `src/app/api/payments/webhooks/<provider>/route.ts` with signature verification.
5. Update `BillingConsole` to fetch invoices from `/api/invoices` (already exists) backed by Postgres.
6. PCI scope: never accept card data in this app. Always redirect to provider-hosted UIs.

## Phase 5 — Map / routing

**Today:** MapLibre + public OSRM via [src/lib/maps/maplibre.ts](../src/lib/maps/maplibre.ts).

**Goal:** SLA-backed routing and indoor wayfinding.

1. Pick outdoor: hosted OSRM/Valhalla (self-hosted), Mapbox Directions, or Azure Maps Route.
2. Pick indoor per venue: Mappedin (recommended), IMDF (with Apple MapKit Indoor), ArcGIS Indoors.
3. Replace stubs in [src/lib/maps/mapbox.ts](../src/lib/maps/mapbox.ts) and [src/lib/maps/mappedin.ts](../src/lib/maps/mappedin.ts).
4. Add operator review queue for safety corridors — every route needs sign-off before it shows publicly.
5. Add an event-driven re-route system for incident response (closed gate, blocked street).

## Phase 6 — AI / RAG / MCP

**Today:** preset Q&A in [src/lib/ai-prompts.ts](../src/lib/ai-prompts.ts), `/api/ai/chat` returns canned responses.

**Goal:** managed LLM with retrieval over verified data plus tool-using agents.

1. Pick LLM (Foundry, OpenAI, Anthropic, or a local model via Ollama as a dev fallback).
2. Build a RAG index over: package definitions, approved listings, hotel pickup zones, venue maps, safety procedures, language packs. Vector store: Postgres `pgvector`, Azure AI Search, or Pinecone.
3. Wire `/api/ai/chat` to the LLM with the RAG retriever. Always return citations.
4. Define MCP tools and host them: CRM tool, map/routing tool, billing tool, email/SMS tool, proposal tool, registration review tool, analytics tool, payment provider tool.
5. Approval gate on every tool that writes. Log every call.
6. WWAI guest concierge: read-only RAG initially. Tool-use comes later, behind safety review.

## Phase 7 — Communications

1. SendGrid (or Postmark / Resend) for transactional email; configure DKIM/SPF/DMARC.
2. Twilio for SMS — already used by `/api/sales/sms`; promote from demo to live with auth.
3. Add per-environment from-addresses; never reuse marketing domain for transactional traffic.

## Phase 8 — Analytics

1. PostHog (self-host or cloud) or GA4.
2. Add server-side capture for QR scans, route requests, redemptions, sponsor exposure.
3. Replace demo numbers in `/analytics` with live KPIs.

## Phase 9 — Hardening

1. Rate limit every `/api/*` route (Upstash Redis or built-in middleware).
2. CSP, HSTS, X-Frame-Options, Permissions-Policy.
3. OWASP Top 10 review before any external launch.
4. Move secrets to Azure Key Vault / AWS Secrets Manager / Doppler. No `.env.local` in production hosts.
5. Backups for Postgres on a schedule; tested restore.

## Phase 10 — Deployment

| Target | Pros | Cons |
|---|---|---|
| Vercel | Native Next.js, zero-config | Vendor pricing at scale |
| Cloudflare Pages | Cheap, fast, edge-native | Some Next.js features need tuning |
| Azure Container Apps | Enterprise alignment, KEDA scale | More setup |
| AKS | Full control, multi-tenant | Highest ops burden |

For the first paying customer, **Vercel + Neon Postgres + Cloudflare DNS** is the lowest-effort credible production stack.

## Sequencing recommendation

For a 4–6 week path to live with one customer:

1. Week 1: Phase 1 (persistence) + Phase 2 (auth).
2. Week 2: Phase 4 (payments) + Phase 7 (email/SMS).
3. Week 3: Phase 3 (CRM) + Phase 8 (analytics).
4. Week 4: Phase 5 (routing) + Phase 9 (hardening).
5. Week 5: Phase 6 (AI/RAG) MVP — read-only RAG only.
6. Week 6: Soft launch with the first customer.
