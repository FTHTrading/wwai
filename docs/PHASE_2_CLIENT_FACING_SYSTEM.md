# Phase 2 Client-Facing System

## Overview
Phase 2 transforms the TROPTIONS platform from a branded front-end into a full Sales Operating System backed by a live database, real API routes, and production-grade UI flows.

## What Was Built

### Data Layer (Prisma + SQLite)
| Model | Purpose |
|-------|---------|
| `Sponsor` | Sponsor CRM — contacts, packages, status, budget |
| `Venue` | Venue registry — address, capacity, category, contacts |
| `Campaign` | Campaign engine — links sponsors + venues, tracks impressions/redemptions |
| `QrCode` | Per-campaign QR codes with offers and reward values |
| `QrEvent` | Immutable scan/redeem audit trail with hashed IP |
| `Lead` | Lead capture CRM — source, status, estimated value |

Migration: `20260504152024_phase2_sponsor_venue_campaign_qr_lead`

### API Routes
| Route | Methods | Description |
|-------|---------|-------------|
| `/api/sponsors` | GET, POST | List / create sponsors |
| `/api/sponsors/[id]` | GET, PATCH | Get / update sponsor |
| `/api/venues` | GET, POST | List / create venues |
| `/api/venues/[id]` | GET, PATCH | Get / update venue |
| `/api/leads` | GET, POST, PATCH | List / create / update lead status |
| `/api/campaigns` | GET, POST | List / create campaigns |
| `/api/campaigns/[id]` | GET | Campaign detail |
| `/api/qr/[code]` | GET, POST | Scan record + offer display / Redemption |
| `/api/stats` | GET | Extended platform stats (15+ fields) |

### Pages
| Route | Description |
|-------|-------------|
| `/venues` | Venue list + onboarding form |
| `/campaigns` | Campaign list + creation form |
| `/analytics` | Full analytics dashboard with KPIs and pipeline view |
| `/contact` | Lead capture form (4 inquiry types) |
| `/about` | Institutional brand page with timeline |
| `/qr/[code]` | Mobile QR redemption experience |

### Connected Flows
- **Sales page**: leads tab fetches from `/api/leads` (live DB)
- **Campaigns form**: loads sponsor + venue dropdowns from real DB
- **Analytics**: parallel fetches from 4 endpoints, KPI grid, 4 tabs

## Technology Decisions
- **SQLite (libsql)**: zero-ops storage, appropriate for early-stage; swap to Postgres via one Prisma env var
- **IP hashing**: SHA-256 hashed IP stored in `QrEvent` — no PII stored
- **No MapBox key required**: venues page works without map tiles; MapContainer component acts as graceful fallback
- **Tailwind v4**: all custom design tokens via CSS, no config file

## Security Notes
- QR scan: checks `active` flag and `expiresAt` before recording event
- IP privacy: raw IP never stored, only SHA-256 hash
- Lead capture: email + name validated server-side before DB write
- All API routes use `NextResponse.json` with proper status codes
