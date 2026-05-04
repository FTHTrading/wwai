/**
 * Seed script — FIFA player cards + TROPTIONS Sales OS demo data
 * Run:  npm run db:seed
 * Reset + reseed:  npm run db:reset:demo
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const CARDS = [
  { eaId: "158023", name: "Lionel Messi",        club: "Inter Miami",     league: "MLS",          nation: "Argentina", position: "RW",  rating: 91, rarity: "icon" },
  { eaId: "20801",  name: "Cristiano Ronaldo",   club: "Al Nassr",        league: "Saudi Pro",    nation: "Portugal",  position: "ST",  rating: 89, rarity: "gold" },
  { eaId: "192985", name: "Kylian Mbappé",        club: "Real Madrid",     league: "La Liga",      nation: "France",    position: "ST",  rating: 95, rarity: "gold" },
  { eaId: "231747", name: "Erling Haaland",       club: "Man City",        league: "Premier",      nation: "Norway",    position: "ST",  rating: 94, rarity: "gold" },
  { eaId: "239085", name: "Jude Bellingham",      club: "Real Madrid",     league: "La Liga",      nation: "England",   position: "CAM", rating: 93, rarity: "gold" },
  { eaId: "168542", name: "Virgil van Dijk",      club: "Liverpool",       league: "Premier",      nation: "Netherlands",position: "CB", rating: 90, rarity: "gold" },
  { eaId: "173731", name: "Kevin De Bruyne",      club: "Man City",        league: "Premier",      nation: "Belgium",   position: "CM",  rating: 93, rarity: "gold" },
  { eaId: "176580", name: "Mohamed Salah",        club: "Liverpool",       league: "Premier",      nation: "Egypt",     position: "RW",  rating: 92, rarity: "gold" },
  { eaId: "231443", name: "Pedri",                club: "Barcelona",       league: "La Liga",      nation: "Spain",     position: "CM",  rating: 90, rarity: "gold" },
  { eaId: "260507", name: "Lamine Yamal",         club: "Barcelona",       league: "La Liga",      nation: "Spain",     position: "RW",  rating: 90, rarity: "special" },
];

const PRICES: Record<string, number[]> = {
  "158023": [180000, 195000, 210000],
  "20801":  [85000,  82000,  88000],
  "192985": [950000, 980000, 1020000],
  "231747": [720000, 750000, 740000],
  "239085": [850000, 900000, 880000],
  "168542": [280000, 275000, 290000],
  "173731": [620000, 640000, 650000],
  "176580": [480000, 500000, 510000],
  "231443": [310000, 320000, 315000],
  "260507": [420000, 450000, 470000],
};

async function main() {
  // ── Player cards (existing) ─────────────────────────────────
  console.log("Seeding player cards…");
  for (const card of CARDS) {
    const created = await prisma.playerCard.upsert({
      where: { eaId: card.eaId },
      create: card,
      update: { rating: card.rating },
    });
    const prices = PRICES[card.eaId] ?? [];
    for (const price of prices) {
      await prisma.priceSnapshot.create({
        data: { cardId: created.id, price, source: "seed" },
      });
    }
    console.log(`  ✓ ${card.name} (${card.rating})`);
  }

  // ── Phase 2: Sponsors ────────────────────────────────────────
  console.log("\nSeeding sponsors…");
  const sponsorData = [
    { name: "CocaCola Beverages",      contactName: "Layla Hendricks",  contactEmail: "layla@coke.example.com",      contactPhone: "+14045550101", package: "champion",       status: "active",   budget: 75000,  industry: "beverage",  website: "https://coca-cola.com",     notes: "Title sponsor — ATL home opener + Q3 campaign"         },
    { name: "Delta Air Lines",         contactName: "Marcus Thornton",  contactEmail: "marcus@delta.example.com",    contactPhone: "+14045550202", package: "rewards_engine", status: "active",   budget: 150000, industry: "aviation",  website: "https://delta.com",         notes: "Airport activation + TSA checkpoint QR redemptions"    },
    { name: "Truist Bank",             contactName: "Sandra Rivera",    contactEmail: "sandra@truist.example.com",   contactPhone: "+14045550303", package: "fan_engagement", status: "active",   budget: 55000,  industry: "finance",   website: "https://truist.com",        notes: "Loyalty rewards program — QR-based points activation"  },
    { name: "Chick-fil-A",             contactName: "Kevin Osei",       contactEmail: "kevin@cfa.example.com",       contactPhone: "+14045550404", package: "smart_placement",status: "active",   budget: 30000,  industry: "food",      website: "https://chick-fil-a.com",   notes: "Stadium concession + app download drive"               },
    { name: "Marriott Bonvoy",         contactName: "Priya Desai",      contactEmail: "priya@marriott.example.com",  contactPhone: "+14045550505", package: "fan_engagement", status: "onboarded",budget: 40000,  industry: "hospitality",website: "https://marriott.com",      notes: "Hotel corridor activation — check-in QR offer"         },
    { name: "Nike Atlanta",            contactName: "Deon Whitfield",   contactEmail: "deon@nike.example.com",       contactPhone: "+14045550606", package: "champion",       status: "prospect", budget: 80000,  industry: "apparel",   website: "https://nike.com",          notes: "Proposal stage — awaiting brand team approval"         },
  ];
  const sponsors: Record<string, string> = {};
  for (const s of sponsorData) {
    const existing = await prisma.sponsor.findFirst({ where: { name: s.name } });
    const record = existing
      ? await prisma.sponsor.update({ where: { id: existing.id }, data: s })
      : await prisma.sponsor.create({ data: s });
    sponsors[s.name] = record.id;
    console.log(`  ✓ ${s.name} (${s.status})`);
  }

  // ── Phase 2: Venues ──────────────────────────────────────────
  console.log("\nSeeding venues…");
  const venueData = [
    { name: "Mercedes-Benz Stadium",      address: "1 AMB Drive NW",              city: "Atlanta, GA",    lat: 33.7554, lng: -84.4009, category: "stadium",       capacity: 71000, contactName: "Ops Team",       contactEmail: "ops@mbs.example.com",    contactPhone: "+14045550701", status: "active",    notes: "Primary activation venue — NFL + MLS" },
    { name: "State Farm Arena",           address: "1 State Farm Drive",          city: "Atlanta, GA",    lat: 33.7573, lng: -84.3962, category: "stadium",       capacity: 21000, contactName: "Events Desk",    contactEmail: "events@sfa.example.com", contactPhone: "+14045550702", status: "active",    notes: "NBA arena — Hawks home court" },
    { name: "Hartsfield-Jackson ATL",     address: "6000 N Terminal Pkwy",        city: "Atlanta, GA",    lat: 33.6407, lng: -84.4277, category: "transit",       capacity: 95000, contactName: "Retail Ops",     contactEmail: "retail@atl.example.com", contactPhone: "+14045550703", status: "active",    notes: "Busiest US airport — Delta anchor tenant" },
    { name: "Georgia World Congress Ctr", address: "285 Andrew Young Intl Blvd",  city: "Atlanta, GA",    lat: 33.7612, lng: -84.3978, category: "entertainment", capacity: 40000, contactName: "Venue Manager",  contactEmail: "vm@gwcc.example.com",    contactPhone: "+14045550704", status: "active",    notes: "Convention + event complex adjacent to MBS" },
    { name: "Marriott Marquis Atlanta",   address: "265 Peachtree Center Ave",    city: "Atlanta, GA",    lat: 33.7583, lng: -84.3874, category: "hotel",         capacity: 1663,  contactName: "Concierge Ops",  contactEmail: "concierge@mm.example.com",contactPhone: "+14045550705", status: "onboarded", notes: "Bonvoy check-in QR activation" },
    { name: "Five Points MARTA Station",  address: "30 Park Place NE",            city: "Atlanta, GA",    lat: 33.7490, lng: -84.3908, category: "transit",       capacity: 12000, contactName: "MARTA Ops",      contactEmail: "ops@marta.example.com",  contactPhone: "+14045550706", status: "active",    notes: "Highest-traffic rail hub — commuter activation" },
    { name: "Ponce City Market",          address: "675 Ponce De Leon Ave NE",    city: "Atlanta, GA",    lat: 33.7724, lng: -84.3655, category: "retail",        capacity: 5000,  contactName: "Marketing Dir",  contactEmail: "mkt@pcm.example.com",    contactPhone: "+14045550707", status: "active",    notes: "Mixed-use retail + food hall — influencer hub" },
    { name: "Piedmont Park Amphitheater", address: "1320 Monroe Dr NE",           city: "Atlanta, GA",    lat: 33.7855, lng: -84.3725, category: "entertainment", capacity: 6500,  contactName: "Parks Events",   contactEmail: "events@piedmont.example.com",contactPhone: "+14045550708", status: "prospect",  notes: "Outdoor concert + event space" },
  ];
  const venues: Record<string, string> = {};
  for (const v of venueData) {
    const existing = await prisma.venue.findFirst({ where: { name: v.name } });
    const record = existing
      ? await prisma.venue.update({ where: { id: existing.id }, data: v })
      : await prisma.venue.create({ data: v });
    venues[v.name] = record.id;
    console.log(`  ✓ ${v.name} (${v.status})`);
  }

  // ── Phase 2: Campaigns ───────────────────────────────────────
  console.log("\nSeeding campaigns…");
  const campaignData = [
    {
      name: "CocaCola Stadium Activation Q2",
      sponsorId: sponsors["CocaCola Beverages"],
      venueId:   venues["Mercedes-Benz Stadium"],
      type: "qr", status: "active",
      startDate: new Date("2026-04-01"), endDate: new Date("2026-06-30"),
      budget: 35000, impressions: 84200, clicks: 6310, redemptions: 1842,
      notes: "QR codes on concession cups + gate banners",
    },
    {
      name: "Delta ATL Airport Experience",
      sponsorId: sponsors["Delta Air Lines"],
      venueId:   venues["Hartsfield-Jackson ATL"],
      type: "offer", status: "active",
      startDate: new Date("2026-01-15"), endDate: new Date("2026-12-31"),
      budget: 80000, impressions: 212000, clicks: 18900, redemptions: 4750,
      notes: "Check-in kiosk QR + SkyClub offer redemptions",
    },
    {
      name: "Truist Fan Rewards — NBA Playoffs",
      sponsorId: sponsors["Truist Bank"],
      venueId:   venues["State Farm Arena"],
      type: "qr", status: "active",
      startDate: new Date("2026-04-15"), endDate: new Date("2026-05-31"),
      budget: 25000, impressions: 41000, clicks: 3200, redemptions: 876,
      notes: "Seat-based QR for Truist points during Hawks playoff run",
    },
    {
      name: "Chick-fil-A App Drive — GWCC",
      sponsorId: sponsors["Chick-fil-A"],
      venueId:   venues["Georgia World Congress Ctr"],
      type: "digital", status: "completed",
      startDate: new Date("2026-02-01"), endDate: new Date("2026-03-31"),
      budget: 15000, impressions: 28500, clicks: 4100, redemptions: 1020,
      notes: "Convention center digital activation — concluded successfully",
    },
  ];
  const campaigns: string[] = [];
  for (const c of campaignData) {
    const existing = await prisma.campaign.findFirst({ where: { name: c.name } });
    const record = existing
      ? await prisma.campaign.update({ where: { id: existing.id }, data: c })
      : await prisma.campaign.create({ data: c });
    campaigns.push(record.id);
    console.log(`  ✓ ${c.name} (${c.status})`);
  }

  // ── Phase 2: QR Codes ────────────────────────────────────────
  console.log("\nSeeding QR codes…");
  const qrData = [
    { campaignId: campaigns[0], label: "Gate A Free Coke", offerText: "Scan for a FREE 20oz Coca-Cola at any concession", rewardValue: 5,   rewardType: "free_item", scans: 1420, redemptions: 892, active: true  },
    { campaignId: campaigns[0], label: "50% Off Combo",    offerText: "50% off any food + drink combo today only",      rewardValue: 12,  rewardType: "discount",  scans: 823,  redemptions: 312, active: true  },
    { campaignId: campaigns[1], label: "SkyMiles Bonus",   offerText: "Earn 500 bonus SkyMiles — tap to activate",      rewardValue: 500, rewardType: "points",    scans: 9200, redemptions: 3100, active: true  },
    { campaignId: campaigns[1], label: "Lounge Day Pass",  offerText: "$30 Delta Sky Club Day Pass — scan to redeem",   rewardValue: 30,  rewardType: "discount",  scans: 4100, redemptions: 1200, active: true  },
    { campaignId: campaigns[2], label: "Truist Bonus Pts", offerText: "250 bonus Truist ONE points for Hawks fans",     rewardValue: 250, rewardType: "points",    scans: 2800, redemptions: 650,  active: true  },
    { campaignId: campaigns[2], label: "$10 Concessions",  offerText: "$10 food credit at any arena vendor",           rewardValue: 10,  rewardType: "cashback",  scans: 1100, redemptions: 226,  active: true  },
    { campaignId: campaigns[3], label: "Free Sandwich",    offerText: "Free Classic Chick-fil-A sandwich with download",rewardValue: 7,   rewardType: "free_item", scans: 3800, redemptions: 850,  active: false, expiresAt: new Date("2026-03-31") },
    { campaignId: campaigns[3], label: "App $5 Credit",    offerText: "$5 Chick-fil-A app credit — limited time",      rewardValue: 5,   rewardType: "cashback",  scans: 2200, redemptions: 420,  active: false, expiresAt: new Date("2026-03-31") },
  ];
  const qrCodes: string[] = [];
  for (const q of qrData) {
    const existing = await prisma.qrCode.findFirst({ where: { campaignId: q.campaignId, label: q.label } });
    const record = existing
      ? await prisma.qrCode.update({ where: { id: existing.id }, data: q })
      : await prisma.qrCode.create({ data: q });
    qrCodes.push(record.id);
    console.log(`  ✓ QR: ${q.label} (${q.scans} scans, ${q.redemptions} redeems)`);
  }

  // ── Phase 2: QR Events (audit trail) ────────────────────────
  console.log("\nSeeding QR events…");
  const eventTypes = ["scan", "scan", "scan", "redeem"] as const;
  for (const qrId of qrCodes.slice(0, 4)) {
    for (let i = 0; i < 15; i++) {
      await prisma.qrEvent.create({
        data: {
          qrCodeId:  qrId,
          eventType: eventTypes[i % 4],
          ipHash:    `seed-hash-${i.toString().padStart(3, "0")}`,
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15",
          location:  "Atlanta, GA",
        },
      });
    }
  }
  console.log(`  ✓ 60 QR events seeded`);

  // ── Phase 2: Leads ───────────────────────────────────────────
  console.log("\nSeeding leads…");
  const leadData = [
    { type: "sponsor", name: "James Kellerman",  email: "jk@superbrand.example.com",   phone: "+14045550801", company: "SuperBrand Athletics",    message: "Looking at Q3 naming rights package", source: "web",      status: "qualified",    estimatedValue: 120000, sponsorId: null, venueId: null },
    { type: "sponsor", name: "Angela Wu",         email: "angela@freshco.example.com",  phone: "+14045550802", company: "FreshCo Beverages",        message: "Interested in fan engagement + QR",   source: "web",      status: "proposal",     estimatedValue: 55000,  sponsorId: null, venueId: null },
    { type: "venue",   name: "Terrence Brown",    email: "terrence@atldome.example.com",phone: "+14045550803", company: "ATL Dome Properties",      message: "New stadium opening March 2027",      source: "referral", status: "new",          estimatedValue: 200000, sponsorId: null, venueId: null },
    { type: "venue",   name: "Sarah McIntyre",    email: "sarah@stadlink.example.com",  phone: "+14045550804", company: "StadiumLink Ops",          message: "Venue tech upgrade — map + QR system", source: "web",      status: "contacted",    estimatedValue: 45000,  sponsorId: null, venueId: null },
    { type: "sales",   name: "Devon Jackson",     email: "devon@reachsport.example.com",phone: "+14045550805", company: "ReachSport Agency",        message: "Agency partnership referral deal",     source: "referral", status: "qualified",    estimatedValue: 30000,  sponsorId: null, venueId: null },
    { type: "sponsor", name: "Lisa Fontaine",     email: "lisa@creditone.example.com",  phone: "+14045550806", company: "CreditOne Financial",      message: "Fan activation + points loyalty play", source: "web",      status: "new",          estimatedValue: 70000,  sponsorId: null, venueId: null },
    { type: "general", name: "Marcus Allen",      email: "marcus@sportmedia.example.com",phone: "+14045550807",company: "Sport Media Group",        message: "Media rights + QR redemption inquiry", source: "web",      status: "contacted",    estimatedValue: 25000,  sponsorId: null, venueId: null },
    { type: "sponsor", name: "Rachel Kim",        email: "rachel@sportswear.example.com",phone: "+14045550808",company: "SportswearDirect",         message: "Apparel activation — stadium + digital",source: "cold_call",status: "closed_won",   estimatedValue: 40000,  sponsorId: sponsors["Nike Atlanta"], venueId: venues["Mercedes-Benz Stadium"] },
  ];
  for (const l of leadData) {
    const existing = await prisma.lead.findFirst({ where: { email: l.email } });
    if (!existing) {
      await prisma.lead.create({ data: l });
    }
    console.log(`  ✓ ${l.name} — ${l.company} (${l.status})`);
  }

  console.log("\n✅ Phase 2 seed complete.");
  console.log("   Sponsors:", sponsorData.length);
  console.log("   Venues:", venueData.length);
  console.log("   Campaigns:", campaignData.length);
  console.log("   QR Codes:", qrData.length);
  console.log("   QR Events:", 60);
  console.log("   Leads:", leadData.length);
  console.log("\nDone. Run `npm run dev` to view the platform.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
