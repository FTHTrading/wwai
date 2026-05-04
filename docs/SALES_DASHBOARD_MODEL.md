# Sales Dashboard Model

## Overview
The Sales Engine (`/sales`) is a four-tab operating center for TROPTIONS sales reps and operators. All leads are DB-backed. Comms and payments integrate with real third-party APIs.

## Tabs

### 1. Lead Tracker
- **Data**: Live from `/api/leads` (Prisma `Lead` model)
- **Status flow**: `new → contacted → qualified → proposal → closed_won | closed_lost`
- **Actions per lead**:
  - 📞 Call → pre-fills phone in Comms tab
  - 💬 SMS → pre-fills phone in Comms tab
  - 💳 Pay → pre-fills description in Payment tab
- **New lead capture**: `/contact` page → POST `/api/leads`

### 2. Sales Team
- **Data**: Currently static (REPS array)
- **Fields**: name, territory, deals closed, commission earned, status
- **Planned DB extension**: `SalesRep` model with `Lead[]` relation
- **Payout flow**: Approve Payout button → trigger Square payout API

### 3. Telnyx Comms
- **Click-to-Call**: POST `/api/sales/call` → Telnyx REST v2
  - Routes via TROPTIONS vanity number
  - `to` = destination phone, `from` = `TELNYX_FROM_NUMBER` env var
- **SMS**: POST `/api/sales/sms` → Telnyx SMS API
  - 160-char limit enforced in UI
  - Pre-populated templates for sponsor outreach
- **Required env vars**:
  ```
  TELNYX_API_KEY=
  TELNYX_FROM_NUMBER=
  ```

### 4. Square Payments
- **Payment link generation**: POST `/api/sales/payment`
  - Body: `{ amount: number, description: string }`
  - Returns: `{ url: string, orderId: string }`
- **Integration**: Square Orders API → hosted checkout page
- **Required env vars**:
  ```
  SQUARE_ACCESS_TOKEN=
  SQUARE_LOCATION_ID=
  ```

## KPI Bar (Static / Placeholder)
The top KPI bar shows 4 metrics. These should be connected to `/api/stats` in a future iteration to show live data:
- Total Deals
- Total Commissions
- Payouts Processed
- Pending Payouts

## Lead Status Color Reference
| Status | Color |
|--------|-------|
| `new` / `hot` | Red (urgent) |
| `contacted` / `warm` | Yellow (engaged) |
| `qualified` / `cold` | Gray |
| `closed_won` | Green |
| `closed_lost` | Dark gray |
