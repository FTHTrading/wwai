// Demo data — TROPTIONS + WWAI
// All entries are illustrative. Not affiliated with any protected brand.

import type { Agent, Campaign, PackageItem, Place, Sponsor } from "@/lib/types";

// ── Hotels ─────────────────────────────────────────────────────────────────
export const HOTELS: Place[] = [
  { id: "h1", name: "Downtown Grand Hotel",     category: "hotel", type: "Hotel", zone: "Downtown",   distanceMiles: 0.4, walkMinutes: 8,  driveMinutes: 3, shuttleMinutes: 5,  verified: true,  safetyNote: "Operator-reviewed corridor",   coords: { lat: 33.7490, lng: -84.3880 } },
  { id: "h2", name: "Centennial Stay Suites",   category: "hotel", type: "Hotel", zone: "Centennial", distanceMiles: 0.7, walkMinutes: 14, driveMinutes: 4, shuttleMinutes: 7,  verified: true,  safetyNote: "Recommended public corridor",  coords: { lat: 33.7626, lng: -84.3939 } },
  { id: "h3", name: "Midtown Business Hotel",   category: "hotel", type: "Hotel", zone: "Midtown",    distanceMiles: 1.8, walkMinutes: 36, driveMinutes: 7, shuttleMinutes: 12, verified: true,  safetyNote: "Shuttle pickup verified",        coords: { lat: 33.7831, lng: -84.3831 } },
  { id: "h4", name: "Airport Arrival Hotel",    category: "hotel", type: "Hotel", zone: "Airport",    distanceMiles: 7.5, walkMinutes: 0,  driveMinutes: 18, shuttleMinutes: 35, verified: true,  safetyNote: "Airport transit hub",            coords: { lat: 33.6407, lng: -84.4277 } },
  { id: "h5", name: "Westside Event Hotel",     category: "hotel", type: "Hotel", zone: "Westside",   distanceMiles: 1.1, walkMinutes: 22, driveMinutes: 5, shuttleMinutes: 9,  verified: true,  safetyNote: "Operator-reviewed corridor",   coords: { lat: 33.7715, lng: -84.4116 } },
  { id: "h6", name: "Buckhead Premium Hotel",   category: "hotel", type: "Hotel", zone: "Buckhead",   distanceMiles: 3.2, walkMinutes: 0,  driveMinutes: 10, shuttleMinutes: 18, verified: true,  safetyNote: "Premium concierge route",       coords: { lat: 33.8487, lng: -84.3733 } },
];

// ── Restaurants ────────────────────────────────────────────────────────────
export const RESTAURANTS: Place[] = [
  { id: "r1", name: "Peach Street Grill",       category: "restaurant", type: "Restaurant", cuisine: "Southern", zone: "Downtown",   distanceMiles: 0.2, walkMinutes: 4,  driveMinutes: 2, verified: true,  priceLevel: 2, offer: "10% off w/ QR",     coords: { lat: 33.7505, lng: -84.3870 } },
  { id: "r2", name: "Centennial Tacos",         category: "restaurant", type: "Restaurant", cuisine: "Mexican",  zone: "Centennial", distanceMiles: 0.4, walkMinutes: 8,  driveMinutes: 2, verified: true,  priceLevel: 1, offer: "Free chips w/ entrée", coords: { lat: 33.7610, lng: -84.3925 } },
  { id: "r3", name: "Midtown Pasta House",      category: "restaurant", type: "Restaurant", cuisine: "Italian",  zone: "Midtown",    distanceMiles: 1.1, walkMinutes: 22, driveMinutes: 5, verified: true,  priceLevel: 3 },
  { id: "r4", name: "Westside BBQ Kitchen",     category: "restaurant", type: "Restaurant", cuisine: "BBQ",      zone: "Westside",   distanceMiles: 0.7, walkMinutes: 14, driveMinutes: 3, verified: true,  priceLevel: 2, offer: "Family meal — 15% off" },
  { id: "r5", name: "Southern Bowl Market",     category: "restaurant", type: "Restaurant", cuisine: "Bowls",    zone: "Downtown",   distanceMiles: 0.3, walkMinutes: 6,  driveMinutes: 2, verified: true,  priceLevel: 2 },
  { id: "r6", name: "Global Street Eats",       category: "restaurant", type: "Restaurant", cuisine: "Global",   zone: "Centennial", distanceMiles: 0.5, walkMinutes: 10, driveMinutes: 3, verified: false, priceLevel: 1 },
  { id: "r7", name: "Family Pizza Hall",        category: "restaurant", type: "Restaurant", cuisine: "Pizza",    zone: "Westside",   distanceMiles: 0.9, walkMinutes: 18, driveMinutes: 4, verified: true,  priceLevel: 1, offer: "Kids eat free Tuesday" },
  { id: "r8", name: "Airport Breakfast Cafe",   category: "restaurant", type: "Restaurant", cuisine: "Cafe",     zone: "Airport",    distanceMiles: 7.5, walkMinutes: 0,  driveMinutes: 18, verified: true,  priceLevel: 2 },
];

