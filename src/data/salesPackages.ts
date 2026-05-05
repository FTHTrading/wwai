// Sales packages for WWAI / TROPTIONS platform
// All prices are demo/reference. Production requires payment provider integration.

export type SalesPackageCategory =
  | "restaurant-bar"
  | "hotel"
  | "driver-transportation"
  | "sponsor"
  | "venue"
  | "sales-partner";

export interface SalesPackage {
  id: string;
  name: string;
  category: SalesPackageCategory;
  price: number; // annual USD
  setupFee?: number;
  bestFor: string;
  includedServices: string[];
  salesTalkingPoints: string[];
  recommendedBuyer: string;
  commissionEligible: boolean;
}

export const RESTAURANT_BAR_PACKAGES: SalesPackage[] = [
  {
    id: "rb-verified",
    name: "Verified Listing",
    category: "restaurant-bar",
    price: 500,
    bestFor: "Restaurants and bars wanting basic WWAI discovery",
    includedServices: [
      "WWAI discovery listing",
      "Map placement",
      "Business profile page",
      "Basic analytics dashboard",
    ],
    salesTalkingPoints: [
      "Show up when fans ask WWAI for food near the event",
      "Verified badge builds guest trust",
      "Low entry point — $500/year",
      "Upgrade anytime to QR campaigns",
    ],
    recommendedBuyer: "Small restaurants, local bars, food trucks near venues",
    commissionEligible: true,
  },
  {
    id: "rb-enhanced",
    name: "Enhanced Profile",
    category: "restaurant-bar",
    price: 1250,
    bestFor: "Restaurants wanting priority placement and QR capability",
    includedServices: [
      "WWAI discovery listing",
      "Enhanced map placement",
      "Business profile with photos",
      "QR code (basic campaign)",
      "Analytics dashboard",
      "Weekly summary report",
    ],
    salesTalkingPoints: [
      "Priority placement above standard listings",
      "QR code campaign drives repeat visits",
      "Weekly report shows real ROI",
      "$1,250/year averages $104/month",
    ],
    recommendedBuyer: "Mid-size restaurants, sports bars, established dining",
    commissionEligible: true,
  },
  {
    id: "rb-premium",
    name: "Premium Placement",
    category: "restaurant-bar",
    price: 2500,
    bestFor: "Established venues wanting top-tier event-city exposure",
    includedServices: [
      "Top WWAI placement",
      "Featured map pin",
      "Full business profile with media",
      "QR offer campaign (up to 3 offers)",
      "Analytics + redemption tracking",
      "Monthly performance report",
      "Concierge recommendation slot",
    ],
    salesTalkingPoints: [
      "AI concierge recommends you first",
      "QR campaigns drive measurable foot traffic",
      "Redemption tracking proves ROI",
      "Full media profile — photos, menu highlights",
    ],
    recommendedBuyer: "Premium restaurants, hotel bars, large dining groups",
    commissionEligible: true,
  },
  {
    id: "rb-featured-qr",
    name: "Featured QR Offer Campaign",
    category: "restaurant-bar",
    price: 7500,
    setupFee: 500,
    bestFor: "Restaurants wanting category leadership and aggressive campaign",
    includedServices: [
      "Featured WWAI placement",
      "Category-leading map placement",
      "Full QR campaign suite (unlimited offers)",
      "Redemption tracking + analytics",
      "Monthly + event-day reports",
      "Concierge recommendation priority",
      "Campaign management support",
      "Proposal + billing integration",
    ],
    salesTalkingPoints: [
      "Own your food category in the event zone",
      "Unlimited QR offers — run event-day specials",
      "Real-time redemption data",
      "Backed by WWAI AI routing recommendations",
    ],
    recommendedBuyer: "Restaurant groups, food hall operators, event caterers",
    commissionEligible: true,
  },
  {
    id: "rb-category-sponsor",
    name: "Category / Main Area Sponsor",
    category: "restaurant-bar",
    price: 50000,
    setupFee: 2500,
    bestFor: "Major restaurant brands wanting full event-city sponsorship",
    includedServices: [
      "Exclusive category sponsorship",
      "WWAI homepage placement",
      "Full QR + campaign suite",
      "Co-branded event materials",
      "Dedicated account management",
      "Custom analytics portal",
      "Integration with event partner program",
    ],
    salesTalkingPoints: [
      "Own the entire food/beverage category for the event",
      "Co-branded with WWAI — massive visibility",
      "Premium ROI reporting for CFO/CMO presentations",
    ],
    recommendedBuyer: "National restaurant brands, stadium food operators",
    commissionEligible: true,
  },
];

