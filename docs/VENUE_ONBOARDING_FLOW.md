# Venue Onboarding Flow

## Overview
Venues are activation points. Every stadium, hotel, transit hub, or entertainment zone in the TROPTIONS network can host sponsored QR campaigns, offer redemptions, and fan engagement programs.

## Onboarding Steps

### 1. Venue Discovery / Inquiry
- Venue operator submits form at `/contact?type=venue`
- Or sales rep submits directly via `/venues` page → "Add Venue" form
- Required: name, city
- Optional: address, category, capacity, contact name/email/phone, notes

### 2. Create Venue Record
POST `/api/venues`:
```json
{
  "name": "Mercedes-Benz Stadium",
  "address": "1 AMB Drive NW",
  "city": "Atlanta",
  "lat": 33.7554,
  "lng": -84.4009,
  "category": "stadium",
  "capacity": 71000,
  "contactName": "Ops Director",
  "contactEmail": "ops@mbs.com",
  "contactPhone": "+14045550100"
}
```

### 3. Status Lifecycle
| Status | Meaning |
|--------|---------|
| `prospect` | Identified, not yet committed |
| `onboarded` | Agreement signed, integration in progress |
| `active` | Live — campaigns running at this location |
| `inactive` | Paused |

PATCH `/api/venues/[id]` to advance status.

### 4. Attach to Campaigns
Once a venue is `active`:
- Create campaigns that reference `venueId`
- QR codes are generated per campaign
- Scan events recorded with venue context

### 5. Location Data
- `lat` / `lng` fields support map pin rendering
- Used by the Live Ops map (`/map`) to show active venues
- Category used for map icon differentiation

## Category Reference
| Category | Icon Context |
|----------|-------------|
| `stadium` | Major events, highest foot traffic |
| `hotel` | Hospitality programs, concierge activations |
| `transit` | Commuter touchpoints, daily reach |
| `entertainment` | Concerts, shows, recurring activation |
| `food` | F&B promotions, coupon-based redemptions |
| `retail` | POS activations, loyalty programs |
| `general` | Catch-all |

## Map Integration
The `/map` page and `MapContainer` component consume venue data from `/api/venues`. The component degrades gracefully to a venue list if no map provider key is configured.

To enable live map tiles, set `NEXT_PUBLIC_MAP_PROVIDER=maplibre` (or `mapbox`) in `.env.local`.
