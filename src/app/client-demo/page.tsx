import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const STEPS: { num: string; title: string; href: string; what: string; talk: string }[] = [
  {
    num: "01",
    title: "Open with TROPTIONS",
    href: "/",
    what: "Homepage explains TROPTIONS (SalesOS + GuestOps) and WWAI (concierge).",
    talk: "TROPTIONS is the operating system. WWAI is what your guests touch. Independent, demo-only, no protected affiliations.",
  },
  {
    num: "02",
    title: "Show WWAI concierge",
    href: "/wwai",
    what: "Guest-facing AI: language picker, preset questions, route help.",
    talk: "This is what a fan opens on their phone. Restaurants, bars, drivers, sponsors — all in one panel.",
  },
  {
    num: "03",
    title: "Walk through Packages",
    href: "/packages",
    what: "Sponsor / restaurant / hotel / driver / venue tiers with pricing and inclusions.",
    talk: "Pick the customer in front of you, point at the tier, and ask what fits their budget and term.",
  },
  {
    num: "04",
    title: "Show Registration",
    href: "/register",
    what: "Seven business types, each with a real form, validation, and Pending Review status.",
    talk: "If they want in today, they fill this out. The submission lands in operator admin.",
  },
  {
    num: "05",
    title: "Show Map + Safety Routes",
    href: "/map",
    what: "Live MapLibre / OSM map (when configured) + safety-informed route planner.",
    talk: "Hotel to seat, seat to hotel. Demo data. Production replaces tiles, routing, and reviews each corridor.",
  },
  {
    num: "06",
    title: "Build a Proposal live",
    href: "/proposals",
    what: "Customer type → package → term → add-ons → live total → save + print.",
    talk: "Configure it in front of them, hit Print, and hand them the quote before they leave.",
  },
  {
    num: "07",
    title: "Show Operator Admin",
    href: "/admin",
    what: "Approve, request more info, or reject any submission. Filters by type and status.",
    talk: "This is what your team uses Monday morning. Demo writes are in the browser; production goes to the database.",
  },
  {
    num: "08",
    title: "Show Analytics",
    href: "/analytics",
    what: "QR scans, route requests, sponsor exposure, demo performance.",
    talk: "Every metric is labeled Demo. Production hooks PostHog / GA4 / our own pipeline.",
  },
  {
    num: "09",
    title: "Show Billing readiness",
    href: "/billing",
    what: "Invoices, recurring revenue, payment provider status (Manual / Square / Stripe).",
    talk: "We don\u2019t process real payments unless your keys are configured. Manual invoicing always works.",
  },
  {
    num: "10",
    title: "Show Integration Status",
    href: "/settings/integrations",
    what: "CRM, payments, map, database, AI — readiness flags and required env vars.",
    talk: "One screen tells the buyer exactly what flips on when keys land.",
  },
  {
    num: "11",
    title: "Close on Launch Checklist",
    href: "/launch",
    what: "Production checklist by area: brand, data, payments, CRM, map, AI, security, deployment.",
    talk: "Here\u2019s what we ship together. Sign the proposal, we work this list, you go live.",
  },
];

export default function ClientDemoPage() {
  return (
    <AppShell
      title="Client Demo Walkthrough"
      subtitle="A guided 10-minute path for a sales rep walking a payer or sponsor through TROPTIONS + WWAI. Every step links to the live page."
      badges={["Sales", "Demo", "Internal"]}
    >
      <div className="wwai-panel p-4 mb-6 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">How to use this page.</span>{" "}
        Open it on the laptop you\u2019re demoing from. Click each step in order. The talk track is what you say while the page loads.
        Stay in demo language: <em>safety-informed, demo route, operator-reviewed in production, verified partner</em>.
        Never claim <em>guaranteed safe</em>, <em>official</em>, or <em>police-approved</em>.
      </div>

      <ol className="space-y-3">
        {STEPS.map((s) => (
          <li key={s.num} className="wwai-panel p-4 grid md:grid-cols-[64px_1fr_auto] gap-4 items-start">
            <div className="text-3xl font-black text-cyan-400">{s.num}</div>
            <div>
              <div className="text-base font-bold text-white">{s.title}</div>
              <div className="text-xs text-slate-400 mt-1">{s.what}</div>
              <div className="text-sm text-slate-300 mt-2">
                <span className="text-slate-500 uppercase tracking-widest text-[10px] mr-2">Say</span>
                {s.talk}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={s.href} className="wwai-btn-primary text-xs whitespace-nowrap">Open {s.href}</Link>
            </div>
          </li>
        ))}
      </ol>

      <div className="wwai-panel p-4 mt-6 text-xs text-slate-400">
        Emergency disclaimer to reference if asked: &ldquo;Safety guidance is informational and demo-based. For emergencies, contact local emergency services immediately.&rdquo;
      </div>
    </AppShell>
  );
}
