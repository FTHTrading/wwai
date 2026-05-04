import AppShell from "@/components/layout/AppShell";
import { HOTELS } from "@/data/demoData";
import Link from "next/link";

export default function HotelsPage() {
  return (
    <AppShell
      title="Hotel Network"
      subtitle="Verified hotels with guest route packages, concierge integration, and safety-informed pickup zones."
      badges={["Demo data"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HOTELS.map((h) => (
          <div key={h.id} className="wwai-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-bold text-white">{h.name}</div>
                <div className="text-xs text-slate-400">{h.zone}</div>
              </div>
              {h.verified && <span className="wwai-chip wwai-chip-cyan">Verified</span>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1 text-center">
              <Stat label="Distance" value={`${h.distanceMiles} mi`} />
              <Stat label="Drive"    value={`${h.driveMinutes ?? "—"}m`} />
              <Stat label="Shuttle"  value={`${h.shuttleMinutes ?? "—"}m`} />
            </div>
            <div className="text-xs text-slate-400 mt-3 space-y-1">
              <div>Guest route package: <span className="text-cyan-300">Available</span></div>
              <div>Pickup notes: Operator-reviewed in production</div>
              <div>Concierge integration: <span className="text-amber-300">Demo</span></div>
              <div>Safety route: {h.safetyNote || "Available"}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href="/safety-routes" className="wwai-btn-primary text-xs">Build Guest Route</Link>
              <Link href="/register/hotel" className="wwai-btn-ghost text-xs">Register Hotel</Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#0a1220] border border-[#162035] py-2">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}
