"use client";

import { useMemo, useState } from "react";
import { ALL_PLACES, ZONES } from "@/data/demoData";
import type { Place } from "@/lib/types";
import LiveMap from "@/components/map/LiveMap";
import { CATEGORY_COLOR, PRIMARY_VENUE, placeCoords } from "@/lib/maps/zones";
import { readProviderConfig, type MapMarker } from "@/lib/maps/provider";

const LAYERS: { id: Place["category"]; label: string; color: string }[] = [
  { id: "hotel",      label: "Hotels",         color: "#00d5ff" },
  { id: "restaurant", label: "Restaurants",    color: "#34d399" },
  { id: "bar",        label: "Bars",           color: "#a78bfa" },
  { id: "transport",  label: "Pickup Zones",   color: "#ffbf5f" },
  { id: "safety",     label: "Safety Nodes",   color: "#ff6b6b" },
];

export default function CommandMap() {
  const [active, setActive] = useState<Record<string, boolean>>({
    hotel: true, restaurant: true, bar: true, transport: true, safety: true, sponsor: false, merchant: false, venue: false, driver: false,
  });
  const [selected, setSelected] = useState<Place | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string>("");

  const filtered = useMemo(
    () => ALL_PLACES.filter((p) => active[p.category] && (!zoneFilter || p.zone === zoneFilter)),
    [active, zoneFilter]
  );

  const provider = readProviderConfig().outdoor;
  const liveMarkers: MapMarker[] = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.id,
        position: placeCoords(p),
        label: p.name,
        color: CATEGORY_COLOR[p.category] || "#00d5ff",
        category: p.category,
      })),
    [filtered]
  );

  // Position pins on a synthetic 100x100 grid keyed off zone + index.
  const zonePos: Record<string, { x: number; y: number }> = {
    Downtown:   { x: 50, y: 60 },
    Centennial: { x: 42, y: 50 },
    Midtown:    { x: 55, y: 30 },
    Westside:   { x: 28, y: 55 },
    Buckhead:   { x: 70, y: 18 },
    Airport:    { x: 18, y: 88 },
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4">
      <div className="space-y-3">
        {provider !== "demo" && (
          <LiveMap center={PRIMARY_VENUE} zoom={12} markers={liveMarkers} height={520} />
        )}
        <div className="wwai-panel p-3 relative overflow-hidden hud-grid-bg" style={{ minHeight: provider === "demo" ? 520 : 240 }}>
          <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-30">
            <line x1="50" y1="60" x2="42" y2="50" stroke="#00d5ff" strokeWidth="0.3" />
            <line x1="50" y1="60" x2="55" y2="30" stroke="#00d5ff" strokeWidth="0.3" />
            <line x1="50" y1="60" x2="28" y2="55" stroke="#00d5ff" strokeWidth="0.3" />
            <line x1="50" y1="60" x2="70" y2="18" stroke="#00d5ff" strokeWidth="0.3" />
            <line x1="42" y1="50" x2="18" y2="88" stroke="#00d5ff" strokeWidth="0.3" />
          </svg>
        </div>
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-cyan-400">Demo City Map · Operational View</div>
        {filtered.map((p, i) => {
          const base = zonePos[p.zone] || { x: 50, y: 50 };
          const offset = ((i % 5) - 2) * 2;
          const x = base.x + offset;
          const y = base.y + ((i % 3) - 1) * 2;
          const layer = LAYERS.find((l) => l.id === p.category);
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              style={{ left: `${x}%`, top: `${y}%`, color: layer?.color }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring-2 ring-current/50 bg-current hover:scale-150 transition-transform"
              aria-label={p.name}
              title={p.name}
            />
          );
        })}
        {Object.entries(zonePos).map(([z, pos]) => (
          <div key={z} style={{ left: `${pos.x}%`, top: `${pos.y - 6}%` }} className="absolute -translate-x-1/2 text-[10px] uppercase tracking-widest text-slate-500">
            {z}
          </div>
        ))}
        <div className="absolute bottom-3 left-3 disclaimer-bar">
          {provider === "demo"
            ? "Demo visualization. Set NEXT_PUBLIC_MAP_PROVIDER=maplibre for a live OSM map."
            : `Live provider: ${provider}. Demo grid retained as fallback view.`}
        </div>
      </div>
      </div>

      <div className="space-y-3">
        <div className="wwai-panel p-4">
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Layers</div>
          <div className="space-y-1.5">
            {LAYERS.map((l) => (
              <label key={l.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(active[l.id])}
                  onChange={() => setActive((s) => ({ ...s, [l.id]: !s[l.id] }))}
                  className="accent-cyan-400"
                />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-slate-300">{l.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs uppercase tracking-widest text-slate-500">Zone</label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm"
            >
              <option value="">All zones</option>
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        <div className="wwai-panel p-4 min-h-[180px]">
          <div className="text-xs uppercase tracking-widest text-slate-500">Selected</div>
          {selected ? (
            <div className="mt-2">
              <div className="text-base font-bold text-white">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.type} · {selected.zone}</div>
              <div className="mt-2 text-sm text-slate-300">
                {selected.distanceMiles} mi · {selected.walkMinutes ? `${selected.walkMinutes} min walk` : selected.driveMinutes ? `${selected.driveMinutes} min drive` : ""}
              </div>
              {selected.safetyNote && (
                <div className="mt-2 text-xs text-amber-300">{selected.safetyNote}</div>
              )}
              <a href="/safety-routes" className="wwai-btn-primary text-xs mt-3 inline-block">Get Route</a>
            </div>
          ) : (
            <div className="text-slate-500 text-sm mt-2">Click a pin to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
