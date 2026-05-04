# TROPTIONS™ Sales Team Demo Script

Use this script when demoing the platform to a sponsor, investor, or venue partner.
Each section covers what to say and what to click.

---

## Before You Start

1. Open `http://localhost:3000` (dev) or the production URL
2. Have the seed data loaded (`npx prisma db seed`)
3. Open the platform in a full-screen browser tab
4. Have this script open on a second screen or printed

---

## Part 1 — Homepage (90 seconds)

**Navigate to:** `/`

**Say:**
> "This is the TROPTIONS Sales Operating System. It handles everything from the first sponsor conversation to the paid invoice. Let me walk you through it."

**Point out:**
- The STATS bar at the top: 52 routes, 5 tiers, 100% QR attribution, 7-day activation
- The 7-step sales flow cards
- The 6 capability cards at the bottom
- The CTAs: View Packages, Demo Flow, Build a Proposal

---

## Part 2 — Packages & Pricing (2 minutes)

**Navigate to:** `/pricing`

**Say:**
> "We have five sponsor tiers. Local Venue at $2,500/month is great for regional brands at one or two venues. Category Sponsor at $7,500 gives you exclusive category ownership. City Activation at $18,000 runs across an entire city during a major event. World Cup at $45,000 is our flagship — 100 QR zones, 20+ venues. Enterprise is fully custom."

**Point out:**
- The "Featured" badges on City Activation and World Cup
- The "Enterprise" badge on the top tier
- The feature list checkmarks on each card
- The CTA buttons at the bottom ("Get Started" on each package)
- The add-ons section below the cards
- The FAQ section

---

## Part 3 — Venue Map (2 minutes)

**Navigate to:** `/map`

**Say:**
> "Every activation happens at a physical location. We call these venues. Right now you can see [count] venues pinned on the map. Each pin color represents a category — stadium, airport, transit hub, hotel, university, or retail."

**Click any pin:**
> "This is [venue name]. You can see it's a [category] in [city]. It has [count] active campaigns running right now."

**Click the venue link:**
> "Inside the venue, you see all its campaigns, QR code activity, and any proposals that include this location."

---

## Part 4 — Campaign Detail (2 minutes)

**Navigate to:** `/campaigns` → click any campaign

**Say:**
> "A campaign is the bridge between a sponsor and a venue. This campaign is running for [sponsor name] at [venue name]. It started [date] and runs until [date]."

**Click QR Codes tab:**
> "These are the activation codes deployed at this venue. Every time someone scans one of these codes, it's logged. You can see total scans and redemptions per code."

**Click Performance tab:**
> "This is the conversion funnel. [X] impressions, [Y] clicks, [Z] redemptions. That's a [%] conversion rate."

---

## Part 5 — Proposal Generator (3 minutes)

**Navigate to:** `/proposals`

**Click "+ New Proposal"**

**Say:**
> "Let me build a proposal right now. I'll select a sponsor, a package, and a venue."

**Select:**
- Sponsor: any from the list
- Package: "City Activation — $18,000/mo"
- Venue: any from the list
- Campaign Type: QR
- Term: 12 months

**Watch the preview card update:**
> "The contract value calculator updates in real time. 12 months × $18,000 + $7,000 setup fee = $223,000 total contract value. Here are all the included services from that package. When I hit Create, this proposal is saved with status 'draft'. We move it to 'sent' when we email it to the sponsor."

**Create the proposal.**

**Point out the new card in the list.**

---

## Part 6 — Analytics (2 minutes)

**Navigate to:** `/analytics`

**Say:**
> "The analytics dashboard pulls real numbers from the database. You're looking at [X] active sponsors, [$Y] in sponsor revenue, [Z] QR scans, and [N] redemptions."

**Click through tabs:**
- Sponsors tab: "Every sponsor's revenue and campaign count"
- Campaigns tab: "Every campaign's performance in one table"
- Leads tab: "Lead pipeline. Export to CSV for your CRM."

---

## Part 7 — Billing (2 minutes)

**Navigate to:** `/billing`

**Say:**
> "Once a proposal is accepted, we issue an invoice. This is our billing dashboard. [$X] total invoiced, [$Y] collected, [$Z] awaiting payment."

**Point out:**
- The filter bar: filter by draft, sent, paid, overdue
- The CSV export button
- The payment provider panel at the bottom

**Say:**
> "We support Square and Stripe when you configure the API keys. Manual payment tracking — checks, wire, TROPTIONS — is always available regardless."

---

## Closing

**Navigate to:** `/case-studies`

**Say:**
> "Here are three illustrated scenarios to give you a sense of what results look like at scale. These are demo scenarios — but they're built on real activation mechanics. The Local Venue scenario shows a 26% conversion rate. The citywide World Cup activation ran across 8 venues with a 4.2x ROI. The premium brand program had 290,000 scans and drove 41,000 app downloads."

**Final:**
> "The platform is fully operational. Database, QR engine, analytics, proposals, billing — all live. We can have your first sponsor active in 7 days. What package is the best fit to start?"

---

## Quick Reference — Routes

| Page | URL | Best For |
|---|---|---|
| Homepage | `/` | Opening/overview |
| Pricing | `/pricing` | Package selection |
| Map | `/map` | Venue visual |
| Campaigns | `/campaigns` | QR demo |
| Proposals | `/proposals` | Live contract value demo |
| Analytics | `/analytics` | KPI dashboard |
| Billing | `/billing` | Revenue/invoice overview |
| Case Studies | `/case-studies` | Credibility/benchmarks |
| Demo | `/demo` | Quick full walkthrough |
| Dashboard | `/dashboard` | Daily ops view |
