import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const REGISTRATION_TYPES = [
  {
    id: "restaurant-bar",
    label: "Restaurant / Bar",
    icon: "🍽",
    description:
      "Restaurants, bars, food trucks, and dining operators near event venues. Get listed on WWAI, run QR campaigns, and drive measurable foot traffic.",
    packages: "From $500 / year",
    href: "/sales-registration/intake?type=restaurant-bar",
    color: "border-cyan-500/30 hover:border-cyan-400/60",
  },
  {
    id: "hotel",
    label: "Hotel",
    icon: "🏨",
    description:
      "Hotels and lodging operators serving event guests. WWAI concierge recommendations, guest route integration, and QR offers to drive direct bookings.",
    packages: "From $750 / year",
    href: "/sales-registration/intake?type=hotel",
    color: "border-cyan-500/30 hover:border-cyan-400/60",
  },
  {
    id: "driver-transportation",
    label: "Driver / Transportation",
    icon: "🚗",
    description:
      "Drivers, shuttle operators, and transportation companies. Pickup zone placement, safety route integration, and verified listing for event guests.",
    packages: "From $250 / year",
    href: "/sales-registration/intake?type=driver-transportation",
    color: "border-cyan-500/30 hover:border-cyan-400/60",
  },
  {
    id: "sponsor",
    label: "Sponsor",
    icon: "⭐",
    description:
      "Brands and organizations wanting exposure across the WWAI event city platform. Local to enterprise sponsorship tiers with campaign tracking.",
    packages: "From $2,500 / year",
    href: "/sales-registration/intake?type=sponsor",
    color: "border-yellow-500/30 hover:border-yellow-400/60",
  },
  {
    id: "venue",
    label: "Venue / Event Space",
    icon: "🏟",
    description:
      "Event venues, arenas, and event spaces wanting WWAI discovery, route integration, and campaign capability for events and private bookings.",
    packages: "From $1,000 / year",
    href: "/sales-registration/intake?type=venue",
    color: "border-cyan-500/30 hover:border-cyan-400/60",
  },
  {
    id: "sales-partner",
    label: "Sales / Marketing Partner",
    icon: "🤝",
    description:
      "Independent sales reps, agencies, and regional partners selling TROPTIONS packages. Commission-based program with full sales materials provided.",
    packages: "No upfront fee for reps",
    href: "/sales-registration/intake?type=sales-partner",
    color: "border-yellow-500/30 hover:border-yellow-400/60",
  },
] as const;

export const metadata = {
  title: "Sales Registration | TROPTIONS · WWAI",
  description:
    "Register your business, venue, or sales partnership with WWAI / TROPTIONS. Choose your registration type to get started.",
};

export default function SalesRegistrationPage() {
  return (
    <AppShell
      title="Sales Registration"
      subtitle="Register your business, sponsorship, or sales partnership with WWAI / TROPTIONS. Select your registration type below to begin."
      badges={["Demo intake", "No real data stored"]}
    >
      {/* Demo disclaimer */}
      <div className="wwai-panel border-yellow-500/30 bg-yellow-500/5 p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 text-lg shrink-0 mt-0.5">⚠</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">
              Demo System — Do Not Enter Real Business Data
            </div>
            <p className="text-sm text-slate-300">
              This is a demonstration intake system. Do not enter real EINs, tax IDs, or sensitive
              business information until production authentication and database layers are enabled.
              All demo submissions are stored locally in your browser only.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="wwai-panel p-5 mb-8">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-3">
          How Registration Works
        </div>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Choose Type", desc: "Select your registration category below" },
            { step: "2", title: "Complete Intake", desc: "Fill out your business info and package interest" },
            { step: "3", title: "Get Intake ID", desc: "Receive a reference ID for your submission" },
            { step: "4", title: "Admin Review", desc: "Sales team reviews and follows up within 1 business day" },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="step-circle shrink-0">{s.step}</div>
              <div>
                <div className="text-sm font-bold text-white">{s.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/sales-deck" className="wwai-btn-primary text-xs">View Sales Deck</Link>
          <Link href="/sales-documents" className="wwai-btn-ghost text-xs">Download Documents</Link>
          <Link href="/sales-partners" className="wwai-btn-ghost text-xs">Partner Program</Link>
          <Link href="/admin/sales-intake" className="wwai-btn-ghost text-xs">Admin Review Queue</Link>
        </div>
      </section>

      {/* Registration type cards */}
      <h2 className="text-xl font-extrabold text-white mb-4">Select Registration Type</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {REGISTRATION_TYPES.map((rt) => (
          <Link
            key={rt.id}
            href={rt.href}
            className={`card-dark-hover p-5 flex flex-col gap-3 transition-all ${rt.color} no-underline`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{rt.icon}</span>
              <div>
                <div className="font-bold text-white text-base">{rt.label}</div>
                <div className="text-xs text-cyan-400 font-semibold">{rt.packages}</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{rt.description}</p>
            <div className="mt-auto">
              <span className="wwai-btn-primary text-xs inline-block">Start Registration →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Already registered */}
      <section className="wwai-panel p-5">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
          Already Submitted an Intake?
        </div>
        <p className="text-sm text-slate-400 mb-3">
          You can look up your demo intake submission status using your intake ID.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/sales-registration/summary" className="wwai-btn-ghost text-xs">
            Look Up Intake Status
          </Link>
          <Link href="/admin/sales-intake" className="wwai-btn-ghost text-xs">
            Admin Review Queue
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