// ── Bars ───────────────────────────────────────────────────────────────────
export const BARS: Place[] = [
  { id: "b1", name: "Downtown Sports Lounge",   category: "bar", type: "Sports Bar",      zone: "Downtown",   distanceMiles: 0.3, walkMinutes: 6,  driveMinutes: 2, verified: true,  ageRestricted: true, openLate: true,  safetyNote: "Late-night pickup zone available" },
  { id: "b2", name: "Westside Social Bar",      category: "bar", type: "Cocktail Bar",    zone: "Westside",   distanceMiles: 0.8, walkMinutes: 16, driveMinutes: 4, verified: true,  ageRestricted: true, openLate: true },
  { id: "b3", name: "Midtown Rooftop Lounge",   category: "bar", type: "Rooftop",         zone: "Midtown",    distanceMiles: 1.4, walkMinutes: 28, driveMinutes: 6, verified: true,  ageRestricted: true, openLate: true },
  { id: "b4", name: "Centennial Night House",   category: "bar", type: "Music Bar",       zone: "Centennial", distanceMiles: 0.6, walkMinutes: 12, driveMinutes: 3, verified: false, ageRestricted: true, openLate: true },
  { id: "b5", name: "Buckhead Premium Lounge",  category: "bar", type: "Premium Lounge",  zone: "Buckhead",   distanceMiles: 3.2, walkMinutes: 0,  driveMinutes: 10, verified: true, ageRestricted: true, openLate: true },
];

// ── Transportation ─────────────────────────────────────────────────────────
export const TRANSPORT: Place[] = [
  { id: "t1", name: "Hotel Shuttle Zone A",       category: "transport", type: "Shuttle Pickup",  zone: "Downtown",  distanceMiles: 0.1, walkMinutes: 2,  driveMinutes: 1, verified: true, safetyNote: "Operator-staffed pickup" },
  { id: "t2", name: "Driver Pickup Zone B",       category: "transport", type: "Driver Pickup",   zone: "Westside",  distanceMiles: 0.4, walkMinutes: 8,  driveMinutes: 2, verified: true, safetyNote: "Lit, monitored zone" },
  { id: "t3", name: "Rideshare Holding Zone C",   category: "transport", type: "Rideshare Hold",  zone: "Centennial",distanceMiles: 0.5, walkMinutes: 10, driveMinutes: 2, verified: true },
  { id: "t4", name: "Airport Transfer Hub",       category: "transport", type: "Transfer Hub",    zone: "Airport",   distanceMiles: 7.5, driveMinutes: 18, shuttleMinutes: 35, verified: true },
];

// ── Safety / support nodes ─────────────────────────────────────────────────
export const SAFETY_NODES: Place[] = [
  { id: "s1", name: "Guest Support Node",          category: "safety", type: "Support Booth",         zone: "Downtown",   distanceMiles: 0.2, walkMinutes: 4, verified: true, safetyNote: "Operator-staffed in production" },
  { id: "s2", name: "Family Reunification Point",  category: "safety", type: "Reunification",         zone: "Centennial", distanceMiles: 0.3, walkMinutes: 6, verified: true },
  { id: "s3", name: "Medical Support Node",        category: "safety", type: "Medical",               zone: "Downtown",   distanceMiles: 0.2, walkMinutes: 4, verified: true },
  { id: "s4", name: "Information Kiosk",           category: "safety", type: "Info",                  zone: "Westside",   distanceMiles: 0.4, walkMinutes: 8, verified: true },
];

