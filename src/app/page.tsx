// Homepage — TROPTIONS + WWAI
import Link from "next/link";

const USERS = [
  "Sponsors", "Restaurants", "Bars", "Hotels", "Drivers", "Venues",
  "Sales Teams", "Safety Operators", "Visitors", "City / Event Partners",
];

const VALUE = [
  { t: "Sell packages faster",      d: "Pre-built sponsor, merchant, hotel, and driver packages with pricing, terms, and proposals." },
  { t: "Register local businesses", d: "Restaurants, bars, hotels, drivers, merchants, and venues self-register with operator review." },
  { t: "Guide visitors safely",     d: "Safety-informed demo routes from hotel to seat and seat to hotel, designed for operator review in production." },
  { t: "Connect the area",          d: "Hotels, drivers, venues, restaurants, and merchants tied into a single map and concierge." },
  { t: "Launch QR campaigns",       d: "Offer-driven scans, redemptions, and reporting for sponsors and merchants." },
  { t: "Capture leads",             d: "Sales lead capture, proposal generation, and CRM-ready pipelines." },
  { t: "Build proposals",           d: "Configurable packages, add-ons, terms, and contract value calculator." },
  { t: "Prepare billing",           d: "Square / Stripe / manual readiness with MRR and pipeline rollup." },
  { t: "Track performance",         d: "Campaign performance, route requests, sponsor revenue, and audience analytics." },
  { t: "Scale with AI agents",      d: "WWAI concierge plus sales, proposal, onboarding, and safety agents (RAG + MCP ready)." },
];

const FLOW = [
  "Package sold",
  "Business registered",
  "Admin approves listing",
  "WWAI can recommend it",
  "QR campaign launches",
  "Visitor scans offer",
  "Redemption tracked",
  "Analytics update",
  "Invoice prepared",
  "Commission / payout tracked",
];

const PACKAGE_GROUPS = [
  { title: "Sponsor Packages",        tiers: ["Local Sponsor", "Category Sponsor", "City Activation Sponsor", "Premium Campaign Sponsor"], cta: "View Packages",       href: "/packages",            featured: true  },
  { title: "Restaurant / Bar",        tiers: ["Verified Listing", "Enhanced Profile", "Premium Placement", "Featured QR Offer Campaign"], cta: "Register Restaurant", href: "/register/restaurant", featured: false },
  { title: "Hotel Packages",          tiers: ["Hotel Listing", "Guest Route Package", "Concierge Integration", "Premium Hotel Partner"],   cta: "Register Hotel",      href: "/register/hotel",      featured: true  },
  { title: "Driver / Transportation", tiers: ["Verified Driver Listing", "Pickup Zone Partner", "Shuttle Route Partner", "Premium Transportation Sponsor"], cta: "Register Driver", href: "/register/driver", featured: false },
  { title: "Venue Packages",          tiers: ["Venue Listing", "Sponsor Placement", "QR Campaign Integration", "Guest Route Support"],     cta: "Register Venue",      href: "/register/venue",      featured: false },
];

const REGISTER_CARDS = [
  { kind: "Restaurant", who: "Restaurants near event zones", get: "Verified listing, QR offer, family/late-night flags", wwai: "WWAI recommends nearby food for hungry guests", href: "/register/restaurant" },
  { kind: "Bar",        who: "Independent bars and nightlife", get: "Age-labeled directory listing and operator-reviewed-in-production placement", wwai: "WWAI returns 21+ options when guests ask about nightlife", href: "/register/bar" },
  { kind: "Hotel",      who: "Hotels around the event city", get: "Concierge integration, guest route package, premium partner tier", wwai: "WWAI builds hotel→seat and seat→hotel demo routes for guests", href: "/register/hotel" },
  { kind: "Driver",     who: "Independent drivers and shuttle operators", get: "Pickup zone partner, shuttle route partner, premium transportation sponsor", wwai: "WWAI suggests verified pickup zones and partner shuttles", href: "/register/driver" },
  { kind: "Sponsor",    who: "Brands wanting visibility in the event city", get: "Local, category, city activation, or premium campaign sponsorship", wwai: "WWAI surfaces sponsor offers when guests ask matching questions", href: "/register/sponsor" },
  { kind: "Venue",      who: "Halls, watch parties, fan-fest spaces, private experiences", get: "Listing, sponsor placement, QR campaign integration, guest route support", wwai: "WWAI guides guests to verified venues and partner experiences", href: "/register/venue" },
];

