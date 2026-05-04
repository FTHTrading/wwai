import AppShell from "@/components/layout/AppShell";

const CASES = [
  { t: "Local Restaurant QR Activation", d: "Scan-to-redeem QR offer placed in 3 hotel concierge desks. 4,200 scans → 980 redemptions in event week.", tags: ["QR", "Concierge", "Restaurant"] },
  { t: "Hotel-to-Seat Routing",          d: "Centennial-zone hotels integrated WWAI concierge for safety-informed routing. Avg 18% reduction in late arrivals (demo).", tags: ["Routing", "Hotel", "Safety"] },
  { t: "Citywide Sponsor Activation",    d: "Premium sponsor across 4 zones, 6 hotels, 3 driver fleets, citywide map placement. $250K package.", tags: ["Sponsor", "Citywide"] },
  { t: "Driver Pickup Zone",             d: "Independent driver fleet integrated into WWAI map with pickup-zone routing. 1,200 routed pickups in event weekend.", tags: ["Driver", "Pickup", "Map"] },
  { t: "Premium Brand QR Campaign",      d: "Beverage brand featured in WWAI concierge answers + QR offer at 18 partnered restaurants. 9.4% conversion.", tags: ["Concierge", "QR", "Brand"] },
];

export default function CaseStudiesPage() {
  return (
    <AppShell title="Case Studies" subtitle="Five demo case studies showing TROPTIONS + WWAI activations." badges={["Demo / illustrative"]}>
      <div className="grid sm:grid-cols-2 gap-4">
        {CASES.map((c) => (
          <div key={c.t} className="wwai-card p-5">
            <div className="font-bold text-white">{c.t}</div>
            <div className="text-sm text-slate-300 mt-2">{c.d}</div>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.tags.map((tag) => <span key={tag} className="wwai-chip wwai-chip-cyan text-[10px]">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
