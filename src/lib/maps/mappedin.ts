// Mappedin indoor adapter — stub. Wire NEXT_PUBLIC_MAPPEDIN_CLIENT_ID +
// NEXT_PUBLIC_MAPPEDIN_CLIENT_SECRET + NEXT_PUBLIC_MAPPEDIN_VENUE to enable.
//
// Once a venue partner provisions a Mappedin venue, install @mappedin/mappedin-js
// and replace this stub. Mappedin handles 3D venues, levels, sections, seats,
// concourses, restrooms, concessions, accessibility paths, and indoor routing.
//
// The same component shape (mount/teardown) lets us swap to ArcGIS Indoors or a
// MapLibre + IMDF renderer without touching callers.

export interface IndoorVenueOptions {
  clientId: string;
  clientSecret: string;
  venueId: string;
  level?: string;
  highlight?: { sections?: string[]; seats?: string[]; gates?: string[] };
}

export interface IndoorMapAdapter {
  id: "mappedin" | "imdf";
  mount(host: HTMLElement, opts: IndoorVenueOptions): Promise<() => void>;
  /** Indoor turn-by-turn — e.g., "Gate 3 → Section 114 → Row K, Seat 12". */
  routeIndoor(opts: IndoorVenueOptions, from: string, to: string): Promise<{
    steps: string[]; distanceMeters: number; durationSeconds: number;
  }>;
}

export function createMappedinAdapter(): IndoorMapAdapter {
  return {
    id: "mappedin",
    async mount() {
      throw new Error(
        "Mappedin adapter not implemented. `npm i @mappedin/mappedin-js` and replace " +
          "this stub once a venue partner provisions credentials and a venue id."
      );
    },
    async routeIndoor() {
      throw new Error("Mappedin indoor routing not wired. See lib/maps/mappedin.ts.");
    },
  };
}