const SALES_STEPS = [
  { n: 1, t: "Capture Lead",      d: "Sponsor, restaurant, hotel, driver, or venue submits interest." },
  { n: 2, t: "Select Package",    d: "Sales rep chooses package, term, and add-ons." },
  { n: 3, t: "Build Proposal",    d: "Proposal builder calculates value and creates a preview." },
  { n: 4, t: "Admin Review",      d: "Operator reviews business registration and map placement." },
  { n: 5, t: "Launch Campaign",   d: "QR offers, map pins, WWAI discovery, and sponsor campaigns go live in demo mode." },
  { n: 6, t: "Track Performance", d: "Analytics show scans, redemptions, route requests, and sponsor value." },
  { n: 7, t: "Prepare Billing",   d: "Invoice/payment readiness is prepared through TROPTIONS." },
];

const ROUTE_CARDS = [
  { t: "Hotel to Seat",       d: "Walk, drive, or shuttle plan from partner hotel to venue zone." },
  { t: "Seat to Hotel",       d: "Reverse plan with safety-informed corridor and pickup options." },
  { t: "Restaurant to Venue", d: "Move guests from food districts into the event in time." },
  { t: "Driver Pickup Zone",  d: "Recommended public corridor and verified-partner pickup point." },
  { t: "Family Support Node", d: "Family-friendly routes and rest checkpoints during transit." },
  { t: "Accessibility Route", d: "Step-light, ramp-aware demo plan for accessibility needs." },
];

const DEMO_ONLY = [
  "Demo metrics", "Demo route recommendations", "Demo AI responses",
  "Demo restaurants, hotels, drivers, and venues", "Demo QR/redemption analytics",
  "Demo package pricing", "Demo billing readiness", "Demo RAG/MCP architecture",
];

