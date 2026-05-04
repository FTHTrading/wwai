import AppShell from "@/components/layout/AppShell";
import { CAMPAIGNS, HOTELS } from "@/data/demoData";

export default function VenuesPage() {
  return (
    <AppShell
      title="Venues & Hotel Network"
      subtitle="Venue zones, hotel partners, sponsor capacity, active campaigns, QR activity, and safety-informed routing."
      badges={["Demo data"]}
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="wwai-panel p-5">
          <h3 className="font-bold text-white">Venue Zones</h3>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {["Downtown", "Centennial", "Midtown", "Westside"].map((z, i) => (
              <div key={z} className="wwai-card p-4">
                <div className="font-bold text-white">{z}</div>
                <div className="text-xs text-slate-400 mt-1">Sponsor capacity: {6 + i * 2}/12</div>
                <div className="text-xs text-slate-400">QR activity: <span className="text-cyan-300">live</span></div>
                <div className="text-xs text-slate-400">Safety route: <span className="text-amber-300">operator-reviewed in production</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="wwai-panel p-5">
          <h3 className="font-bold text-white">Hotel Partners</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {HOTELS.map((h) => (
              <li key={h.id} className="flex items-center justify-between border-b border-[#0d1626] py-2">
                <span className="text-slate-200">{h.name}</span>
                <span className="text-xs text-slate-500">{h.zone} · {h.distanceMiles} mi</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="wwai-panel p-5 lg:col-span-2">
          <h3 className="font-bold text-white">Active Campaigns</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {CAMPAIGNS.filter((c) => c.status === "live").map((c) => (
              <div key={c.id} className="wwai-card p-4">
                <div className="font-bold text-white">{c.name}</div>
                <div className="text-xs text-slate-400">{c.type} · {c.zone}</div>
                <div className="text-xs text-slate-400 mt-1">{c.scans} scans · {c.redemptions} redemptions</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
