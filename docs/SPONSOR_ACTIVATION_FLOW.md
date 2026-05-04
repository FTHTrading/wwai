# Sponsor Activation Flow

## Overview
A sponsor moves through a structured funnel: inquiry → CRM entry → package assignment → campaign launch → performance reporting.

## Step-by-Step Flow

### 1. Inquiry Capture
- Sponsor submits form at `/contact?type=sponsor`
- Form collects: name, email, phone, company, estimated budget, message
- POST to `/api/leads` with `type: "sponsor"`, `source: "web"`
- Lead created in DB with `status: "new"`

### 2. CRM Assignment
- Sales team reviews lead in `/analytics` (Leads tab)
- Rep updates lead status: `new → contacted → qualified → proposal → closed_won`
- PATCH `/api/leads` with `{ id, status }`
- If qualified: rep creates Sponsor record via PATCH `/api/sponsors` or direct DB

### 3. Sponsor Onboarding
- POST `/api/sponsors` with:
  ```json
  {
    "name": "Brand Name",
    "contactName": "Jane Smith",
    "contactEmail": "jane@brand.com",
    "contactPhone": "+14045550100",
    "package": "champion",
    "budget": 50000,
    "industry": "beverage"
  }
  ```
- Status defaults to `prospect`, updated to `active` on contract sign

### 4. Package Tiers
| Package | Label | Typical Budget |
|---------|-------|----------------|
| `smart_placement` | Smart Placement | $5K–$15K |
| `fan_engagement` | Fan Engagement | $15K–$30K |
| `champion` | Champion | $30K–$75K |
| `rewards_engine` | Rewards Engine | $75K+ |

### 5. Campaign Launch
- Create campaign: POST `/api/campaigns`
  ```json
  {
    "name": "Brand Summer Activation",
    "sponsorId": "<uuid>",
    "venueId": "<uuid>",
    "type": "qr",
    "startDate": "2026-06-01",
    "endDate": "2026-08-31",
    "budget": 50000
  }
  ```
- Add QR codes via `/api/campaigns/[id]` (extend as needed)

### 6. Performance Reporting
- Live in `/analytics` → Campaigns tab
- Metrics tracked: impressions, clicks, redemptions, QR scan events
- All `QrEvent` records are immutable audit trail
- Revenue intelligence available via `/api/stats`

## Status Reference
| Status | Meaning |
|--------|---------|
| `prospect` | Identified, not yet contracted |
| `onboarded` | Contract signed, setup in progress |
| `active` | Live campaigns running |
| `inactive` | Paused or churned |
