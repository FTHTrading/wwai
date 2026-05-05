import AppShell from "@/components/layout/AppShell";
import { TRANSPORT } from "@/data/demoData";
import Link from "next/link";

export default function DriversPage() {
  return (
    <AppShell
      brand="whichway"
      eyebrow="Driver Pickup"
      title="How to Get There"
      subtitle="Verified drivers, shuttle operators, and pickup zone partners. WhichWay AI is an independent platform and not affiliated with any rideshare brand."
      badges={["Independent platform"]}
    >
      <p className="disclaimer-bar mb-4">Not affiliated with Uber, Lyft, or other rideshare brands.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRANSPORT.map((t) => (
          <div key={t.id} className="wwai-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-xs text-slate-400">{t.type} · {t.zone}</div>
              </div>
              {t.verified && <span className="wwai-chip wwai-chip-cyan">Verified</span>}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Pickup zone · {t.distanceMiles} mi from venue
            </div>
            {t.safetyNote && <div className="text-xs text-amber-300 mt-1">{t.safetyNote}</div>}
            <div className="mt-3 text-xs text-slate-400">
              Route availability: <span className="text-cyan-300">Active</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href="/register/driver" className="wwai-btn-primary text-xs">Register Driver</Link>
              <Link href="/safety-routes" className="wwai-btn-ghost text-xs">View Pickup Zone</Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
