# CRM Integration Model

## Overview

TROPTIONS uses a provider-first CRM abstraction in `src/lib/crm.ts`. One CRM provider is active at a time, selected by which env vars are present. Manual CSV export is always available as the fallback.

## Provider Priority

1. **Zoho CRM** — if `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, and `ZOHO_REFRESH_TOKEN` are all set
2. **HubSpot** — if `HUBSPOT_ACCESS_TOKEN` is set
3. **Airtable** — if `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are both set
4. **Manual** — always available; no configuration required

## Functions

### `pushLeadToCRM(contact: CRMContact): Promise<CRMPushResult>`

Routes to the first configured provider. Safe to call at any time — if no provider is configured, returns `mode: "manual"` and `ok: true`.

### `getActiveCRMProvider(): CRMProvider`

Returns `"zoho" | "hubspot" | "airtable" | "manual"` based on which env vars are present.

### `getCRMProviderStatus()`

Returns readiness objects for all four providers. Safe to return in API responses (no secret values).

### `leadsToCSV(leads: LeadCSVRow[]): string`

Generates a CSV string from lead rows. Used by `/api/leads/export`.

## Implementing a Live CRM Push

Each provider has a placeholder implementation slot in `src/lib/crm.ts`. Look for the comment block starting with `// Real [Provider] integration:` and implement it there.

### Zoho Example (outline)

```typescript
// 1. Refresh token
const tokenRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
  method: "POST",
  body: new URLSearchParams({
    client_id:     process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    grant_type:    "refresh_token",
  }),
});
const { access_token } = await tokenRes.json();

// 2. Create lead
const leadRes = await fetch("https://www.zohoapis.com/crm/v6/Leads", {
  method: "POST",
  headers: { Authorization: `Zoho-oauthtoken ${access_token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ data: [{ Last_Name: contact.name, Email: contact.email, ... }] }),
});
const result = await leadRes.json();
return { ok: true, provider: "zoho", externalId: result.data[0].details.id, error: null, mode: "live" };
```

### HubSpot Example (outline)

```typescript
const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ properties: { email: contact.email, firstname: contact.name, company: contact.company } }),
});
const data = await res.json();
return { ok: true, provider: "hubspot", externalId: data.id, error: null, mode: "live" };
```

## CSV Export

`GET /api/leads/export` returns all leads as a timestamped CSV file. This is the "manual CRM" — always ready without any configuration.

Fields exported: Lead ID, Name, Email, Company, Phone, Type, Status, Source, Estimated Value, Created Date

## Lead Push Integration Point

To automatically push new leads to the CRM when they are created, add this to `src/app/api/leads/route.ts` after the Prisma insert:

```typescript
import { pushLeadToCRM, buildLeadCSVRow } from "@/lib/crm";

// After prisma.lead.create(...)
await pushLeadToCRM({
  id:           newLead.id,
  name:         newLead.name,
  email:        newLead.email ?? undefined,
  company:      newLead.company ?? undefined,
  phone:        newLead.phone ?? undefined,
  leadType:     newLead.type,
  leadStatus:   newLead.status,
  leadSource:   newLead.source,
  estimatedValue: newLead.estimatedValue ?? undefined,
});
```
