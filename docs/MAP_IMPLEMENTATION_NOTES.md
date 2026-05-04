# Map Implementation Notes

## Overview

The TROPTIONS platform uses **MapLibre GL JS** for interactive venue maps. MapLibre is an open-source fork of Mapbox GL JS that works with any compatible tile source.

---

## Component Architecture

```
src/components/MapContainer.tsx
```

### Props

```ts
interface VenuePin {
  id:       string;
  name:     string;
  city:     string;
  lat:      number | null;
  lng:      number | null;
  category: string;
  status:   string;
  capacity: number | null;
  address:  string | null;
}

interface Props {
  venues:    VenuePin[];
  height?:   string;           // default: "480px"
  centerLat?: number;          // default: 33.749 (Atlanta)
  centerLng?: number;          // default: -84.388 (Atlanta)
  zoom?:     number;           // default: 11
}
```

### Usage

```tsx
import dynamic from "next/dynamic";
import type { VenuePin } from "@/components/MapContainer";

const MapContainer = dynamic(() => import("@/components/MapContainer"), { ssr: false });

// then:
<MapContainer venues={venues} height="460px" />
```

**Important:** The `dynamic(..., { ssr: false })` is required. MapLibre GL accesses `window`/`document` and cannot run on the server.

---

## Tile Source

Default tile source: **OpenFreeMap**

```
https://tiles.openfreemap.org/styles/liberty
```

- ✅ Free, no API key required
- ✅ OpenStreetMap data, updated regularly
- ✅ Works offline once tiles are cached
- ✅ Liberty style: clean dark-compatible basemap

### Changing the Tile Source

Set `NEXT_PUBLIC_MAP_TILES` in `.env.local`:

```
# Mapbox
NEXT_PUBLIC_MAP_TILES=mapbox://styles/mapbox/dark-v11

# Maptiler
NEXT_PUBLIC_MAP_TILES=https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY

# Custom self-hosted
NEXT_PUBLIC_MAP_TILES=http://localhost:8080/styles/dark/style.json
```

Then update `MapContainer.tsx` line:
```ts
style: process.env.NEXT_PUBLIC_MAP_TILES ?? "https://tiles.openfreemap.org/styles/liberty",
```

---

## Venue Category → Marker Color

| Category      | Color   | Emoji |
|---------------|---------|-------|
| stadium       | #00d4ff | 🏟    |
| hotel         | #d4a017 | 🏨    |
| transit       | #a78bfa | 🚉    |
| entertainment | #f472b6 | 🎪    |
| food          | #fb923c | 🍽    |
| retail        | #4ade80 | 🛍    |
| general       | #94a3b8 | 📍    |

---

## Fallback Behavior

When MapLibre tiles cannot load (offline, no internet, error), the component automatically renders a **venue card grid** showing the same data without a map. The fallback is also used when no venues have coordinates.

---

## Adding Coordinates to Venues

Venues are stored in the `Venue` table with `lat` and `lng` fields (Float? in Prisma). Only venues with non-null coordinates appear as map pins.

To geocode a venue address, use any geocoding service and update via Prisma Studio (`npm run db:studio`) or the API:

```bash
PATCH /api/venues/:id
{ "lat": 33.7554, "lng": -84.4009 }
```

---

## Dependencies

```json
"maplibre-gl": "^5.x"
```

The MapLibre CSS is imported dynamically inside `useEffect` to avoid SSR issues:
```ts
await import("maplibre-gl/dist/maplibre-gl.css");
```
