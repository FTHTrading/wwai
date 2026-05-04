// MapLibre GL adapter — free, OSM raster tiles, no API key required.
// Routing uses the public OSRM demo endpoint when reachable; falls back to a straight line.

import type { OutdoorMapAdapter, RouteRequest, RouteResult, MapMarker, LatLng } from "./provider";

const DARK_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    { id: "osm", type: "raster", source: "osm" },
  ],
} as const;

export function createMapLibreAdapter(): OutdoorMapAdapter {
  return {
    id: "maplibre",

    async mount(host, opts) {
      const ml = await import("maplibre-gl");
      // Inject CSS once.
      if (typeof document !== "undefined" && !document.getElementById("maplibre-gl-css")) {
        const link = document.createElement("link");
        link.id = "maplibre-gl-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css";
        document.head.appendChild(link);
      }

      const map = new ml.Map({
        container: host,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style: DARK_STYLE as any,
        center: [opts.center.lng, opts.center.lat],
        zoom: opts.zoom,
        attributionControl: { compact: true },
      });

      const markers: import("maplibre-gl").Marker[] = [];
      const addMarkers = (list: MapMarker[]) => {
        for (const m of list) {
          const el = document.createElement("div");
          el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${m.color || "#00d5ff"};box-shadow:0 0 0 2px rgba(255,255,255,0.15),0 0 12px ${m.color || "#00d5ff"}66;cursor:pointer`;
          if (m.label) el.title = m.label;
          markers.push(new ml.Marker({ element: el }).setLngLat([m.position.lng, m.position.lat]).addTo(map));
        }
      };
      if (opts.markers?.length) addMarkers(opts.markers);

      return () => {
        markers.forEach((m) => m.remove());
        map.remove();
      };
    },

    async route(req: RouteRequest): Promise<RouteResult> {
      const profile =
        req.mode === "driving" ? "driving" :
        req.mode === "cycling" ? "cycling" : "foot";
      const url =
        `https://router.project-osrm.org/route/v1/${profile}/` +
        `${req.from.lng},${req.from.lat};${req.to.lng},${req.to.lat}` +
        `?overview=full&geometries=geojson`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const r = json.routes?.[0];
          if (r) {
            const geometry: LatLng[] = (r.geometry?.coordinates || []).map(
              ([lng, lat]: [number, number]) => ({ lat, lng })
            );
            return {
              distanceMeters: r.distance,
              durationSeconds: r.duration,
              geometry,
              provider: "maplibre",
              notes: "Route via OSRM public demo endpoint. Use a hosted router (OSRM/Valhalla) or Mapbox/Azure Directions in production.",
            };
          }
        }
      } catch {
        // fall through to straight-line
      }
      return straightLine(req, "maplibre");
    },
  };
}

function straightLine(req: RouteRequest, provider: RouteResult["provider"]): RouteResult {
  const meters = haversine(req.from, req.to);
  const speed = req.mode === "driving" ? 11 : req.mode === "cycling" ? 4.5 : 1.4; // m/s
  return {
    distanceMeters: meters,
    durationSeconds: Math.round(meters / speed),
    geometry: [req.from, req.to],
    provider,
    notes: "Straight-line estimate (no routing API reachable). Configure a routing provider for production.",
  };
}

function haversine(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
