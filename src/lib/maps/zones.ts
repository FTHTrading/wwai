// Zone & place coordinate helpers — synthesize coords for places that don't have them yet.
import type { Place } from "@/lib/types";
import type { LatLng } from "./provider";

/** Approximate zone centers for the demo city (Atlanta-ish). */
export const ZONE_CENTERS: Record<string, LatLng> = {
  Downtown:   { lat: 33.7490, lng: -84.3880 },
  Centennial: { lat: 33.7626, lng: -84.3939 },
  Midtown:    { lat: 33.7831, lng: -84.3831 },
  Westside:   { lat: 33.7715, lng: -84.4116 },
  Buckhead:   { lat: 33.8487, lng: -84.3733 },
  Airport:    { lat: 33.6407, lng: -84.4277 },
};

export const PRIMARY_VENUE: LatLng = { lat: 33.7553, lng: -84.4006 }; // demo venue zone

/** Stable jitter so pins don't stack. Hashes the place id. */
function jitter(seed: string, scale = 0.0015): { dLat: number; dLng: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const a = ((h & 0xff) / 255 - 0.5) * 2;
  const b = (((h >> 8) & 0xff) / 255 - 0.5) * 2;
  return { dLat: a * scale, dLng: b * scale };
}

export function placeCoords(p: Place): LatLng {
  if (p.coords) return p.coords;
  const center = ZONE_CENTERS[p.zone] || PRIMARY_VENUE;
  const j = jitter(p.id);
  return { lat: center.lat + j.dLat, lng: center.lng + j.dLng };
}

export const CATEGORY_COLOR: Record<string, string> = {
  hotel:      "#00d5ff",
  restaurant: "#34d399",
  bar:        "#a78bfa",
  transport:  "#ffbf5f",
  safety:     "#ff6b6b",
  merchant:   "#f472b6",
  sponsor:    "#d6a84f",
  venue:      "#60a5fa",
  driver:     "#facc15",
};
