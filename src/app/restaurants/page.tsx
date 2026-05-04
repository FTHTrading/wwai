import AppShell from "@/components/layout/AppShell";
import { RESTAURANTS } from "@/data/demoData";
import Link from "next/link";

export default function RestaurantsPage() {
  return (
    <AppShell
      title="Restaurant Network"
      subtitle="Verified restaurants near event zones with QR offers and family-friendly listings."
      badges={["Demo data"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RESTAURANTS.map((r) => (
          <div key={r.id} className="wwai-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white">{r.name}</div>
                <div className="text-xs text-slate-400">{r.cuisine} · {r.zone} · {r.distanceMiles} mi</div>
              </div>
              {r.verified ? <span className="wwai-chip wwai-chip-cyan">Verified</span> : <span className="wwai-chip">Pending</span>}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {r.walkMinutes}m walk · {r.driveMinutes}m drive · {"$".repeat(r.priceLevel ?? 2)}
            </div>
            {r.offer && <div className="mt-2 text-amber-300 text-sm">Offer: {r.offer}</div>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href="/safety-routes" className="wwai-btn-primary text-xs">Get Route</Link>
              <Link href="/register/restaurant" className="wwai-btn-ghost text-xs">Register Restaurant</Link>
              <Link href="/proposals" className="wwai-btn-ghost text-xs">Build Sponsor Offer</Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