export const ALL_PLACES: Place[] = [
  ...HOTELS, ...RESTAURANTS, ...BARS, ...TRANSPORT, ...SAFETY_NODES,
];

// ── Packages ───────────────────────────────────────────────────────────────
export const SPONSOR_PACKAGES: PackageItem[] = [
  { id: "sp1", name: "Local Sponsor",            category: "sponsor", price: 2500,    setupFee: 250,  bestFor: "Single-zone activation",        features: ["1 zone placement", "QR offer", "Listing"], tier: "starter" },
  { id: "sp2", name: "Category Sponsor",         category: "sponsor", price: 12000,   setupFee: 750,  bestFor: "Own a vertical (food, hotels)", features: ["Category exclusive", "All zones in category", "Premium badge"], tier: "standard" },
  { id: "sp3", name: "City Activation Sponsor",  category: "sponsor", price: 35000,   setupFee: 1500, bestFor: "Citywide presence",             features: ["All zones", "Map presence", "AI concierge tie-in"], tier: "premium", featured: true },
  { id: "sp4", name: "Premium Campaign Sponsor", category: "sponsor", price: 75000,   setupFee: 2500, bestFor: "Multi-campaign brands",         features: ["3 campaigns", "Hotel routes", "Premium analytics"], tier: "featured", featured: true },
  { id: "sp5", name: "Enterprise Partner",       category: "sponsor", price: 250000,  setupFee: 7500, bestFor: "National brands & networks",    features: ["Unlimited campaigns", "Dedicated AI agent", "Co-branded WWAI"], tier: "enterprise", featured: true },
];

export const MERCHANT_PACKAGES: PackageItem[] = [
  { id: "m1", name: "Verified Listing",                category: "merchant", price: 500,    bestFor: "Single-location merchants",          features: ["Verified badge", "Map listing"], tier: "starter" },
  { id: "m2", name: "Enhanced Profile",                category: "merchant", price: 1250,   bestFor: "Restaurants & bars",                  features: ["Photos", "Hours", "Multilingual"], tier: "standard" },
  { id: "m3", name: "Premium Placement",               category: "merchant", price: 2500,   bestFor: "High-traffic zones",                  features: ["Top placement", "Featured tag", "QR offer"], tier: "premium" },
  { id: "m4", name: "Featured QR Offer Campaign",      category: "merchant", price: 7500,   bestFor: "Offer-driven brands",                 features: ["Campaign engine", "Redemptions", "Reporting"], tier: "featured", featured: true },
  { id: "m5", name: "Category / Main Area Sponsor",    category: "merchant", price: 50000,  bestFor: "Anchor merchants",                    features: ["Zone exclusivity", "Map sponsor pin", "AI mention priority"], tier: "enterprise", featured: true },
];

export const HOTEL_PACKAGES: PackageItem[] = [
  { id: "ho1", name: "Hotel Listing",            category: "hotel",  price: 750,    bestFor: "Independent hotels",          features: ["Map listing", "Verified badge"], tier: "starter" },
  { id: "ho2", name: "Guest Route Package",      category: "hotel",  price: 2500,   bestFor: "Hotels guiding guests",       features: ["Hotel→seat routes", "Return routes", "Pickup zones"], tier: "standard" },
  { id: "ho3", name: "Concierge Integration",    category: "hotel",  price: 7500,   bestFor: "Full-service hotels",         features: ["AI concierge", "Multilingual", "Branded cards"], tier: "premium", featured: true },
  { id: "ho4", name: "Premium Hotel Partner",    category: "hotel",  price: 25000,  bestFor: "Flagship properties",         features: ["Priority placement", "Dedicated agent", "Sponsor co-marketing"], tier: "featured", featured: true },
];

