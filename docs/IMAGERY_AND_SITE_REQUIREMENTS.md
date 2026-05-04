# TROPTIONS Imagery and Site Requirements

**Document version:** Phase 7 (2025)
**Platform:** TROPTIONS Growth Platform — `troptionslive.unykorn.org`

---

## 1. Design Identity

### Color System
| Token             | Hex       | Usage                                       |
|-------------------|-----------|---------------------------------------------|
| Background        | `#050810` | Base page background, deepest dark          |
| Card background   | `#0a0f1e` | All panel / card backgrounds                |
| Border            | `#162035` | Subtle borders, dividers                    |
| Cyan electric     | `#00d4ff` | Primary accent, live indicators, CTAs       |
| Gold premium      | `#d4a017` | Sponsor tier, premium markers               |
| Gold bright       | `#FFD700` | Gradient end for gold fills                 |
| Text primary      | `#f1f5f9` (slate-100) | Body copy                     |
| Text secondary    | `#64748b` (slate-500) | Labels, meta text             |

### Typography
- **Font:** Inter (via Next.js Google Fonts)
- **Headings:** `font-black` weight, tight leading
- **Metrics / data:** Monospace feel via `font-mono` or tightly-spaced `font-black`
- **Vibe:** Clean institutional, command-center, not casual/template
- **No emojis** in any premium-tier section (hero, stats, nav, module cards)

### UI Component Style
- Dark glass panels (`card-dark` class: `bg-[#0a0f1e] border border-[#162035] rounded-2xl`)
- Cyan glow cards: `border-[#00d4ff]/20 shadow-[0_0_40px_rgba(0,212,255,0.07)]`
- Gold glow cards: `border-[#d4a017]/20 shadow-[0_0_40px_rgba(212,160,23,0.07)]`
- HUD module badges (Live, Beta, Planned): small uppercase tracking-widest pills
- No rounded-full on primary action buttons — use `rounded-xl`
- Cinematic night / city / stadium atmosphere via `city-bg-glow` overlay class

---

## 2. Imagery Policy

### 2.1 Public Pages — Rights-Safe Imagery Only

**RULE:**
> Reference images containing Tap FIFA, FIFA, Mercedes-Benz Stadium, team logos,
> athlete likenesses, or other protected third-party marks **must not** be shipped
> as public TROPTIONS assets unless legal rights are confirmed or all protected marks
> are removed/replaced.

Public-facing pages (homepage, pricing, demo, case studies, map, proposals, sponsors,
marketing collateral) must use only:
- TROPTIONS-branded imagery
- Generic stadium / city / crowd photography cleared for commercial use
- Abstract cinematic dark imagery (night city, lighting grids, venue silhouettes)
- Platform-generated UI screenshots without third-party marks

### 2.2 Reference Image Library (Internal Use)

Located at `public/images/troptions/reference/`.
These are internal design references only — do **not** serve them on public routes.

| File                            | Contents                                      | Status          |
|---------------------------------|-----------------------------------------------|-----------------|
| `sales-kit-reference.png`       | Sponsor packages, audience profiles           | Internal only   |
| `event-icons-reference.png`     | Premium HUD module icon system                | Internal only   |
| `safety-ops-map-reference.png`  | Venue/safety/zone ops map design              | Internal only   |
| `architecture-flow-reference.png` | Platform flow architecture diagram          | Internal only   |
| `platform-ecosystem-reference.png` | 5-module ecosystem diagram                 | Internal only   |
| `media-studio-reference.png`    | Creative asset rendering system               | Internal only   |

### 2.3 How to Use Reference Images

1. Use them as visual direction for building platform UI components
2. Derive color choices, layout patterns, and icon iconography from them
3. Never hardcode a protected brand name in any component filename, alt text, or JSX
4. When creating new imagery inspired by these references, produce original TROPTIONS-branded versions

---

## 3. Platform Identity Language

### Approved Platform Names
- **TROPTIONS™ Growth Platform** — primary product name
- **TROPTIONS™ Event OS** — alternate positioning
- **Powered by Apostle Chain** — blockchain infrastructure credit

### Approved Taglines
- "One System. One Brand. Unlimited Scale."
- "Activate sponsors. Drive engagement. Capture revenue."
- "One city. One crowd. One revenue operating system."

