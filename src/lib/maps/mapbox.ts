// Mapbox GL adapter — stub. Wire NEXT_PUBLIC_MAPBOX_TOKEN to enable.
// Implementation matches MapLibre's API on purpose; adding mapbox-gl as a dep
// is left to whoever flips this provider on so it stays out of the default bundle.

import type { OutdoorMapAdapter } from "./provider";

export function createMapboxAdapter(_token: string): OutdoorMapAdapter {
  void _token;
  return {
    id: "mapbox",
    async mount() {
      throw new Error(
        "Mapbox adapter not implemented yet. Run `npm i mapbox-gl` and replace this stub, " +
          "or set NEXT_PUBLIC_MAP_PROVIDER=maplibre to use the free OSM adapter."
      );
    },
    async route() {
      throw new Error("Mapbox routing not wired. See lib/maps/mapbox.ts.");
    },
  };
}