export const DRIVER_PACKAGES: PackageItem[] = [
  { id: "d1", name: "Verified Driver Listing",            category: "driver", price: 250,   bestFor: "Independent drivers",         features: ["Verified badge"], tier: "starter" },
  { id: "d2", name: "Pickup Zone Partner",                category: "driver", price: 1000,  bestFor: "Single-zone partners",        features: ["Zone assignment", "Operator coords"], tier: "standard" },
  { id: "d3", name: "Shuttle Route Partner",              category: "driver", price: 5000,  bestFor: "Shuttle operators",           features: ["Multi-zone routes", "Hotel pairings"], tier: "premium" },
  { id: "d4", name: "Premium Transportation Sponsor",     category: "driver", price: 15000, bestFor: "Transport companies",         features: ["All zones", "Sponsor branding", "AI concierge tie-in"], tier: "featured", featured: true },
];

export const ALL_PACKAGES: PackageItem[] = [
  ...SPONSOR_PACKAGES, ...MERCHANT_PACKAGES, ...HOTEL_PACKAGES, ...DRIVER_PACKAGES,
];

// ── Sponsors ───────────────────────────────────────────────────────────────
export const SPONSORS: Sponsor[] = [
  { id: "atl-eats",   name: "Atlanta Eats Collective",  industry: "Food & Beverage", tier: "premium",   status: "active",  monthlyValue: 2900,  activeCampaigns: 3 },
  { id: "peach-mob",  name: "Peach State Mobility",     industry: "Transportation",  tier: "featured",  status: "active",  monthlyValue: 6250,  activeCampaigns: 2 },
  { id: "skyline",    name: "Skyline Hospitality Group",industry: "Hospitality",     tier: "enterprise",status: "active",  monthlyValue: 20800, activeCampaigns: 5 },
  { id: "metro-hp",   name: "Metro Health Partners",    industry: "Health",          tier: "standard",  status: "renewal", monthlyValue: 1000,  activeCampaigns: 1 },
  { id: "south-en",   name: "Southern Energy Network",  industry: "Energy",          tier: "premium",   status: "active",  monthlyValue: 2900,  activeCampaigns: 2 },
  { id: "creator-ca", name: "Creator Commerce Alliance",industry: "Retail",          tier: "standard",  status: "pending", monthlyValue: 1000,  activeCampaigns: 0 },
];

// ── Campaigns ──────────────────────────────────────────────────────────────
export const CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Peach Street QR Drive",          sponsorId: "atl-eats",   type: "QR Offer",            zone: "Downtown",  status: "live",      scans: 4820, redemptions: 612, estimatedValue: 18450 },
  { id: "c2", name: "Hotel→Seat Express",             sponsorId: "skyline",    type: "Hotel Route",         zone: "Centennial",status: "live",      scans: 2200, redemptions: 980, estimatedValue: 24500 },
  { id: "c3", name: "Citywide Mobility Activation",   sponsorId: "peach-mob",  type: "Citywide Activation", zone: "All",       status: "live",      scans: 9100, redemptions: 1310, estimatedValue: 41200 },
  { id: "c4", name: "Wellness Audience Segment",      sponsorId: "metro-hp",   type: "Audience Segment",    zone: "Midtown",   status: "scheduled", scans: 0,    redemptions: 0,   estimatedValue: 8000 },
  { id: "c5", name: "Energy Reward Engine",           sponsorId: "south-en",   type: "Reward Engine",       zone: "Westside",  status: "live",      scans: 1750, redemptions: 410, estimatedValue: 12300 },
  { id: "c6", name: "Safety Route Co-Brand",          sponsorId: "skyline",    type: "Safety Route Sponsor",zone: "Downtown",  status: "live",      scans: 3300, redemptions: 1100, estimatedValue: 16800 },
  { id: "c7", name: "Creator Commerce Pop-Up",        sponsorId: "creator-ca", type: "Venue Placement",     zone: "Westside",  status: "ended",     scans: 1200, redemptions: 240, estimatedValue: 5400 },
];

