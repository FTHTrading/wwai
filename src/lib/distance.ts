// Distance + travel time helpers (demo)
import type { Coordinates } from "./types";

const EARTH_RADIUS_MILES = 3958.8;

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function calculateDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export function distanceBetween(a: Coordinates, b: Coordinates): number {
  return calculateDistanceMiles(a.lat, a.lng, b.lat, b.lng);
}

// 3 mph walk → 20 min/mile
export function estimateWalkMinutes(distanceMiles: number): number {
  return Math.max(1, Math.round(distanceMiles * 20));
}

// 18 mph average urban drive → 3.3 min/mile
export function estimateDriveMinutes(distanceMiles: number): number {
  return Math.max(1, Math.round(distanceMiles * 3.3));
}

// 12 mph shuttle w/ stops → 5 min/mile
export function estimateShuttleMinutes(distanceMiles: number): number {
  return Math.max(2, Math.round(distanceMiles * 5));
}

export function formatDistance(distanceMiles: number): string {
  if (distanceMiles < 0.1) return `${Math.round(distanceMiles * 5280)} ft`;
  if (distanceMiles < 1) return `${distanceMiles.toFixed(1)} mi`;
  return `${distanceMiles.toFixed(1)} mi`;
}
