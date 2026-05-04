"use client";

import { useMemo, useState } from "react";
import { ALL_PLACES, HOTELS, TRANSPORT, LANGUAGES } from "@/data/demoData";
import type { Place } from "@/lib/types";
import { estimateDriveMinutes, estimateShuttleMinutes, estimateWalkMinutes, formatDistance } from "@/lib/distance";

const TRAVEL_MODES = ["walk", "shuttle", "driver", "rideshare"] as const;
type TravelMode = typeof TRAVEL_MODES[number];

const DESTINATIONS = [
  { id: "venue",  label: "Primary venue zone" },
  { id: "gate",   label: "Gate / entry area" },
  { id: "seat",   label: "Seating section" },
  { id: "hotel",  label: "Hotel return" },
  { id: "pickup", label: "Pickup zone" },
];

export default function SafetyRoutePlanner() {
  const startOptions: Place[] = useMemo(
    () => [...HOTELS, ...ALL_PLACES.filter((p) => p.category === "restaurant" || p.category === "bar" || p.category === "transport")],
    []
  );
  const [startId, setStartId] = useState(startOptions[0].id);
  const [destination, setDestination] = useState(DESTINATIONS[0].id);
  const [mode, setMode] = useState<TravelMode>("walk");
  const [language, setLanguage] = useState("en");
  const [accessibility, setAccessibility] = useState(false);
  const [returnRoute, setReturnRoute] = useState(true);

  const start = startOptions.find((s) => s.id === startId)!;

  const distance = start.distanceMiles;
  const minutes =
    mode === "walk"     ? estimateWalkMinutes(distance) :
    mode === "shuttle"  ? estimateShuttleMinutes(distance) :
    estimateDriveMinutes(distance);

  const checkpoints = [
    `Exit ${start.name}`,
    mode === "walk" ? "Recommended public corridor" : "Operator-staffed pickup",
    accessibility ? "Accessibility-friendly path" : "Primary path",
    "Safety support node nearby",
    `Arrive at ${DESTINATIONS.find((d) => d.id === destination)?.label}`,
  ];

  const pickup = TRANSPORT.find((t) => t.zone === start.zone) || TRANSPORT[0];

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-6">
      <div className="wwai-panel p-5 space-y-3">
        <h3 className="text-lg font-bold text-white">Plan Route</h3>

        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Starting point</label>
          <select value={startId} onChange={(e) => setStartId(e.target.value)} className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm">
            {startOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.zone})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Destination</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm">
            {DESTINATIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Travel mode</label>
          <div className="mt-1 grid grid-cols-4 gap-1">
            {TRAVEL_MODES.map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`text-xs py-2 rounded-lg border ${mode === m ? "bg-cyan-400/10 border-cyan-400 text-cyan-300" : "border-[#162035] text-slate-400"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full bg-[#0a1220] border border-[#162035] rounded-lg p-2 text-sm">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} className="accent-cyan-400" />Accessibility needs</label>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={returnRoute} onChange={(e) => setReturnRoute(e.target.checked)} className="accent-cyan-400" />Include return route</label>
        </div>
      </div>

      <div className="wwai-panel p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-400">Recommended demo route</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {start.name} → {DESTINATIONS.find((d) => d.id === destination)?.label}
            </div>
          </div>
          <span className="wwai-chip wwai-chip-amber">Safety-informed</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Distance" value={formatDistance(distance)} />
          <Stat label="Est. time" value={`${minutes} min`} />
          <Stat label="Mode" value={mode} />
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Checkpoints</div>
          <ol className="space-y-1.5 text-sm text-slate-300 list-decimal list-inside">
            {checkpoints.map((c, i) => <li key={i}>{c}</li>)}
          </ol>
        </div>

        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <Note title="Pickup / dropoff" body={`${pickup.name} (${pickup.zone}). ${pickup.safetyNote || "Operator-reviewed in production."}`} />
          <Note title="Support contact" body="Operator support line — placeholder. Production routes through safety ops desk." />
        </div>

        {returnRoute && (
          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm text-amber-200">
            Return route: {DESTINATIONS.find((d) => d.id === destination)?.label} → {start.name} via {pickup.name}.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button className="wwai-btn-primary text-sm">Generate QR Route Pass (demo)</button>
          <button className="wwai-btn-ghost text-sm">Send to Driver Pickup Zone</button>
          <button className="wwai-btn-disabled text-sm" disabled>Live Map Provider — needs config</button>
        </div>

        <p className="disclaimer-bar">
          Safety guidance is informational and demo-based unless connected to verified local data, official agencies, and live operator review. For emergencies, contact local emergency services immediately.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#0a1220] border border-[#162035]">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-lg font-bold text-white capitalize">{value}</div>
    </div>
  );
}
function Note({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#0a1220] border border-[#162035]">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{title}</div>
      <div className="text-slate-300 mt-1">{body}</div>
    </div>
  );
}
