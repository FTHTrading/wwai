# Auth & Database — Production Plan

> Status: Phase 1 (database-ready intake repository + demo fallback) is **shipped**.
> Real authentication is **NOT yet enforced**. This document is the roadmap.

This plan covers what is in place today, what is intentionally missing, and the
concrete next steps to take the platform from demo-grade to production-grade
for real customer data.

---

## 1. Why the demo gate is not production auth

`middleware.ts` + `DEMO_ACCESS_CODE` form a **presentation gate**. It exists to
prevent random visitors from poking through unfinished workflows during sales
demos. It is:

- A single shared secret (no per-user identity).
- Cookie-based, no session expiry tied to a user record.
- Has **no concept of roles, audit trails, or revocation**.

In short: do **not** treat the demo gate as security. It is not a substitute
for real auth and must not protect production customer data.

---

## 2. What is in place after Phase 1

### Database

- Prisma 7 with libSQL adapter (`src/lib/prisma.ts`).
- Connection string in `DATABASE_URL` (default `file:./prisma/dev.db`).
- Migration `20260505024403_phase5_sales_intake` adds:
  - `SalesIntake` — business intake form rows
  - `BusinessContact` — additional contacts per intake (one-to-many)
  - `SalesProposal` — proposal artifacts linked to intake
  - `AdminReviewEvent` — full audit trail of admin status changes / notes

### Repository

- `src/lib/storage/intakeRepository.ts` is the single server-side data access
  point for intake data.
- Auto-detects `DATABASE_URL` and a healthy schema; sets
  `storageMode = "database"` if available, otherwise `"demo"` (in-memory).
- Every public method returns `storageMode` so the UI can display a badge.
- EIN is **never stored in full** — the API enforces last-4-only and the DB
  column is named `einLastFour` to make this obvious in code review.

### API surface

- `GET  /api/sales-intake` and `POST /api/sales-intake` — list + create.
- `GET  /api/sales-intake/:id` — fetch by intake id (cuid or `WWAI-...`).
- `PATCH /api/sales-intake/:id` — update status; writes `AdminReviewEvent`.
- All responses include `storageMode: "database" | "demo"`.

### UI

- `/sales-registration/intake` posts to the API first; on failure it falls
  back to the existing `localStorage` helper so the demo never breaks.
- `/admin/sales-intake` reads from the API, falls back to `localStorage` if
  the API is unreachable, and shows a coloured **Database storage** /
  **Demo storage** badge in the header.

---

## 3. Routes that MUST require real auth before storing real data

Any route under these prefixes touches money, identity, or operations and
**must** sit behind real auth + role checks before it is enabled for live
customers:

| Prefix                       | Why it must be protected                   |
| ---------------------------- | ------------------------------------------ |
| `/admin/*`                   | Approves intakes, edits business records   |
| `/billing/*`                 | Invoices, payment methods, payouts         |
| `/analytics/*`               | Aggregate revenue + customer data          |
| `/settings/integrations`     | API keys, webhook secrets                  |
| `/launch`                    | Toggles production behaviour               |
| `/api/sales-intake`          | Creates / mutates customer records         |
| `/api/sales-intake/:id`      | Mutates and reveals customer records       |

Today these routes are protected only by the demo gate. The repository layer
is already factored to make adding `getSession()` checks a one-line change in
each route handler.

---

## 4. Recommended auth providers

Pick **one** based on the deployment target:

| Provider | When it fits                                              |
| -------- | --------------------------------------------------------- |
| **NextAuth (Auth.js)** | Self-hosted on Vercel / Cloudflare; lots of OAuth providers. Cheapest. |
| **Clerk**  | SaaS sales motion; need polished hosted UIs / orgs / MFA fast. |
| **Entra External ID** | Enterprise customers expecting Microsoft tenant SSO. |
| **Supabase Auth** | Already using Supabase Postgres; want auth + DB in one bill. |

The repository, route handlers, and UI badge work unchanged regardless of
provider — only `middleware.ts` and a single `getCurrentUser()` helper need
to be added.

### Environment variables (already added to `.env.example`)

```env
AUTH_PROVIDER="demo"   # demo | nextauth | clerk | entra | supabase
NEXTAUTH_SECRET=""     # openssl rand -base64 32
NEXTAUTH_URL=""        # https://app.whichway.live
```

When `AUTH_PROVIDER !== "demo"`, route handlers should require a session.

---

## 5. Roles

Initial role model (stored on the user, not the intake):

| Role         | Capabilities                                                        |
| ------------ | ------------------------------------------------------------------- |
| `admin`      | Everything: approve, reject, edit, delete, export                   |
| `sales_rep`  | Create + view their own intakes; submit proposals                   |
| `operator`   | View approved intakes; manage venue / fulfillment data              |
| `viewer`     | Read-only across analytics + intake queue (no PII like full email)  |

The `AdminReviewEvent` table already stores `actorId` + `actorEmail` so
every status change is attributable once auth is wired in.

---

## 6. Database tables added in Phase 5

| Table                | Purpose                                          | PII risk |
| -------------------- | ------------------------------------------------ | -------- |
| `SalesIntake`        | Business intake form submissions                 | Medium   |
| `BusinessContact`    | Additional contacts per intake                   | Medium   |
| `SalesProposal`      | Generated proposal artifacts                     | Low      |
| `AdminReviewEvent`   | Audit trail of admin actions                     | Low      |

`SalesIntake.einLastFour` is the **only** EIN-derived data that ever hits
the database. Storing the full EIN requires:

1. Encrypted-at-rest column (e.g. `pgcrypto` or app-layer AES-GCM).
2. KMS-managed key (Azure Key Vault / AWS KMS / Cloudflare).
3. Customer disclosure + ToS update.
4. SOC2-aware access logs.

Until all four are in place, the API will continue to **reject** full EINs
and only persist the last 4 digits.

---

## 7. Migration steps to enable production auth (when ready)

1. Choose provider (see §4) and add server SDK + `app/api/auth/[...auth]`.
2. Add `getCurrentUser()` helper in `src/lib/auth/session.ts`.
3. Wrap each protected route prefix in middleware:
   - if `AUTH_PROVIDER === "demo"` → fall back to demo gate (today's behaviour).
   - else → require a real session and matching role.
4. In `/api/sales-intake/:id` `PATCH`, replace the `actor: undefined` arg
   with `{ id: session.user.id, email: session.user.email }`.
5. Add `User` + `Role` Prisma models and migrate.
6. Move full-EIN storage behind a feature flag + encrypted column.
7. Run a security review focused on:
   - Cookie attributes (`Secure`, `HttpOnly`, `SameSite=Lax`).
   - CSRF on mutating routes.
   - Rate limiting on `/api/sales-intake` POST.
   - Audit-log retention policy.

---

## 8. What to communicate to customers in the meantime

> "The platform is in a controlled demo phase. We do not yet store real EINs,
> tax IDs, or payment credentials. All admin views are protected by an access
> code, not per-user authentication. Production rollout — including SSO,
> role-based access, encrypted PII, and SOC2-aligned audit logs — is in active
> development and tracked in `docs/AUTH_AND_DATABASE_PRODUCTION_PLAN.md`."
