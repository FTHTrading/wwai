import AppShell from "@/components/layout/AppShell";
import { BARS } from "@/data/demoData";
import Link from "next/link";

export default function BarsPage() {
  return (
    <AppShell
      brand="whichway"
      eyebrow="Bars & Nightlife"
      title="After Hours"
      subtitle="Business directory of nightlife venues with safety-informed late-night pickup notes. Age-restricted entries clearly labeled."
      badges={["21+ where applicable", "Demo data"]}
    >
      <p className="disclaimer-bar mb-4">
        Informational business directory. Not for use by minors. Verify local age and licensing requirements.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BARS.map((b) => (
          <div key={b.id} className="wwai-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white">{b.name}</div>
                <div className="text-xs text-slate-400">{b.type} · {b.zone} · {b.distanceMiles} mi</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {b.verified && <span className="wwai-chip wwai-chip-cyan">Verified</span>}
                {b.ageRestricted && <span className="wwai-chip wwai-chip-amber">21+</span>}
                {b.openLate && <span className="wwai-chip wwai-chip-gold">Open late</span>}
              </div>
            </div>
            {b.safetyNote && <div className="text-xs text-cyan-300 mt-2">{b.safetyNote}</div>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href="/safety-routes" className="wwai-btn-primary text-xs">Get Route</Link>
              <Link href="/register/bar" className="wwai-btn-ghost text-xs">Register Bar</Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
