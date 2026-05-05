/**
 * src/lib/wwai/retrieval.ts
 * WWAI keyword-based RAG retrieval layer — server-side only.
 * No vector DB required. Future: replace scoredItems with cosine similarity
 * over embeddings stored in a sqlite/pgvector store.
 */

import {
  HOTELS,
  RESTAURANTS,
  BARS,
  TRANSPORT,
  SAFETY_NODES,
  SPONSOR_PACKAGES,
  MERCHANT_PACKAGES,
  HOTEL_PACKAGES,
  DRIVER_PACKAGES,
  CAMPAIGNS,
} from "@/data/demoData";
import type { Place, PackageItem } from "@/lib/types";
import type { WWAIIntent } from "./intent";

// ── Types ──────────────────────────────────────────────────────────────────
export interface RetrievedRecord {
  kind: "place" | "package" | "sponsor" | "campaign";
  id: string;
  name: string;
  score: number;
  data: Record<string, unknown>;
}

export interface WWAIContext {
  records: RetrievedRecord[];
  intent: WWAIIntent;
  query: string;
}

export interface SuggestedAction {
  label: string;
  href: string;
}

// ── Tokenizer ──────────────────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

// ── Stop words to ignore in scoring ───────────────────────────────────────
const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "i", "my", "me", "we",
  "you", "your", "in", "on", "at", "to", "for", "of", "and", "or", "do",
  "how", "what", "where", "when", "near", "from", "get", "can", "would",
  "should", "it", "this", "that", "there", "be", "has", "have",
]);

function scoreText(queryTokens: string[], text: string): number {
  if (!text) return 0;
  const tokens = tokenize(text);
  let score = 0;
  for (const qt of queryTokens) {
    if (STOP_WORDS.has(qt)) continue;
    for (const t of tokens) {
      if (t === qt) score += 2;
      else if (t.startsWith(qt) || qt.startsWith(t)) score += 1;
    }
  }
  return score;
}

// ── Score a Place ──────────────────────────────────────────────────────────
function scorePlaceForQuery(place: Place, queryTokens: string[]): number {
  let s = 0;
  s += scoreText(queryTokens, place.name) * 3;
  s += scoreText(queryTokens, place.category ?? "") * 2;
  s += scoreText(queryTokens, place.type ?? "") * 2;
  s += scoreText(queryTokens, place.zone ?? "") * 2;
  s += scoreText(queryTokens, place.cuisine ?? "");
  s += scoreText(queryTokens, place.safetyNote ?? "");
  if (place.offer) s += scoreText(queryTokens, place.offer) * 1.5;
  return s;
}

// ── Score a PackageItem ────────────────────────────────────────────────────
function scorePackageForQuery(pkg: PackageItem, queryTokens: string[]): number {
  let s = 0;
  s += scoreText(queryTokens, pkg.name) * 3;
  s += scoreText(queryTokens, pkg.category ?? "") * 2;
  s += scoreText(queryTokens, pkg.bestFor ?? "") * 2;
  s += (pkg.features ?? []).reduce((acc, f) => acc + scoreText(queryTokens, f), 0);
  return s;
}

// ── Intent-to-data-set mapping ─────────────────────────────────────────────
// Future: swap retrieval per intent with vector-based lookup.
function getCandidatesForIntent(intent: WWAIIntent): {
  places: Place[];
  packages: PackageItem[];
} {
  switch (intent) {
    case "food":
      return { places: RESTAURANTS, packages: MERCHANT_PACKAGES };
    case "bars_nightlife":
      return { places: BARS, packages: MERCHANT_PACKAGES };
    case "hotel":
      return { places: HOTELS, packages: HOTEL_PACKAGES };
    case "pickup":
    case "route":
    case "return_route":
      return { places: [...TRANSPORT, ...SAFETY_NODES, ...HOTELS], packages: DRIVER_PACKAGES };
    case "sponsor_offer":
      return { places: [...RESTAURANTS, ...BARS], packages: SPONSOR_PACKAGES };
    case "sponsor_package":
      return { places: [], packages: SPONSOR_PACKAGES };
    case "restaurant_registration":
      return { places: [], packages: MERCHANT_PACKAGES };
    case "hotel_registration":
      return { places: [], packages: HOTEL_PACKAGES };
    case "driver_registration":
      return { places: [], packages: DRIVER_PACKAGES };
    case "business_registration":
      return { places: [], packages: [...MERCHANT_PACKAGES, ...SPONSOR_PACKAGES] };
    case "safety_support":
      return { places: SAFETY_NODES, packages: [] };
    case "accessibility_support":
      return { places: [...SAFETY_NODES, ...TRANSPORT], packages: [] };
    default:
      return {
        places: [...RESTAURANTS, ...HOTELS, ...TRANSPORT, ...SAFETY_NODES],
        packages: [],
      };
  }
}