const LANGS = ["English","Spanish","French","Portuguese","Arabic","Mandarin","Japanese","Korean"];

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="hud-grid-bg -mx-4 px-4 md:px-10 py-14 rounded-2xl border border-[#0d1626]">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-center">
          <div>
            <span className="wwai-chip wwai-chip-amber mb-4 inline-block">
              Independent platform · Demo data · Not affiliated with protected event or venue brands
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.05]">
              One city. One crowd. <span className="text-cyan-400">One revenue and safety operating system.</span>
            </h1>
            <p className="mt-5 text-slate-300 max-w-3xl text-lg">
              TROPTIONS connects sponsors, restaurants, hotels, drivers, venues, fans, sales teams,
              and safety operators through one AI-powered activation platform. WWAI (WhichWay AI) is
              the guest-facing concierge inside it.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link href="/wwai"      className="wwai-btn-primary">Try WWAI</Link>
              <Link href="/packages"  className="wwai-btn-ghost">View Packages</Link>
              <Link href="/register"  className="wwai-btn-ghost">Register Business</Link>
              <Link href="/proposals" className="wwai-btn-ghost">Build Proposal</Link>
              <Link href="/demo"      className="wwai-btn-ghost">View Demo</Link>
              <Link href="/contact"   className="wwai-btn-ghost">Contact Sales</Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wwai-logo.png"
              alt="WhichWay AI — TROPTIONS guest concierge"
              width={320}
              height={320}
              className="object-contain drop-shadow-[0_0_45px_rgba(0,213,255,0.35)]"
            />
          </div>
        </div>

        {/* Brand pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
          {[
            { t: "Guidance",   d: "AI concierge for visitors in 8 demo languages." },
            { t: "Safety",     d: "Safety-informed demo routes designed for operator review in production." },
            { t: "Connection", d: "Sponsors, hotels, drivers, merchants tied together." },
            { t: "Growth",     d: "Sell packages, capture leads, prove ROI." },
          ].map((p) => (
            <div key={p.t} className="rounded-xl border border-cyan-400/20 bg-[#07111f]/70 p-4">
              <div className="text-cyan-300 text-[11px] tracking-widest font-bold uppercase">{p.t}</div>
              <div className="text-sm text-slate-300 mt-1">{p.d}</div>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 mt-3">
          Demo multilingual mode supports {LANGS.join(", ")}. Production translations require reviewed language packs.
        </div>
      </section>

      {/* Two-up: TROPTIONS / WWAI */}
      <section className="grid lg:grid-cols-2 gap-5">
        <div className="wwai-panel p-6">
          <div className="wwai-chip wwai-chip-cyan mb-3">What is TROPTIONS?</div>
          <h2 className="text-2xl font-extrabold text-white">The business operating system</h2>
          <p className="text-slate-300 mt-3">
            TROPTIONS is the operating system that lets a sales and operations team market, sell,
            map, route, support, and measure the full event-city experience — from sponsor
            packages and merchant onboarding to QR campaigns, billing, and analytics.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/packages"  className="wwai-btn-ghost text-sm">Packages</Link>
            <Link href="/proposals" className="wwai-btn-ghost text-sm">Proposals</Link>
            <Link href="/billing"   className="wwai-btn-ghost text-sm">Billing</Link>
            <Link href="/analytics" className="wwai-btn-ghost text-sm">Analytics</Link>
          </div>
        </div>
        <div className="wwai-panel p-6">
          <div className="wwai-chip wwai-chip-gold mb-3">What is WWAI?</div>
          <h2 className="text-2xl font-extrabold text-white">Nowhere to go? WhichWay AI knows.</h2>
          <p className="text-slate-300 mt-3">
            WWAI is the guest-facing AI concierge. Guests ask where to eat, how to get to their
            seat, where pickup is, what offers are nearby, or how to get back to their hotel —
            in any of 8 demo languages.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/wwai"          className="wwai-btn-primary text-sm">Try WWAI Demo</Link>
            <Link href="/safety-routes" className="wwai-btn-ghost text-sm">Safety Routes</Link>
            <Link href="/area-guide"    className="wwai-btn-ghost text-sm">Area Guide</Link>
          </div>
        </div>
      </section>

      {/* What it isn't */}
      <section className="wwai-panel p-6 border-amber-500/30">
        <div className="wwai-chip wwai-chip-amber mb-2">Important</div>
        <h3 className="text-xl font-bold text-white">What TROPTIONS is not</h3>
        <p className="text-slate-300 mt-2">
          TROPTIONS is an independent platform. Not affiliated with any protected sports league,
          event, team, venue, hotel, rideshare brand, or restaurant brand unless separately
          licensed. All data is demo-only. Public wording uses
          {" "}<span className="text-cyan-300">independent</span>,
          {" "}<span className="text-cyan-300">safety-informed</span>, and
          {" "}<span className="text-cyan-300">verified partner</span>.
        </p>
      </section>

      {/* Who uses it */}
      <section>
        <h2 className="text-2xl font-extrabold text-white mb-4">Who uses TROPTIONS?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {USERS.map((u) => (
            <div key={u} className="wwai-card p-4 text-center text-sm font-semibold text-slate-200">{u}</div>
          ))}
        </div>
      </section>

      {/* Why it's a no-brainer */}
      <section>
        <h2 className="text-2xl font-extrabold text-white mb-4">Why TROPTIONS is a no-brainer</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VALUE.map((v) => (
            <div key={v.t} className="wwai-card p-5">
              <div className="text-base font-bold text-white">{v.t}</div>
              <div className="text-sm text-slate-400 mt-1">{v.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What can businesses buy? */}
      <section>
        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-white">What can businesses buy through TROPTIONS?</h2>
            <p className="text-sm text-slate-400">Five package families covering sponsors, restaurants/bars, hotels, drivers, and venues.</p>
          </div>
          <Link href="/packages" className="wwai-btn-ghost text-sm">All Packages</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PACKAGE_GROUPS.map((g) => (
            <div key={g.title} className={`wwai-card p-5 flex flex-col ${g.featured ? "border-amber-400/50 wwai-card-gold" : ""}`}>
              <div className="font-bold text-white">{g.title}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-300 flex-1">
                {g.tiers.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className={g.featured ? "text-amber-300" : "text-cyan-400"}>›</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Link href={g.href} className={`mt-4 text-center text-xs font-semibold rounded-lg py-2 ${g.featured ? "bg-amber-400/15 border border-amber-400/40 text-amber-200 hover:bg-amber-400/20 transition" : "wwai-btn-primary"}`}>
                {g.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Register into the network */}
      <section>
        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Register into the event-city network</h2>
            <p className="text-sm text-slate-400">Get listed, get discovered by WWAI, get connected to packages, proposals, billing, and analytics.</p>
          </div>
          <Link href="/register" className="wwai-btn-ghost text-sm">Registration Hub</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGISTER_CARDS.map((r) => (
            <div key={r.kind} className="wwai-card p-5 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-white">Register {r.kind}</div>
                <span className="wwai-chip wwai-chip-amber text-[10px]">Demo · Pending review</span>
              </div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mt-3">Who it&apos;s for</div>
              <div className="text-sm text-slate-300">{r.who}</div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mt-2">What you get</div>
              <div className="text-sm text-slate-300">{r.get}</div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mt-2">How WWAI helps</div>
              <div className="text-sm text-slate-300">{r.wwai}</div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mt-2">TROPTIONS connects this to</div>
              <div className="text-sm text-slate-300">Packages · Proposals · Billing · Analytics</div>
              <Link href={r.href} className="wwai-btn-primary text-xs mt-4 text-center">Open form</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Money flow */}
      <section className="wwai-panel p-6">
        <h2 className="text-2xl font-extrabold text-white mb-4">How money flows</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {FLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/5 text-cyan-200">{step}</span>
              {i < FLOW.length - 1 && <span className="text-slate-500">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Blockchain audit trail and payout tracking are demo / integration-ready. Production
          settlement requires connected payment rails, compliance review, and approval gates.
        </p>
      </section>

      {/* Sales team workflow */}
      <section>
        <h2 className="text-2xl font-extrabold text-white mb-4">How the sales team uses TROPTIONS</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SALES_STEPS.map((s) => (
            <div key={s.n} className="wwai-card p-5">
              <div className="text-cyan-400 font-extrabold text-2xl">{s.n.toString().padStart(2,"0")}</div>
              <div className="font-bold text-white mt-1">{s.t}</div>
              <div className="text-xs text-slate-400 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/proposals" className="wwai-btn-primary text-sm">Build Proposal</Link>
          <Link href="/admin"     className="wwai-btn-ghost text-sm">Open Admin Dashboard</Link>
          <Link href="/analytics" className="wwai-btn-ghost text-sm">View Analytics</Link>
          <Link href="/billing"   className="wwai-btn-ghost text-sm">Billing Readiness</Link>
        </div>
      </section>

      {/* Route planner CTA */}
      <section className="wwai-panel p-6">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Hotel to seat. Seat to hotel.</h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              WWAI helps guests understand demo routes from hotels, restaurants, bars, and pickup
              zones to venue areas and back again using safety-informed route guidance.
            </p>
          </div>
          <Link href="/safety-routes" className="wwai-btn-primary text-sm">Plan Safety-Informed Route</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROUTE_CARDS.map((r) => (
            <div key={r.t} className="wwai-card p-4">
              <div className="font-bold text-white">{r.t}</div>
              <div className="text-sm text-slate-400 mt-1">{r.d}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Demo route only. Production routing requires live map data, verified local feeds, and operator review.
        </p>
      </section>

      {/* Demo-only / production checklist */}
      <section className="grid lg:grid-cols-2 gap-5">
        <div className="wwai-panel p-6 border-amber-500/30">
          <div className="wwai-chip wwai-chip-amber mb-2 inline-block">Demo-only right now</div>
          <h3 className="text-xl font-bold text-white">What is demo-only?</h3>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-slate-300">
            {DEMO_ONLY.map((d) => (
              <li key={d} className="flex gap-2"><span className="text-amber-400">›</span>{d}</li>
            ))}
          </ul>
        </div>
        <div className="wwai-panel p-6">
          <div className="wwai-chip wwai-chip-cyan mb-2 inline-block">Production needs</div>
          <h3 className="text-xl font-bold text-white">What needs backend integration later?</h3>
          <p className="text-sm text-slate-300 mt-3">
            Production mode requires live data sources, API keys, payment provider setup, CRM
            setup, reviewed language packs, map / routing providers, and operator approval gates.
          </p>
          <Link href="/launch" className="wwai-btn-primary text-xs mt-4 inline-block">Production Launch Checklist</Link>
        </div>
      </section>

      {/* Meet WWAI */}
      <section className="wwai-panel p-8 text-center">
        <div className="wwai-chip wwai-chip-gold mb-2 inline-block">Meet WWAI</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Nowhere to go? WhichWay AI knows.</h2>
        <p className="text-slate-300 max-w-3xl mx-auto mt-3">
          Guests ask WWAI where to eat, how to get to their seat, where pickup is, what offers are
          nearby, or how to return to their hotel. TROPTIONS powers the sponsor, merchant, route,
          and revenue layer behind it.
        </p>
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          <Link href="/wwai"    className="wwai-btn-primary">Try WWAI Demo</Link>
          <Link href="/contact" className="wwai-btn-ghost">Contact Sales</Link>
        </div>
        <p className="text-[11px] text-slate-500 mt-4">
          Safety guidance is informational and demo-based. For emergencies, contact local emergency services immediately.
        </p>
      </section>
    </div>
  );
}
