import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const TYPES = [
  { id: "restaurant", title: "Restaurant",  desc: "Add your restaurant to the WWAI network and unlock QR offers, routing, and concierge integration." },
  { id: "bar",        title: "Bar / Nightlife", desc: "Independent business directory listing. Age-restricted entries clearly labeled. Verify local age and licensing." },
  { id: "merchant",   title: "Merchant / Retail", desc: "Storefronts, pop-ups, food halls, and event-area retail." },
  { id: "hotel",      title: "Hotel",       desc: "Become a verified hotel partner with route packages and concierge integration." },
  { id: "driver",     title: "Driver / Transportation", desc: "Independent drivers and shuttle operators. Not affiliated with rideshare brands." },
  { id: "sponsor",    title: "Sponsor",     desc: "Brand sponsor application — packages, zones, channels, and contract value." },
  { id: "venue",      title: "Venue",       desc: "Hotels, halls, watch parties, fan-fest spaces, and private experiences." },
];

export default function RegisterPage() {
  return (
    <AppShell
      title="Register Your Business"
      subtitle="Self-serve registration for the seven business types in the TROPTIONS network. Operator review required before going live."
      badges={["Demo registration", "Operator-reviewed in production"]}
    >
      <section className="wwai-panel p-5 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">How registration fits the system</div>
        <p className="text-sm text-slate-300 mt-2">
          Register the business → operator reviews the submission in production → WWAI can recommend it to
          guests → packages and campaigns attach → analytics and billing track value. All submissions are
          stored locally as demo records until connected to the production database.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TYPES.map((t) => (
          <Link key={t.id} href={`/register/${t.id}`} className="wwai-card p-5 hover:border-cyan-400 transition">
            <div className="font-bold text-white">{t.title}</div>
            <div className="text-sm text-slate-400 mt-1">{t.desc}</div>
            <div className="mt-3 text-xs text-cyan-300 font-semibold">Open form →</div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