// ── Main retrieval function ────────────────────────────────────────────────
// TODO: Replace with embedding-based retrieval once a vector store is wired in.
// Candidate stores: sqlite-vec, pgvector, Pinecone, Weaviate.
export function retrieveWWAIContext(query: string, intent: WWAIIntent): WWAIContext {
  const queryTokens = tokenize(query).filter((t) => !STOP_WORDS.has(t));
  const { places, packages } = getCandidatesForIntent(intent);

  const placeRecords: RetrievedRecord[] = places
    .map((p) => ({
      kind: "place" as const,
      id: p.id,
      name: p.name,
      score: scorePlaceForQuery(p, queryTokens),
      data: p as unknown as Record<string, unknown>,
    }))
    .filter((r) => r.score > 0 || places.length <= 6); // include all if small set

  const packageRecords: RetrievedRecord[] = packages
    .map((p) => ({
      kind: "package" as const,
      id: p.id,
      name: p.name,
      score: scorePackageForQuery(p, queryTokens),
      data: p as unknown as Record<string, unknown>,
    }))
    .filter((r) => r.score > 0 || packages.length <= 4);

  // Sponsor campaigns relevant to intent
  const campaignRecords: RetrievedRecord[] = (intent === "sponsor_offer" || intent === "food")
    ? CAMPAIGNS
        .filter((c) => c.status === "live")
        .map((c) => ({
          kind: "campaign" as const,
          id: c.id,
          name: c.name,
          score: scoreText(queryTokens, c.name) + scoreText(queryTokens, c.type),
          data: c as unknown as Record<string, unknown>,
        }))
    : [];

  const all = [...placeRecords, ...packageRecords, ...campaignRecords]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return { records: all, intent, query };
}

// ── Format context for LLM prompt ─────────────────────────────────────────
export function formatContextForPrompt(ctx: WWAIContext): string {
  if (ctx.records.length === 0) return "";

  const lines: string[] = ["Relevant demo data:"];
  for (const r of ctx.records) {
    if (r.kind === "place") {
      const p = r.data as unknown as Place;
      const dist = p.distanceMiles != null ? `${p.distanceMiles} mi` : "";
      const walk = p.walkMinutes != null ? `${p.walkMinutes} min walk` : "";
      const offer = p.offer ? ` | Offer: ${p.offer}` : "";
      const age = p.ageRestricted ? " | Age-restricted" : "";
      const verified = p.verified ? " | ✓ verified" : "";
      lines.push(`- ${p.name} (${p.type}, ${p.zone}) ${dist} ${walk}${offer}${age}${verified}`);
    } else if (r.kind === "package") {
      const p = r.data as unknown as PackageItem;
      lines.push(`- Package: ${p.name} — $${p.price?.toLocaleString()} — Best for: ${p.bestFor}`);
    } else if (r.kind === "campaign") {
      lines.push(`- Active campaign: ${r.name} (scans: ${(r.data as Record<string,unknown>).scans})`);
    }
  }
  return lines.join("\n");
}

// ── Suggested actions from intent + retrieved records ─────────────────────
export function getSuggestedActions(
  intent: WWAIIntent,
  records: RetrievedRecord[],
  isRestricted: boolean
): SuggestedAction[] {
  if (isRestricted) {
    return [
      { label: "Find Restaurants", href: "/restaurants" },
      { label: "Plan Route", href: "/safety-routes" },
      { label: "Driver Pickup", href: "/drivers" },
    ];
  }

  const actions: SuggestedAction[] = [];

  switch (intent) {
    case "food":
      actions.push({ label: "Browse Restaurants", href: "/restaurants" });
      if (records.some((r) => (r.data as Record<string,unknown>).offer)) {
        actions.push({ label: "View Sponsor Offers", href: "/sponsors" });
      }
      break;
    case "bars_nightlife":
      actions.push({ label: "Browse Bars & Nightlife", href: "/bars" });
      actions.push({ label: "Plan Route", href: "/safety-routes" });
      break;
    case "hotel":
      actions.push({ label: "Browse Hotels", href: "/hotels" });
      break;
    case "pickup":
    case "route":
    case "return_route":
      actions.push({ label: "Driver Pickup", href: "/drivers" });
      actions.push({ label: "Plan Route", href: "/safety-routes" });
      break;
    case "sponsor_offer":
      actions.push({ label: "View Sponsor Offers", href: "/sponsors" });
      actions.push({ label: "Browse Restaurants", href: "/restaurants" });
      break;
    case "restaurant_registration":
      actions.push({ label: "Register Restaurant", href: "/register/restaurant" });
      actions.push({ label: "View Merchant Packages", href: "/packages" });
      break;
    case "hotel_registration":
      actions.push({ label: "Register Hotel", href: "/register/hotel" });
      actions.push({ label: "View Hotel Packages", href: "/packages" });
      break;
    case "driver_registration":
      actions.push({ label: "Register as Driver", href: "/register/driver" });
      actions.push({ label: "View Driver Packages", href: "/packages" });
      break;
    case "sponsor_package":
    case "business_registration":
      actions.push({ label: "View All Packages", href: "/packages" });
      actions.push({ label: "Register Business", href: "/register/merchant" });
      break;
    case "safety_support":
      actions.push({ label: "Safety Routes", href: "/safety-routes" });
      break;
    case "what_is_wwai":
    case "what_is_troptions":
      actions.push({ label: "Learn More", href: "/about" });
      actions.push({ label: "View Demo", href: "/client-demo" });
      break;
    default:
      actions.push({ label: "Explore Map", href: "/map" });
  }

  return actions;
}

// ── Source labels for UI display ──────────────────────────────────────────
export function getSourceLabels(records: RetrievedRecord[]): string[] {
  const labels = new Set<string>();
  for (const r of records) {
    if (r.kind === "place") labels.add(`Demo ${(r.data as Record<string,unknown>).category ?? "place"} data`);
    if (r.kind === "package") labels.add("Demo package data");
    if (r.kind === "campaign") labels.add("Demo campaign data");
  }
  return Array.from(labels);
}
