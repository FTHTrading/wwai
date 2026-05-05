import Link from "next/link";
import WhichWayLiveBrand from "@/components/brand/WhichWayLiveBrand";
import WhichWayLiveLogo from "@/components/brand/WhichWayLiveLogo";

export const metadata = {
  title: "whichway.live — Powered by TROPTIONS",
  description:
    "whichway.live is the AI-powered event-city navigation, intelligence, and commerce layer powered by TROPTIONS.",
};

export default function WhichWayBrandPage() {
  return (
    <div className="-mx-4">
      {/* Hero section — full-bleed black with subtle radial glow */}
      <section className="relative overflow-hidden bg-black">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(43,208,229,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 50% 80%, rgba(126,227,106,0.14), transparent 60%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <WhichWayLiveBrand />
        </div>
      </section>

      {/* About + value props */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">
              About whichway.live
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              The AI concierge for event cities — built on TROPTIONS infrastructure.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              whichway.live is the guest-facing brand of WWAI — WhichWay AI. Visitors arriving for
              a major event ask whichway.live where to eat, how to get to the venue, what
              experiences are nearby, and which sponsor offers are live. TROPTIONS is the SalesOS
              and GuestOps platform underneath: registrations, packages, sponsor placements,
              analytics, and operator review.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/wwai" className="wwai-btn-primary">Try the Concierge</Link>
              <Link href="/sales-deck" className="wwai-btn-ghost">View Sales Deck</Link>
              <Link href="/sales-registration" className="wwai-btn-ghost">Register a Business</Link>
            </div>
          </div>

          <div className="wwai-panel p-6 flex flex-col items-center text-center">
            <WhichWayLiveLogo size={120} variant="gradient" />
            <div className="mt-4 text-sm font-bold text-white">whichway.live</div>
            <div className="text-xs text-slate-400 mt-1">Event-city AI · powered by TROPTIONS</div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#2bd0e5]/30 bg-[#2bd0e5]/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7ee36a] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2bd0e5]">
                Demo Build
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand usage block */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="wwai-panel p-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-4">
            Brand Mark Variations
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Primary on dark", variant: "gradient" as const, bg: "bg-[#0a0f1e]" },
              { label: "Primary on light", variant: "white" as const, bg: "bg-white" },
              { label: "Mono on dark", variant: "mono" as const, bg: "bg-[#0a0f1e]" },
              { label: "Outline circle", variant: "outline" as const, bg: "bg-[#020611]" },
            ].map((v) => (
              <div key={v.label} className="space-y-2">
                <div className={`flex items-center justify-center aspect-square rounded-2xl border border-[#1a2540] ${v.bg}`}>
                  <WhichWayLiveLogo size={130} variant={v.variant} />
                </div>
                <div className="text-xs text-center text-slate-400 font-medium">{v.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-xs text-slate-500">
            Use the gradient mark on dark backgrounds. Use the white-card variant for print
            materials. Use the mono variant when overlaying on photographs. The outline variant
            works as a small profile/avatar icon.
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-[#1a2540] bg-gradient-to-br from-[#0a0f1e] to-[#020611] p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            One city. One crowd. One operating system.
          </h3>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
            whichway.live answers the guest. TROPTIONS sells, registers, and operates the city.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/wwai" className="wwai-btn-primary">Try whichway.live</Link>
            <Link href="/contact" className="wwai-btn-ghost">Contact Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