export const HOTEL_PACKAGES: SalesPackage[] = [
  {
    id: "hotel-listing",
    name: "Hotel Listing",
    category: "hotel",
    price: 750,
    bestFor: "Hotels wanting basic guest discovery during events",
    includedServices: [
      "WWAI hotel listing",
      "Map placement",
      "Hotel profile page",
      "Basic analytics",
    ],
    salesTalkingPoints: [
      "Guests ask WWAI 'where should I stay' — show up",
      "Verified listing builds trust",
      "$750/year is under $65/month",
    ],
    recommendedBuyer: "Boutique hotels, extended stays, B&Bs near event venues",
    commissionEligible: true,
  },
  {
    id: "hotel-guest-route",
    name: "Guest Route Package",
    category: "hotel",
    price: 2500,
    bestFor: "Hotels wanting integration with WWAI routing and concierge",
    includedServices: [
      "WWAI hotel listing + priority placement",
      "Guest route integration (safety-informed paths)",
      "QR code for lobby/room materials",
      "Analytics dashboard",
      "Monthly report",
    ],
    salesTalkingPoints: [
      "WWAI sends guests your route from the venue",
      "Lobby QR code — instant digital check-in experience",
      "Differentiates you from competitors",
    ],
    recommendedBuyer: "Mid-scale hotels, convention hotels, sports event partners",
    commissionEligible: true,
  },
  {
    id: "hotel-concierge",
    name: "Concierge Integration",
    category: "hotel",
    price: 7500,
    setupFee: 500,
    bestFor: "Hotels wanting AI concierge recommendations and full guest experience",
    includedServices: [
      "WWAI concierge placement",
      "Featured hotel listing",
      "Guest route integration",
      "QR + offer campaign",
      "Redemption tracking",
      "Full analytics portal",
      "Monthly account review",
    ],
    salesTalkingPoints: [
      "WWAI recommends your hotel when guests ask for nearby stays",
      "Offer campaigns drive direct bookings and F&B revenue",
      "Full data suite for marketing reports",
    ],
    recommendedBuyer: "Full-service hotels, resort properties, stadium-adjacent hotels",
    commissionEligible: true,
  },
  {
    id: "hotel-premium-partner",
    name: "Premium Hotel Partner",
    category: "hotel",
    price: 25000,
    setupFee: 1500,
    bestFor: "Major hotel brands wanting enterprise-level event-city presence",
    includedServices: [
      "Exclusive hotel category placement",
      "WWAI homepage hotel feature",
      "Full concierge + route integration",
      "Complete QR + campaign suite",
      "Co-branded event materials",
      "Dedicated account management",
      "Custom analytics portal",
    ],
    salesTalkingPoints: [
      "Own the hotel category for the event period",
      "Co-branded with WWAI — premium guest perception",
      "Enterprise reporting for ownership groups",
    ],
    recommendedBuyer: "National hotel brands, luxury properties, ownership groups",
    commissionEligible: true,
  },
];

