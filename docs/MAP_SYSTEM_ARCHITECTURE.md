# Map System Architecture

## Overview
The Live Ops map (`/map`) visualizes all active venues, events, and sponsor activations as geo-pins. It is designed to work in degraded mode (venue list) without a paid map provider.

## Current State
- `/map/page.tsx` uses hard-coded venue objects for display
- `MapContainer` component provides the abstraction layer for tile provider integration
- Venue list from DB available via GET `/api/venues`

## Data Model
Venue pins are derived from the `Venue` Prisma model:
```typescript
interface VenuePin {
  id:       string;
  name:     string;
  lat:      number | null;
  lng:      number | null;
  city:     string;
  category: string;  // stadium | hotel | transit | entertainment | food | retail | general
  status:   string;  // prospect | onboarded | active | inactive
}
```

Only venues with non-null `lat`/`lng` are rendered as map pins. Others fall back to the venue list view.

## MapContainer Component
Located at `src/components/MapContainer.tsx`.

Props:
```typescript
interface MapContainerProps {
  venues: VenuePin[];
  height?: string;   // default "500px"
}
```

Behavior:
- If `NEXT_PUBLIC_MAP_PROVIDER` is unset → renders styled venue list (grid cards)
- If set to `maplibre` → loads MapLibre GL JS from CDN, renders pins
- If set to `mapbox` → loads Mapbox GL JS (requires `NEXT_PUBLIC_MAPBOX_TOKEN`)

## Tile Provider Setup

### Option A: OpenFreeMap (Free, No Key)
```env
NEXT_PUBLIC_MAP_PROVIDER=maplibre
NEXT_PUBLIC_MAP_TILES=https://tiles.openfreemap.org/styles/liberty
```

### Option B: Mapbox
```env
NEXT_PUBLIC_MAP_PROVIDER=mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

### Option C: No Map (Venue List Only)
Leave `NEXT_PUBLIC_MAP_PROVIDER` unset. MapContainer renders the venue grid fallback.

## Connecting Map to Live DB
Replace the hard-coded venues in `/map/page.tsx`:
```tsx
// In /map/page.tsx
const [venues, setVenues] = useState<VenuePin[]>([]);
useEffect(() => {
  fetch("/api/venues?status=active")
    .then(r => r.json())
    .then(d => setVenues(d.filter((v: VenuePin) => v.lat && v.lng)));
}, []);
```

## Category Icon Map
```typescript
const CAT_ICON: Record<string, string> = {
  stadium:       "🏟",
  hotel:         "🏨",
  transit:       "🚉",
  entertainment: "🎪",
  food:          "🍽",
  retail:        "🛍",
  general:       "📍",
};
```
