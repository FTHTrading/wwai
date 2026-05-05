import Link from "next/link";
import {
  RESTAURANT_BAR_PACKAGES,
  HOTEL_PACKAGES,
  DRIVER_PACKAGES,
  SPONSOR_PACKAGES,
  VENUE_PACKAGES,
} from "@/data/salesPackages";

export const metadata = {
  title: "Sales Deck | TROPTIONS · WWAI",
  description:
    "Official WWAI / TROPTIONS sales presentation deck. Platform overview, packages, value propositions, and how to close.",
};

const ALL_TIERS = [
  { label: "Restaurant / Bar", icon: "🍽", packages: RESTAURANT_BAR_PACKAGES },
  { label: "Hotel", icon: "🏨", packages: HOTEL_PACKAGES },
  { label: "Driver / Transportation", icon: "🚗", packages: DRIVER_PACKAGES },
  { label: "Sponsor", icon: "⭐", packages: SPONSOR_PACKAGES },
  { label: "Venue / Event Space", icon: "🏟", packages: VENUE_PACKAGES },
];

export default function SalesDeckPage() {
  return (
    <div className="hud-grid-bg -mx-4 px-4 py-6 rounded-2xl print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-10 print:space-y-8">

        {/* ── Cover ─────────────────────────────────────────── */}
        <section className="wwai-panel p-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="troptions-hex-sm" aria-hidden>T</div>
            <span className="brand-label">TROPTIONS</span>
            <span className="text-slate-400 font-bold">×</span>
            <span className="text-cyan-400 font-extrabold tracking-widest text-sm">WWAI</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 print:text-black">
            Independent Event-City SalesOS + GuestOps
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto print:text-slate-600">
            The first AI-native platform purpose-built to connect event-city businesses with the
            millions of guests who arrive without a plan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="pill-cyan">Demo Build</span>
            <span className="pill-gold">Sales Reference</span>
            <span className="pill-cyan">WWAI v2</span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 no-print">
            <Link href="/sales-registration/intake" className="wwai-btn-primary">Start Registration</Link>
            <Link href="/sales-documents" className="wwai-btn-ghost">Documents</Link>
            <Link href="/sales-partners" className="wwai-btn-ghost">Partner Program</Link>
          </div>
        </section>

        {/* ── Section 1: What is WWAI ───────────────────────── */}
        <Section id="what-is-wwai" label="01" title="What is WWAI?">
          <p className="text-slate-300 text-base leading-relaxed mb-4">
            <strong className="text-white">WWAI (WhichWay AI)</strong> is the guest-facing AI concierge
            built specifically for major event cities. When hundreds of thousands of fans, tourists, and
            visitors arrive for a Super Bowl, World Cup, or championship event, the most common problem
            is the same: <em className="text-cyan-400">they don&apos;t know where to go, where to eat,
            where to stay, or how to get there safely.</em>
          </p>
          <p className="text-slate-300 text-base leading-relaxed mb-4">
            WWAI solves this with a conversational AI concierge that answers those questions in real time
            — while surfacing your partners, sponsors, and registered businesses as the recommended
            options.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {[
              { stat: "AI-Powered", label: "Conversational guest concierge" },
              { stat: "8 Languages", label: "International event audiences" },
              { stat: "Real-Time", label: "Live event-day recommendations" },
            ].map((s) => (
              <div key={s.stat} className="stat-card">
                <div className="stat-big">{s.stat}</div>
                <div className="text-xs text-slate-400 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 2: What is TROPTIONS ─────────────────── */}
        <Section id="what-is-troptions" label="02" title="What is TROPTIONS?">
          <p className="text-slate-300 text-base leading-relaxed mb-4">
            <strong className="text-white">TROPTIONS</strong> is the independent sales and operations
            platform that powers the business side of the event city system. TROPTIONS sells packages,
            manages business registrations, tracks campaigns, builds proposals, and connects operators
            to the WWAI guest network.
          </p>
          <p className="text-slate-300 text-base leading-relaxed mb-4">
            Think of it this way: <em className="text-cyan-400">WWAI is the guest app. TROPTIONS is
            the B2B SalesOS that feeds it.</em>
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              { icon: "💼", title: "B2B Sales Platform", desc: "Sell packages to restaurants, hotels, drivers, sponsors, and venues" },
              { icon: "📊", title: "Campaign Analytics", desc: "Track QR redemptions, foot traffic impact, and ROI" },
              { icon: "📋", title: "Proposal Builder", desc: "Generate proposals in minutes from package catalog" },
              { icon: "🔗", title: "QR Campaigns", desc: "Deploy trackable QR campaigns across partner locations" },
            ].map((item) => (
              <div key={item.title} className="card-dark p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 3: Who Buys ───────────────────────────── */}
        <Section id="who-buys" label="03" title="Who Buys?">
          <p className="text-slate-300 text-base leading-relaxed mb-5">
            Every business that wants to capture event-city spending needs to be visible to the guests
            arriving in their city. The question isn&apos;t if these businesses want more traffic during
            major events — it&apos;s whether they&apos;ll be found by the guests who are already there.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🍽", type: "Restaurants & Bars", pitch: "\"We need to show up when fans ask WWAI where to eat near the venue.\"" },
              { icon: "🏨", type: "Hotels", pitch: "\"We want WWAI to recommend our property when guests ask where to stay.\"" },
              { icon: "🚗", type: "Transportation", pitch: "\"We want our drivers and shuttles to appear when fans need a safe ride.\"" },
              { icon: "⭐", type: "Sponsors & Brands", pitch: "\"We want our brand to appear in the AI conversation during the event.\"" },
              { icon: "🏟", type: "Event Venues", pitch: "\"We want guests to find our space as an event-adjacent destination.\"" },
              { icon: "🤝", type: "Sales Partners", pitch: "\"We want to sell this platform to our existing book of business.\"" },
            ].map((b) => (
              <div key={b.type} className="card-dark-hover p-4">
                <div className="text-xl mb-1">{b.icon}</div>
                <div className="font-bold text-white text-sm mb-2">{b.type}</div>
                <div className="text-xs text-slate-400 italic">{b.pitch}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 4: Packages ───────────────────────────── */}
        <Section id="packages" label="04" title="Package Overview">
          <p className="text-slate-400 text-sm mb-5">
            All pricing is reference/demo. Final packages are configurable per event city and client
            agreement.
          </p>
          {ALL_TIERS.map((tier) => (
            <div key={tier.label} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{tier.icon}</span>
                <h3 className="text-base font-bold text-white">{tier.label}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a2540]">
                      <th className="text-left text-xs text-slate-400 uppercase tracking-wide pb-2 pr-4">Package</th>
                      <th className="text-right text-xs text-slate-400 uppercase tracking-wide pb-2 pr-4">Price/yr</th>
                      <th className="text-right text-xs text-slate-400 uppercase tracking-wide pb-2">Setup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tier.packages.map((p) => (
                      <tr key={p.id} className="border-b border-[#0d1626]">
                        <td className="py-2 pr-4">
                          <div className="font-medium text-slate-100">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.bestFor}</div>
                        </td>
                        <td className="py-2 pr-4 text-right text-cyan-400 font-bold whitespace-nowrap">
                          {p.price === 0 ? "No fee" : `$${p.price.toLocaleString()}`}
                        </td>
                        <td className="py-2 text-right text-slate-400 whitespace-nowrap">
                          {p.setupFee ? `$${p.setupFee.toLocaleString()}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="mt-4 no-print">
            <Link href="/packages" className="wwai-btn-ghost text-sm">View Full Package Catalog</Link>
          </div>
        </Section>

        {/* ── Section 5: Value Propositions ────────────────── */}
        <Section id="value-props" label="05" title="Why WWAI / TROPTIONS?">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "AI-First Discovery",
                body: "Businesses aren't just listed — they're recommended by the AI concierge in natural language responses.",
              },
              {
                title: "Measurable ROI",
                body: "QR campaigns, redemption tracking, and analytics dashboards turn every sale into a provable business outcome.",
              },
              {
                title: "Safety-Informed Routing",
                body: "WWAI routes guests using safety data — a differentiator that premium brands and city partners respond to.",
              },
              {
                title: "Multi-Language",
                body: "8 languages built in. International events need international reach — WWAI delivers it from day one.",
              },
              {
                title: "End-to-End System",
                body: "From registration to proposal to billing to analytics — everything is connected in one platform.",
              },
              {
                title: "Partner Ecosystem",
                body: "Sales partners, agencies, and regional reps can sell the platform with full commission tracking and materials.",
              },
            ].map((v) => (
              <div key={v.title} className="card-dark p-4">
                <div className="font-bold text-white mb-1">{v.title}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 6: Money Flow ─────────────────────────── */}
        <Section id="money-flow" label="06" title="How the Money Flows">
          <p className="text-slate-300 text-base leading-relaxed mb-5">
            TROPTIONS is an independent operator — not affiliated with or dependent on official event
            organizations. Revenue comes from businesses that want to be positioned in the event city
            ecosystem.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Business Registers", desc: "Pays annual package fee + optional setup" },
              { step: "2", title: "Campaign Deploys", desc: "QR codes, map listings, AI concierge slots go live" },
              { step: "3", title: "ROI Reported", desc: "Redemptions, visits, and engagement tracked and reported" },
            ].map((s) => (
              <div key={s.step} className="card-dark p-4 flex flex-col gap-2">
                <div className="step-circle">{s.step}</div>
                <div className="font-bold text-white text-sm">{s.title}</div>
                <div className="text-xs text-slate-400">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="wwai-panel p-4 mt-4 bg-[#0a0f1e]">
            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">
              Sales Partner Commission
            </div>
            <p className="text-sm text-slate-300">
              Sales partners earn commission on closed packages. Commission rates are defined per
              partner agreement. Demo commission structures are available in the partner program
              and proposal worksheet. Final rates are set at the operator level.
            </p>
          </div>
        </Section>

        {/* ── Section 7: Talk Tracks ────────────────────────── */}
        <Section id="talk-tracks" label="07" title="Sales Talk Tracks">
          <div className="space-y-4">
            {[
              {
                objection: "\"We already advertise on Google/Yelp.\"",
                response: "Google and Yelp are search — passive. WWAI is active AI recommendation. When a fan asks WWAI 'where should I eat near the venue tonight?' — you appear as the recommended option. That's a different kind of placement.",
              },
              {
                objection: "\"We're already busy during big events.\"",
                response: "Perfect — that means the demand is already there. WWAI lets you capture the demand before competitors do, run trackable QR offers, and build data you can show ownership. This is a retention play as much as an acquisition play.",
              },
              {
                objection: "\"I need to check with my owner/corporate.\"",
                response: "Understood. Let me leave you with the proposal worksheet and partner overview. I can build a proposal in 10 minutes that shows exactly which package fits your operation and what the ROI projection looks like.",
              },
              {
                objection: "\"What's the ROI?\"",
                response: "It depends on package tier and event traffic. A $1,250 enhanced listing during a 500K-guest event — if WWAI drives even 50 incremental covers, you've covered the annual cost in one week. We can run the numbers together in the proposal builder.",
              },
              {
                objection: "\"We can't afford it right now.\"",
                response: "We have entry packages starting at $250/year for drivers and $500/year for restaurants. The question is: can you afford not to be found when the city fills up?",
              },
            ].map((t, i) => (
              <div key={i} className="card-dark p-4">
                <div className="text-sm font-bold text-yellow-400 mb-2">{t.objection}</div>
                <div className="text-sm text-slate-300 leading-relaxed italic">{t.response}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 8: CTA ────────────────────────────────── */}
        <Section id="cta" label="08" title="Ready to Close?">
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Use the tools below to move prospects from this deck to a completed intake and proposal.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Start Registration Intake", desc: "Complete a demo business intake for the prospect", href: "/sales-registration/intake", primary: true },
              { label: "Build a Proposal", desc: "Open the proposal worksheet", href: "/proposals", primary: false },
              { label: "View Document Center", desc: "Download all sales support documents", href: "/sales-documents", primary: false },
              { label: "Partner Program", desc: "Learn about sales partner commissions", href: "/sales-partners", primary: false },
              { label: "Full Package Catalog", desc: "Browse all packages and pricing", href: "/packages", primary: false },
              { label: "Admin Review Queue", desc: "Review submitted intakes", href: "/admin/sales-intake", primary: false },
            ].map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={`p-4 rounded-xl border transition-all ${
                  cta.primary
                    ? "bg-cyan-500/10 border-cyan-400/40 hover:bg-cyan-500/20"
                    : "card-dark-hover"
                }`}
              >
                <div className={`font-bold text-sm mb-1 ${cta.primary ? "text-cyan-400" : "text-white"}`}>
                  {cta.label}
                </div>
                <div className="text-xs text-slate-400">{cta.desc}</div>
              </Link>
            ))}
          </div>
        </Section>

        {/* Print footer */}
        <div className="hidden print:block border-t border-slate-300 pt-4 text-xs text-slate-500">
          <p>
            WWAI / TROPTIONS — Sales Deck — Demo Build — {new Date().toLocaleDateString()}
            {" "}· All pricing is reference only. Not a binding offer.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id?: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="wwai-panel p-6">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest">{label}</span>
        <h2 className="text-xl font-extrabold text-white print:text-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}