export const DRIVER_PACKAGES: SalesPackage[] = [
  {
    id: "driver-verified",
    name: "Verified Driver Listing",
    category: "driver-transportation",
    price: 250,
    bestFor: "Independent drivers wanting WWAI guest discovery",
    includedServices: [
      "WWAI driver listing",
      "Map pickup zone placement",
      "Driver profile",
      "Basic availability display",
    ],
    salesTalkingPoints: [
      "Guests ask WWAI for safe rides — show up",
      "Verified badge builds trust over unverified rideshare",
      "$250/year is under $21/month",
    ],
    recommendedBuyer: "Independent drivers, small transportation operators",
    commissionEligible: true,
  },
  {
    id: "driver-pickup-zone",
    name: "Pickup Zone Partner",
    category: "driver-transportation",
    price: 1000,
    bestFor: "Transportation operators wanting dedicated pickup zone placement",
    includedServices: [
      "Dedicated pickup zone on WWAI map",
      "Driver/fleet listing",
      "QR code at pickup location",
      "Analytics (guest scans, route requests)",
    ],
    salesTalkingPoints: [
      "Branded pickup zone guests can navigate to",
      "QR code at location — instant booking or directions",
      "Differentiates from generic rideshare chaos",
    ],
    recommendedBuyer: "Black car services, shuttle operators, limo companies",
    commissionEligible: true,
  },
  {
    id: "driver-shuttle-route",
    name: "Shuttle Route Partner",
    category: "driver-transportation",
    price: 5000,
    setupFee: 250,
    bestFor: "Shuttle operators running event routes wanting full WWAI integration",
    includedServices: [
      "Dedicated shuttle route on WWAI map",
      "Featured driver/fleet listing",
      "Multi-stop QR deployment",
      "Redemption + ridership analytics",
      "Safety route integration",
      "Monthly report",
    ],
    salesTalkingPoints: [
      "WWAI routes guests directly to your shuttle stops",
      "QR codes at each stop = seamless guest flow",
      "Safety-informed routing is a premium differentiator",
    ],
    recommendedBuyer: "Airport shuttles, stadium shuttles, hotel-to-venue operators",
    commissionEligible: true,
  },
  {
    id: "driver-premium-sponsor",
    name: "Premium Transportation Sponsor",
    category: "driver-transportation",
    price: 15000,
    setupFee: 1000,
    bestFor: "Major transportation brands wanting event-city category ownership",
    includedServices: [
      "Transportation category sponsorship",
      "WWAI homepage placement",
      "Full route + pickup zone integration",
      "Co-branded safety routes",
      "Dedicated account management",
      "Custom analytics",
    ],
    salesTalkingPoints: [
      "Own safe transportation in the event narrative",
      "Co-branded with WWAI safety-informed routing",
      "Premium brand association with event guest safety",
    ],
    recommendedBuyer: "National rideshare partners, airport operators, bus companies",
    commissionEligible: true,
  },
];