// ── Agents ─────────────────────────────────────────────────────────────────
export const AGENTS: Agent[] = [
  { id: "wwai",        name: "WWAI Concierge Agent",        role: "Guest concierge",          capabilities: ["routing", "offers", "multilingual"], status: "online" },
  { id: "sales",       name: "Sales Agent",                 role: "Pipeline + outreach",       capabilities: ["lead qualification", "proposal draft"], status: "ready" },
  { id: "proposal",    name: "Sponsor Proposal Agent",      role: "Proposal generation",       capabilities: ["pricing", "terms", "PDF prep"], status: "ready" },
  { id: "merchant",    name: "Merchant Onboarding Agent",   role: "Verify merchants",          capabilities: ["verification", "package fit"], status: "ready" },
  { id: "restaurant",  name: "Restaurant Onboarding Agent", role: "Verify restaurants",        capabilities: ["menu intake", "offer build"], status: "ready" },
  { id: "bar",         name: "Bar Onboarding Agent",        role: "Verify bars",               capabilities: ["age compliance review"], status: "ready" },
  { id: "driver",      name: "Driver Coordination Agent",   role: "Pickup zones & routing",    capabilities: ["zone routing", "verification"], status: "ready" },
  { id: "hotel",       name: "Hotel Routing Agent",         role: "Hotel → seat routes",       capabilities: ["route packs", "concierge"], status: "ready" },
  { id: "safety",      name: "Safety Ops Agent",            role: "Safety-informed routing",   capabilities: ["operator review", "incident triage"], status: "needs-config" },
  { id: "lang",        name: "Multilingual Support Agent",  role: "Translation & glossary",    capabilities: ["8 demo languages"], status: "ready" },
  { id: "billing",     name: "Billing Readiness Agent",     role: "Invoice prep",              capabilities: ["totals", "providers"], status: "needs-config" },
  { id: "admin",       name: "Admin Review Agent",          role: "Approval routing",          capabilities: ["queue triage"], status: "online" },
];

export const RAG_SOURCES: string[] = [
  "Sponsor packages",
  "Merchant profiles",
  "Restaurant menus & offers",
  "Hotel pickup zones",
  "Driver availability",
  "Venue maps",
  "Safety procedures",
  "Campaign performance",
  "Billing records",
];

export const MCP_TOOLS: string[] = [
  "CRM tool",
  "Map / routing tool",
  "Billing tool",
  "Email / SMS tool",
  "Proposal tool",
  "Registration review tool",
  "Analytics tool",
];

// ── WWAI canned responses ─────────────────────────────────────────────────
export const WWAI_PRESETS: { q: string; a: string }[] = [
  { q: "Where should I eat near my hotel?",
    a: "Within 0.5 mi of Downtown Grand: Peach Street Grill (10% off w/ QR), Southern Bowl Market, and Centennial Tacos. Tap any to get a route." },
  { q: "What bars are near the event zone?",
    a: "Closest verified bars: Downtown Sports Lounge (0.3 mi), Centennial Night House (0.6 mi), Westside Social Bar (0.8 mi). All operator-reviewed for late pickup." },
  { q: "How do I get from my hotel to my seat?",
    a: "Walk 8 min via the recommended public corridor, then enter at the assigned gate. I can generate a QR route pass for the demo." },
  { q: "How do I get back to my hotel after the event?",
    a: "I will route you to Driver Pickup Zone B (0.4 mi, lit and monitored), or to Hotel Shuttle Zone A. Estimated return: 12–18 min." },
  { q: "Where is driver pickup?",
    a: "Driver Pickup Zone B is 0.4 mi west of the venue. Operator-staffed, lit. Shuttle Zone A is closer at 0.1 mi." },
  { q: "What sponsor offers are near me?",
    a: "Active in this zone: Peach Street Grill (10% off), Family Pizza Hall (kids eat free Tue), Centennial Tacos (free chips). Tap to redeem." },
  { q: "I own a restaurant. How do I register?",
    a: "Open /register/restaurant. Pick a package (Verified Listing $500/yr → Premium Placement $2,500/yr). Approval is operator-reviewed in production." },
  { q: "I manage a hotel. How do I join?",
    a: "Open /register/hotel. Choose Hotel Listing, Guest Route Package, or Concierge Integration. We will set up routes from your property to the venue." },
  { q: "I am a driver. How do I register?",
    a: "Open /register/driver. We are an independent platform — not affiliated with rideshare brands. Pick a Verified Driver, Pickup Zone, or Shuttle package." },
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
  { code: "zh", label: "Mandarin" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
];

export const ZONES = ["Downtown", "Centennial", "Midtown", "Westside", "Buckhead", "Airport"];
