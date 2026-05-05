/**
 * src/lib/wwai/intent.ts
 * WWAI intent classifier — keyword-based, no LLM required.
 * Server-safe: no secrets, no client imports.
 */

export type WWAIIntent =
  | "food"
  | "bars_nightlife"
  | "hotel"
  | "route"
  | "return_route"
  | "pickup"
  | "sponsor_offer"
  | "business_registration"
  | "restaurant_registration"
  | "hotel_registration"
  | "driver_registration"
  | "sponsor_package"
  | "safety_support"
  | "accessibility_support"
  | "what_is_wwai"
  | "what_is_troptions"
  | "demo_only"
  | "adult_or_restricted"
  | "unknown";

// ── Restricted patterns ────────────────────────────────────────────────────
// These trigger the adult_or_restricted intent and block place recommendations.
const RESTRICTED_PATTERNS = [
  /strip\s*club/i,
  /adult\s*club/i,
  /erotic/i,
  /escort/i,
  /sexual\s*service/i,
  /\bporn\b/i,
  /adult\s*entertainment/i,
  /\bsex\s*shop\b/i,
  /gentlemen'?s?\s*club/i,
  /nude\s*bar/i,
  /topless/i,
];

// ── Intent patterns (ordered — first match wins) ───────────────────────────
const INTENT_RULES: Array<{ intent: WWAIIntent; patterns: RegExp[] }> = [
  {
    intent: "adult_or_restricted",
    patterns: RESTRICTED_PATTERNS,
  },
  {
    intent: "what_is_wwai",
    patterns: [/what\s+is\s+wwai/i, /whichway\s+ai/i, /what\s+does\s+wwai/i, /about\s+wwai/i, /who\s+is\s+wwai/i],
  },
  {
    intent: "what_is_troptions",
    patterns: [/what\s+is\s+troption/i, /troptions/i, /about\s+troptions/i],
  },
  {
    intent: "restaurant_registration",
    patterns: [
      /i\s+(own|run|have|manage|operate)\s+a\s+restaurant/i,
      /register.*restaurant/i,
      /restaurant.*register/i,
      /join.*restaurant/i,
      /restaurant.*onboard/i,
      /list.*my\s+restaurant/i,
    ],
  },
  {
    intent: "hotel_registration",
    patterns: [
      /i\s+(own|run|manage|operate)\s+a\s+hotel/i,
      /register.*hotel/i,
      /hotel.*register/i,
      /hotel.*join/i,
      /list.*my\s+hotel/i,
    ],
  },
  {
    intent: "driver_registration",
    patterns: [
      /i\s+am\s+a\s+driver/i,
      /i'?m\s+a\s+driver/i,
      /register.*driver/i,
      /driver.*register/i,
      /become\s+a\s+driver/i,
      /join.*driver/i,
    ],
  },
  {
    intent: "sponsor_package",
    patterns: [
      /sponsor\s+package/i,
      /become\s+a\s+sponsor/i,
      /sponsorship/i,
      /advertise/i,
      /i\s+(own|run|have|manage)\s+a\s+brand/i,
      /brand\s+partner/i,
    ],
  },
  {
    intent: "business_registration",
    patterns: [
      /i\s+(own|run|have|manage)\s+a\s+business/i,
      /register.*business/i,
      /business.*register/i,
      /list\s+my\s+business/i,
      /how\s+do\s+i\s+register/i,
      /how\s+do\s+i\s+join/i,
    ],
  },
  {
    intent: "return_route",
    patterns: [
      /back\s+to\s+my\s+hotel/i,
      /return.*hotel/i,
      /get\s+home/i,
      /head\s+back/i,
      /after\s+the\s+event/i,
      /leaving.*event/i,
      /going\s+back/i,
      /return\s+route/i,
    ],
  },
  {
    intent: "pickup",
    patterns: [
      /pickup\s+zone/i,
      /pick[\s-]?up/i,
      /driver\s+pickup/i,
      /shuttle\s+pickup/i,
      /rideshare/i,
      /where.*driver/i,
      /lyft|uber/i,
      /taxi/i,
      /car\s+service/i,
    ],
  },
  {
    intent: "route",
    patterns: [
      /how\s+do\s+i\s+get/i,
      /route/i,
      /direction/i,
      /navigate/i,
      /walk.*seat/i,
      /hotel.*seat/i,
      /from.*to\b/i,
      /plan.*route/i,
      /safety.*route/i,
      /safe.*route/i,
    ],
  },
  {
    intent: "food",
    patterns: [
      /eat/i,
      /food/i,
      /restaurant/i,
      /dinner/i,
      /lunch/i,
      /breakfast/i,
      /hungry/i,
      /pizza/i,
      /tacos?/i,
      /bbq/i,
      /burger/i,
      /cuisine/i,
      /where.*eat/i,
    ],
  },
  {
    intent: "bars_nightlife",
    patterns: [
      /\bbar\b/i,
      /bars\b/i,
      /nightlife/i,
      /lounge/i,
      /cocktail/i,
      /drinks?\b/i,
      /where.*drink/i,
      /sports\s+bar/i,
    ],
  },
  {
    intent: "hotel",
    patterns: [
      /\bhotel/i,
      /lodging/i,
      /accommodation/i,
      /stay/i,
      /suites?/i,
      /check[\s-]in/i,
      /where.*stay/i,
    ],
  },
  {
    intent: "sponsor_offer",
    patterns: [
      /offer/i,
      /deal/i,
      /discount/i,
      /coupon/i,
      /promo/i,
      /sponsor/i,
      /reward/i,
      /qr\s+code/i,
      /redeem/i,
    ],
  },
  {
    intent: "safety_support",
    patterns: [
      /safe\b/i,
      /safety/i,
      /emergency/i,
      /help\s+me/i,
      /lost/i,
      /medical/i,
      /support\s+booth/i,
      /family\s+reunion/i,
      /reunif/i,
    ],
  },
  {
    intent: "accessibility_support",
    patterns: [
      /wheelchair/i,
      /accessible/i,
      /disability/i,
      /mobility\s+aid/i,
      /ada\s+route/i,
      /ramp/i,
      /elevator/i,
    ],
  },
];

export function classifyIntent(message: string): WWAIIntent {
  for (const { intent, patterns } of INTENT_RULES) {
    if (patterns.some((p) => p.test(message))) return intent;
  }
  return "unknown";
}

export function isRestrictedIntent(intent: WWAIIntent): boolean {
  return intent === "adult_or_restricted";
}