export const SPONSOR_PACKAGES: SalesPackage[] = [
  {
    id: "sponsor-local",
    name: "Local Sponsor",
    category: "sponsor",
    price: 2500,
    setupFee: 250,
    bestFor: "Local businesses wanting brand exposure in the event zone",
    includedServices: [
      "Sponsor badge on WWAI listings",
      "Map placement",
      "QR campaign (1 offer)",
      "Analytics dashboard",
    ],
    salesTalkingPoints: [
      "Brand appears in WWAI guest interactions",
      "QR offer drives trackable redemptions",
      "Cost-effective local brand visibility",
    ],
    recommendedBuyer: "Local retailers, service businesses, event-adjacent brands",
    commissionEligible: true,
  },
  {
    id: "sponsor-category",
    name: "Category Sponsor",
    category: "sponsor",
    price: 10000,
    setupFee: 500,
    bestFor: "Brands wanting to own a specific category in WWAI",
    includedServices: [
      "Category sponsor designation",
      "Featured placement in category",
      "Full QR campaign suite",
      "Co-branded WWAI placements",
      "Monthly analytics report",
    ],
    salesTalkingPoints: [
      "Own your category — no competing sponsor placements",
      "Co-branded with WWAI for premium perception",
      "Full campaign suite + tracking",
    ],
    recommendedBuyer: "Regional brands, franchise operators, insurance/finance/retail",
    commissionEligible: true,
  },
  {
    id: "sponsor-city-activation",
    name: "City Activation Sponsor",
    category: "sponsor",
    price: 25000,
    setupFee: 1500,
    bestFor: "Brands wanting city-wide WWAI activation across multiple categories",
    includedServices: [
      "Multi-category sponsor placement",
      "City-level WWAI feature",
      "QR deployment across partner locations",
      "Co-branded event materials",
      "Dedicated account manager",
      "Full analytics suite",
    ],
    salesTalkingPoints: [
      "Appear across every major category in the event city",
      "Co-branded across all WWAI guest touchpoints",
      "Enterprise-scale reporting",
    ],
    recommendedBuyer: "National brands, telecom, financial services, major retailers",
    commissionEligible: true,
  },
  {
    id: "sponsor-premium-campaign",
    name: "Premium Campaign Sponsor",
    category: "sponsor",
    price: 75000,
    setupFee: 3500,
    bestFor: "Major brands wanting deep integration and exclusive campaign rights",
    includedServices: [
      "Exclusive campaign sponsor status",
      "WWAI homepage hero placement",
      "Unlimited QR campaigns",
      "Co-branded AI concierge responses",
      "Event day activation support",
      "Dedicated team",
      "Custom analytics portal",
    ],
    salesTalkingPoints: [
      "Appear in WWAI AI responses — ultimate brand placement",
      "Exclusive to one brand per campaign window",
      "Supported by dedicated activation team",
    ],
    recommendedBuyer: "Fortune 500 brands, official event sponsors, tech companies",
    commissionEligible: true,
  },
  {
    id: "sponsor-enterprise",
    name: "Enterprise Partner",
    category: "sponsor",
    price: 150000,
    setupFee: 5000,
    bestFor: "Official event partners wanting full platform co-branding",
    includedServices: [
      "Official WWAI/TROPTIONS partner designation",
      "Full platform co-branding",
      "Custom integrations",
      "Dedicated account team",
      "White-glove analytics + reporting",
      "Board-level ROI presentation",
    ],
    salesTalkingPoints: [
      "Become an official technology partner of the event city platform",
      "Co-branded across all guest touchpoints",
      "Institutional-grade reporting for board presentations",
    ],
    recommendedBuyer: "Official league/event sponsors seeking technology partnerships",
    commissionEligible: true,
  },
];

export const VENUE_PACKAGES: SalesPackage[] = [
  {
    id: "venue-listing",
    name: "Venue Listing",
    category: "venue",
    price: 1000,
    bestFor: "Event spaces wanting basic WWAI discovery and map placement",
    includedServices: [
      "WWAI venue listing",
      "Map placement",
      "Venue profile page",
      "Basic analytics",
    ],
    salesTalkingPoints: [
      "Guests discover your venue through WWAI",
      "Map placement drives walk-in traffic",
      "$1,000/year for year-round exposure",
    ],
    recommendedBuyer: "Small event spaces, private clubs, rooftop venues",
    commissionEligible: true,
  },
  {
    id: "venue-event-partner",
    name: "Event Partner Package",
    category: "venue",
    price: 5000,
    setupFee: 500,
    bestFor: "Venues hosting or adjacent to major events",
    includedServices: [
      "WWAI venue feature listing",
      "Event route integration",
      "QR campaign capability",
      "Analytics + redemption tracking",
      "Monthly reporting",
    ],
    salesTalkingPoints: [
      "WWAI sends guests to your venue as an event-adjacent destination",
      "QR campaigns during events drive bookings",
      "Measured ROI reporting",
    ],
    recommendedBuyer: "Hotels with event spaces, convention centers, arenas",
    commissionEligible: true,
  },
  {
    id: "venue-premium",
    name: "Premium Venue Partner",
    category: "venue",
    price: 15000,
    setupFee: 1000,
    bestFor: "Major venues wanting full WWAI integration and sponsor-level visibility",
    includedServices: [
      "Featured venue placement",
      "Full WWAI integration",
      "QR + campaign suite",
      "Safety route integration",
      "Co-branded materials",
      "Dedicated account management",
      "Custom analytics",
    ],
    salesTalkingPoints: [
      "Become a primary WWAI-recommended destination",
      "Safety-informed routing sends guests to your doors safely",
      "Full campaign suite for events, private bookings, promotions",
    ],
    recommendedBuyer: "Major event venues, stadiums, convention centers",
    commissionEligible: true,
  },
];

