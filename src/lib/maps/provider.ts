// Map provider abstraction — flip providers via env var.
// Supported: "demo" (built-in SVG, no deps), "maplibre" (free, OSM tiles),
//            "mapbox" (Mapbox GL — needs NEXT_PUBLIC_MAPBOX_TOKEN),
//            "mappedin" (indoor venue — needs Mappedin client creds + venue id).

export type MapProviderId = "demo" | "maplibre" | "mapbox" | "mappedin";

export interface LatLng { lat: number; lng: number }

export interface MapMarker {
  id: string;
  position: LatLng;
  label?: string;
  color?: string;
  category?: string;
}

export interface RouteRequest {
  from: LatLng;
  to: LatLng;
  mode: "walking" | "driving" | "cycling";
}

export interface RouteResult {
  distanceMeters: number;
  durationSeconds: number;
  geometry: LatLng[];          // polyline
  provider: MapProviderId;
  notes?: string;
}

export interface OutdoorMapAdapter {
  id: MapProviderId;
  /** Mount the map into a host DOM element. Returns a teardown fn. */
  mount(host: HTMLElement, opts: { center: LatLng; zoom: number; markers?: MapMarker[] }): Promise<() => void>;
  /** Compute a route. Implementations may return a straight-line fallback if no routing API is wired. */
  route(req: RouteRequest): Promise<RouteResult>;
}

export interface ProviderConfig {
  outdoor: MapProviderId;
  indoor: "mappedin" | "imdf" | "demo";
  mapboxToken?: string;
  azureMapsKey?: string;
  mappedinClientId?: string;
  mappedinClientSecret?: string;
  mappedinVenue?: string;
}

export function readProviderConfig(): ProviderConfig {
  const env = (k: string) =>
    typeof process !== "undefined" ? process.env[k] : undefined;
  // Default to MapLibre — free OSM tiles + OSRM routing, no API key needed.
  // Set NEXT_PUBLIC_MAP_PROVIDER=demo to fall back to the built-in SVG.
  const raw = (env("NEXT_PUBLIC_MAP_PROVIDER") || "").trim().toLowerCase();
  const outdoor = (raw || "maplibre") as MapProviderId;
  const indoor =
    (env("NEXT_PUBLIC_INDOOR_PROVIDER") as ProviderConfig["indoor"]) || "demo";
  return {
    outdoor,
    indoor,
    mapboxToken:          env("NEXT_PUBLIC_MAPBOX_TOKEN"),
    azureMapsKey:         env("NEXT_PUBLIC_AZURE_MAPS_KEY"),
    mappedinClientId:     env("NEXT_PUBLIC_MAPPEDIN_CLIENT_ID"),
    mappedinClientSecret: env("NEXT_PUBLIC_MAPPEDIN_CLIENT_SECRET"),
    mappedinVenue:        env("NEXT_PUBLIC_MAPPEDIN_VENUE"),
  };
}

/** Lazy-load the adapter so map libraries never enter the main bundle. */
export async function getOutdoorAdapter(cfg = readProviderConfig()): Promise<OutdoorMapAdapter | null> {
  switch (cfg.outdoor) {
    case "maplibre":
      return (await import("./maplibre")).createMapLibreAdapter();
    case "mapbox":
      if (!cfg.mapboxToken) return null;
      return (await import("./mapbox")).createMapboxAdapter(cfg.mapboxToken);
    case "mappedin":
      // Indoor-only provider; outdoor falls back to maplibre when paired.
      return (await import("./maplibre")).createMapLibreAdapter();
    case "demo":
    default:
      return null;
  }
}
