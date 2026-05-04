import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const STEPS = [
  { n: 1, title: "Sponsor buys package",        href: "/packages",  status: "live demo",    desc: "Sponsor browses tiers, selects a package, sends to proposal builder." },
  { n: 2, title: "Restaurant / hotel / driver registers", href: "/register", status: "live demo",    desc: "Self-serve forms collect business info and selected package." },
  { n: 3, title: "Admin reviews listing",       href: "/admin",     status: "live demo",    desc: "Operator queue with approve / needs info / reject actions." },
  { n: 4, title: "Campaign is created",         href: "/campaigns", status: "live demo",    desc: "QR offer, citywide activation, hotel route, audience segment." },
  { n: 5, title: "QR offer goes live",          href: "/campaigns", status: "demo",         desc: "Demo scan + redemption counters. Production needs scan service." },
  { n: 6, title: "WWAI guides guest",           href: "/wwai",      status: "demo",         desc: "AI concierge answers and routes. Production needs live AI runtime + RAG." },
  { n: 7, title: "Safety-informed route built", href: "/safety-routes", status: "demo",     desc: "Safety-informed demo routing with checkpoints and pickup. Operator-reviewed in production." },
  { n: 8, title: "Analytics updates",           href: "/analytics", status: "demo",         desc: "KPIs, charts, lead pipeline, route requests." },
  { n: 9, title: "Proposal / billing prepared", href: "/billing",   status: "demo",         desc: "Contract value, MRR, payment provider readiness." },
];

export default function DemoPage() {
  return (
    <AppShell
      title="Interactive Platform Walkthrough"
      subtitle="Nine demo steps showing how TROPTIONS + WWAI move a sale, a registration, a campaign, and a guest through the system."
      badges={["Demo data", "Operator-reviewed in production"]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STEPS.map((s) => (
          <div key={s.n} className="wwai-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-cyan-400 font-extrabold text-3xl">{s.n.toString().padStart(2,"0")}</div>
              <span className="wwai-chip wwai-chip-cyan">{s.status}</span>
            </div>
            <div className="font-bold text-white mt-2">{s.title}</div>
            <div className="text-sm text-slate-400 mt-1">{s.desc}</div>
            <Link href={s.href} className="wwai-btn-ghost text-xs mt-4 inline-block">Open</Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