export const SALES_PARTNER_PACKAGES: SalesPackage[] = [
  {
    id: "partner-independent",
    name: "Independent Sales Rep",
    category: "sales-partner",
    price: 0,
    bestFor: "Individual sales reps building a book of business with TROPTIONS",
    includedServices: [
      "Sales partner portal access",
      "Package pricing sheet",
      "Sales deck access",
      "Proposal builder access",
      "Commission tracking (demo)",
      "Support from sales admin",
    ],
    salesTalkingPoints: [
      "Sell any package category",
      "Commission tracked per closed deal",
      "Full sales materials provided",
      "No upfront cost to join as a rep",
    ],
    recommendedBuyer: "Event marketers, sports marketers, hospitality sales reps",
    commissionEligible: true,
  },
  {
    id: "partner-agency",
    name: "Agency Partner",
    category: "sales-partner",
    price: 0,
    bestFor: "Marketing agencies selling TROPTIONS to their client base",
    includedServices: [
      "Agency partner portal",
      "White-label proposal builder",
      "Full package catalog",
      "Commission tracking",
      "Client management tools",
      "Dedicated agency support",
    ],
    salesTalkingPoints: [
      "Add TROPTIONS/WWAI to your agency offering",
      "Sell to your existing restaurant, hotel, sponsor clients",
      "White-label proposals with your branding",
    ],
    recommendedBuyer: "Sports marketing agencies, hospitality PR firms, event agencies",
    commissionEligible: true,
  },
  {
    id: "partner-regional",
    name: "Regional Marketing Partner",
    category: "sales-partner",
    price: 2500,
    bestFor: "Partners owning a defined sales territory",
    includedServices: [
      "Exclusive territory rights (demo)",
      "Regional partner portal",
      "Full sales + proposal tools",
      "Marketing support budget",
      "Higher commission tier",
      "Quarterly performance reviews",
    ],
    salesTalkingPoints: [
      "Own your city or region — no competing reps",
      "Elevated commission structure",
      "Supported by marketing budget for territory activation",
    ],
    recommendedBuyer: "Established sports/hospitality consultants with regional reach",
    commissionEligible: true,
  },
  {
    id: "partner-strategic",
    name: "Strategic Channel Partner",
    category: "sales-partner",
    price: 10000,
    setupFee: 1000,
    bestFor: "Organizations embedding TROPTIONS into their distribution channel",
    includedServices: [
      "Strategic partner designation",
      "Full platform access",
      "Custom integrations (roadmap)",
      "Revenue share program",
      "Co-marketing rights",
      "Executive-level support",
    ],
    salesTalkingPoints: [
      "Distribute TROPTIONS through your existing sales channel",
      "Revenue share model — aligned incentives",
      "Co-marketing builds your brand alongside TROPTIONS",
    ],
    recommendedBuyer: "Event management companies, sports networks, city agencies",
    commissionEligible: true,
  },
];

export const ALL_SALES_PACKAGES: SalesPackage[] = [
  ...RESTAURANT_BAR_PACKAGES,
  ...HOTEL_PACKAGES,
  ...DRIVER_PACKAGES,
  ...SPONSOR_PACKAGES,
  ...VENUE_PACKAGES,
  ...SALES_PARTNER_PACKAGES,
];

export const PACKAGE_CATEGORY_LABELS: Record<SalesPackageCategory, string> = {
  "restaurant-bar": "Restaurant / Bar",
  hotel: "Hotel",
  "driver-transportation": "Driver / Transportation",
  sponsor: "Sponsor",
  venue: "Venue / Event Space",
  "sales-partner": "Sales / Marketing Partner",
};

export function getPackagesByCategory(category: SalesPackageCategory): SalesPackage[] {
  return ALL_SALES_PACKAGES.filter((p) => p.category === category);
}

export function getPackageById(id: string): SalesPackage | undefined {
  return ALL_SALES_PACKAGES.find((p) => p.id === id);
}
