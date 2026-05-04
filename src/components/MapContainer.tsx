"use client";
import { useEffect, useRef, useState } from "react";

export interface VenuePin {
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
  venues:  VenuePin[];
  height?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

const CAT_ICON: Record<string, string> = {
  stadium:       "🏟",
  hotel:         "🏨",
  transit:       "🚉",
  entertainment: "🎪",
  food:          "🍽",
  retail:        "🛍",
  general:       "📍",
};

const CAT_COLOR: Record<string, string> = {
  stadium:       "#00d4ff",
  hotel:         "#d4a017",
  transit:       "#a78bfa",
  entertainment: "#f472b6",
  food:          "#fb923c",
  retail:        "#4ade80",
  general:       "#94a3b8",
};

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  active:    { text: "Active",    color: "#4ade80" },
  onboarded: { text: "Onboarded", color: "#60a5fa" },
  prospect:  { text: "Prospect",  color: "#94a3b8" },
  inactive:  { text: "Inactive",  color: "#ef4444" },
};

export default function MapContainer({ venues, height = "480px", centerLat = 33.749, centerLng = -84.388, zoom = 11 }: Props) {
  const mapRef    = useRef<HTMLDivElement>(null);
  const mapObj    = useRef<unknown>(null);
  const [ready,   setReady]   = useState(false);
  const [mapError, setMapError] = useState(false);
  const [selected, setSelected] = useState<VenuePin | null>(null);

  const mappable = venues.filter(v => v.lat != null && v.lng != null);

  useEffect(() => {
    let cancelled = false;
    async function initMap() {
      if (!mapRef.current || mappable.length === 0) return;
      try {
        const ml = await import("maplibre-gl");
        const maplibre = ml.default ?? ml;
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !mapRef.current) return;

        const map = new maplibre.Map({
          container: mapRef.current,
          style: "https://tiles.openfreemap.org/styles/liberty",
          center: [centerLng, centerLat],
          zoom,
          attributionControl: { compact: true },
        });

        map.on("load", () => {
          if (cancelled) return;
          for (const venue of mappable) {
            if (venue.lat == null || venue.lng == null) continue;
            const color = CAT_COLOR[venue.category] ?? "#94a3b8";
            const el = document.createElement("div");
            el.style.cssText = `
              width: 36px; height: 36px; border-radius: 50%;
              background: ${color}22; border: 2.5px solid ${color};
              display: flex; align-items: center; justify-content: center;
              font-size: 16px; cursor: pointer; transition: transform 0.15s;
              box-shadow: 0 0 12px ${color}44;
            `;
            el.innerHTML = CAT_ICON[venue.category] ?? "📍";
            el.title = venue.name;
            el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.2)"; });
            el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
            el.addEventListener("click",      () => setSelected(venue));

            new maplibre.Marker({ element: el })
              .setLngLat([venue.lng, venue.lat])
              .addTo(map);
          }
          setReady(true);
        });

        map.on("error", () => setMapError(true));
        mapObj.current = map;
      } catch {
        setMapError(true);
      }
    }
    initMap();
    return () => {
      cancelled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapObj.current as any)?.remove?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback list (always shown when map fails or no tiles)
  if (mapError || mappable.length === 0) {
    return <VenueFallback venues={venues} selected={selected} onSelect={setSelected} />;
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#162035]" style={{ height }}>
      {/* Map canvas */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Loading overlay */}
      {!ready && (
        <div className="absolute inset-0 bg-[#050810] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="troptions-hex-sm mx-auto">T</div>
            <p className="text-slate-400 text-sm">Loading map…</p>
          </div>
        </div>
      )}

      {/* Venue count badge */}
      {ready && (
        <div className="absolute top-3 left-3 bg-[#050810]/90 border border-[#162035] rounded-lg px-3 py-1.5 text-xs text-slate-300 backdrop-blur-sm">
          <span className="text-[#00d4ff] font-bold">{mappable.length}</span> active venues
        </div>
      )}

      {/* Selected venue popup */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-[#0a0f1e]/95 border border-[#162035] rounded-xl p-4 backdrop-blur-sm shadow-2xl">
          <button onClick={() => setSelected(null)} className="absolute top-2 right-3 text-slate-500 hover:text-white text-lg leading-none">×</button>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{CAT_ICON[selected.category] ?? "📍"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{selected.name}</p>
              <p className="text-slate-500 text-xs">{selected.address ?? selected.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs capitalize font-medium" style={{ color: CAT_COLOR[selected.category] ?? "#94a3b8" }}>
              {selected.category}
            </span>
            {selected.capacity && (
              <span className="text-slate-500 text-xs">· {selected.capacity.toLocaleString()} cap.</span>
            )}
            <span className="ml-auto text-xs font-semibold" style={{ color: STATUS_LABEL[selected.status]?.color ?? "#94a3b8" }}>
              {STATUS_LABEL[selected.status]?.text ?? selected.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function VenueFallback({ venues, selected, onSelect }: { venues: VenuePin[]; selected: VenuePin | null; onSelect: (v: VenuePin) => void }) {
  return (
    <div className="rounded-xl border border-[#162035] overflow-hidden">
      <div className="bg-[#0a0f1e] px-4 py-2.5 border-b border-[#162035] flex items-center justify-between">
        <span className="text-slate-400 text-xs">Venue Network — {venues.length} locations</span>
        <span className="text-slate-600 text-xs">Map tiles require internet connection</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 bg-[#050810] max-h-[420px] overflow-y-auto">
        {venues.map(v => (
          <button key={v.id} onClick={() => onSelect(v)}
            className={`text-left p-3 rounded-lg border transition-all ${
              selected?.id === v.id
                ? "border-[#00d4ff] bg-[#00d4ff]/5"
                : "border-[#162035] hover:border-[#00d4ff]/30"
            }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{CAT_ICON[v.category] ?? "📍"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{v.name}</p>
                <p className="text-slate-500 text-[10px] truncate">{v.city}</p>
              </div>
            </div>
            {v.lat && v.lng && (
              <p className="text-slate-600 text-[10px] mt-1 font-mono">{v.lat.toFixed(4)}, {v.lng.toFixed(4)}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
