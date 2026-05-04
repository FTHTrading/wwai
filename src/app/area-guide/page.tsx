"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { ALL_PLACES, ZONES } from "@/data/demoData";
import type { Place } from "@/lib/types";

const FILTERS: { id: string; label: string; match: (p: Place) => boolean }[] = [
  { id: "hotels",        label: "Hotels",         match: (p) => p.category === "hotel" },
  { id: "restaurants",   label: "Restaurants",    match: (p) => p.category === "restaurant" },
  { id: "bars",          label: "Bars",           match: (p) => p.category === "bar" },
  { id: "family",        label: "Family-friendly",match: (p) => !p.ageRestricted && (p.category === "restaurant" || p.category === "merchant") },
  { id: "transport",     label: "Transportation", match: (p) => p.category === "transport" },
  { id: "offers",        label: "Sponsor offers", match: (p) => Boolean(p.offer) },
  { id: "verified",      label: "Verified partners", match: (p) => p.verified },
  { id: "openLate",      label: "Open late",      match: (p) => Boolean(p.openLate) },
];

const DISTANCES = [
  { id: 0.5, label: "Within 0.5 mi" },
  { id: 1,   label: "Within 1 mi" },
  { id: 2,   label: "Within 2 mi" },
  { id: 5,   label: "Within 5 mi" },
];

export default function AreaGuidePage() {
  const [active, setActive] = useState<Set<string>>(new Set(["hotels", "restaurants"]));
  const [maxDist, setMaxDist] = useState<number | null>(null);
  const [zone, setZone] = useState("");

  const toggle = (id: string) => {
    const n = new Set(active);
    if (n.has(id)) n.delete(id); else n.add(id);
    setActive(n);
  };

  const filtered = useMemo(() => {
    return ALL_PLACES.filter((p) => {
      if (active.size > 0) {
        const matchAny = Array.from(active).some((id) => FILTERS.find((f) => f.id === id)?.match(p));
        if (!matchAny) return false;
      }
      if (maxDist != null && p.distanceMiles > maxDist) return false;
      if (zone && p.zone !== zone) return false;
      return true;
    });
  }, [active, maxDist, zone]);

  return (
    <AppShell
      title="Area Guide"
      subtitle="Hotels, restaurants, bars, family spots, transportation, and sponsor offers around the event zone."
      badges={["Demo data", "Verified partners labeled"]}
    >
      <div className="grid lg:grid-cols-[260px_1fr] gap-5">
        <aside className="wwai-panel p-4 space-y-4 h-fit">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Filters</div>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button key={f.id} onClick={() => toggle(f.id)} className={`text-xs px-2.5 py-1 rounded-full border ${
                  active.has(f.id) ? "bg-cyan-400/10 border-cyan-400 text-cyan-300" : "border-[#162035] text-slate-400"
                }`}>{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Distance</div>
            <div className="flex flex-col gap-1">
              {DISTANCES.map((d) => (
                <label key={d.id} className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="radio" name="dist" checked={maxDist === d.id} onChange={() => setMaxDist(d.id)} className="accent-cyan-400" />
                  {d.label}
                </label>
              ))}
              <button onClick={() => setMaxDist(null)} className="text-xs text-slate-500 hover:text-cyan-400 mt-1">Clear distance</button>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Zone</div>
            <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm">
              <option value="">All zones</option>
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((p) => (
              <div key={p.id} className="wwai-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.type} · {p.zone} · {p.distanceMiles} mi</div>
                  </div>
                  {p.verified && <span className="wwai-chip wwai-chip-cyan">Verified</span>}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {p.walkMinutes ? `${p.walkMinutes}m walk · ` : ""}
                  {p.driveMinutes ? `${p.driveMinutes}m drive` : ""}
                  {p.shuttleMinutes ? ` · ${p.shuttleMinutes}m shuttle` : ""}
                </div>
                {p.offer    && <div className="text-xs text-amber-300 mt-1">Offer: {p.offer}</div>}
                {p.safetyNote && <div className="text-xs text-cyan-300 mt-1">{p.safetyNote}</div>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button className="wwai-btn-ghost text-xs">View Details</button>
                  <a href="/safety-routes" className="wwai-btn-ghost text-xs">Get Route</a>
                  <a href="/register" className="wwai-btn-ghost text-xs">Register Similar</a>
                </div>
              </div>
            ))}
          </div>

          <section className="wwai-panel p-6">
            <h3 className="text-xl font-extrabold text-white">Sell the surrounding area</h3>
            <p className="text-slate-300 mt-2">
              TROPTIONS turns the area around a major event into sellable inventory: hotels,
              restaurants, bars, merchants, driver zones, sponsor offers, QR campaigns,
              safety-informed routes, and guest support.
            </p>
            <div className="flex gap-2 mt-4">
              <a href="/packages" className="wwai-btn-primary text-sm">View Packages</a>
              <a href="/register" className="wwai-btn-ghost text-sm">Register Business</a>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