### Prohibited on Public Pages
- Any specific third-party venue name with associated trademark (unless licensed)
- Player names, team names, league logos
- References to specific protected events by official marks
- "Tap FIFA" or any FIFA-variant branding

---

## 4. Component Inventory

### Reusable Components (`src/components/`)
| Component                  | Purpose                                                         |
|----------------------------|-----------------------------------------------------------------|
| `TroptionsImagePanel`      | Dark glass image wrapper with glow border, badge, CTA          |
| `TroptionsHeroVisual`      | Cinematic hero panel with live metrics HUD                     |
| `TroptionsSystemCard`      | Platform module card (icon, title, desc, status badge, link)   |
| `TroptionsIconCard`        | HUD-style icon module card (arrival, language, safety, etc.)   |
| `BrandDisclaimer`          | TROPTIONS™ mark disclaimer (required on homepage CTA)          |

### CSS Utility Classes (`src/app/globals.css`)
| Class                   | Description                                    |
|-------------------------|------------------------------------------------|
| `.troptions-hero-brand` | Cinematic gradient headline (cyan → white)     |
| `.troptions-hero-subtitle` | Subtitle below hero brand                  |
| `.btn-troptions`        | Primary CTA button (cyan fill)                 |
| `.pill-gold`            | Gold pill badge                                |
| `.pill-cyan`            | Cyan pill badge                                |
| `.card-dark`            | Standard dark panel                            |
| `.card-dark-hover`      | Dark panel with hover glow                     |
| `.stat-card`            | Stats display panel                            |
| `.stat-big`             | Large stat number                              |
| `.city-bg-glow`         | Cinematic background glow overlay              |
| `.troptions-hex`        | Hexagonal icon/avatar (large)                  |
| `.troptions-hex-sm`     | Hexagonal icon/avatar (small, for nav)         |
| `.nav-glass`            | Sticky nav with glass blur effect              |
| `.gradient-cyan`        | Cyan gradient text treatment                   |

---

## 5. Page-Level Design Requirements

### Homepage (`/`)
- Full Growth Platform framing — NOT "Sales Operating System"
- Live HUD panel with simulated metrics in hero
- 8 platform module cards
- 7-step activation flow
- 5-console ecosystem section
- Live Offers / Rewards Wallet / POS Revenue HUD panels
- 12-module icon system grid
- No emojis anywhere

### Navigation
Primary nav: Market · Options · Cards · Map · Sponsors · Sales · Wallet · Dashboard
Mobile nav: Home · Map · Sales · Sponsors · Dashboard (text labels only, no emojis)

### `/demo`
- Visual progress stepper above step list
- Each step has "Live" status badge
- Links to all live platform pages

### `/case-studies`
- Color-coded metrics by sponsor tier (gold / cyan)
- "Demo Scenario" badge on every case
- No real event venue trademarks

### `/map`
- Operational status strip (venue count, campaign count, QR zones, sponsor activations)
- Zone legend cards (Sponsor Zones/gold, Service Nodes/cyan, Safety Corridors/green)
- MapLibre real map preserved

### `/pricing`
- Featured tier: full cyan glow border + "FEATURED" badge
- Enterprise tier: gold border + "ENTERPRISE" badge + "Request Consultation" CTA
- No emojis in feature/trust section (use text icon chips instead)

### `/proposals`
- Proposal preview card with live contract value calculation
- "PDF Export: Coming Soon" note (no fake functionality)
- No emoji in empty state (use hexagonal icon instead)

---

## 6. Development Guidelines

### Build Requirements
- `npm run lint` must pass with 0 warnings, 0 errors
- `npm run build` must produce no TypeScript or build errors
- Expected route count: 60+ (was 58 before Phase 7)

### Security
- No `dangerouslySetInnerHTML` without sanitization
- No user-controlled content rendered as HTML
- All external links use `rel="noopener noreferrer"`
- No API keys or secrets in client-side code

### Performance
- All images use Next.js `<Image>` component with explicit `width` and `height`
- Static pages use `export const metadata` (no `"use client"` unless required)
- Dynamic pages use `"use client"` + `useEffect` for data fetching

---

*Last updated: Phase 7 implementation — TROPTIONS Growth Platform visual system*
