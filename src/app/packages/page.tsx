import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import PackageCard from "@/components/packages/PackageCard";
import {
  SPONSOR_PACKAGES, MERCHANT_PACKAGES, HOTEL_PACKAGES, DRIVER_PACKAGES,
} from "@/data/demoData";

export default function PackagesPage() {
  return (
    <AppShell
      title="Packages"
      subtitle="Sponsor, merchant, hotel, and driver packages — all configurable into a proposal."
      badges={["Pricing demo", "Annual + setup"]}
    >
      <section className="wwai-panel p-5 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">How packages fit the system</div>
        <p className="text-sm text-slate-300 mt-2">
          TROPTIONS sells and operates the system. WWAI guides the guest. Businesses register, packages are
          selected, proposals are built, campaigns launch, analytics track value, and billing is prepared.
          Everything below is demo pricing until connected to a payment provider.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/register"  className="wwai-btn-ghost text-xs">Register Business</Link>
          <Link href="/proposals" className="wwai-btn-primary text-xs">Build Proposal</Link>
          <Link href="/admin"     className="wwai-btn-ghost text-xs">Operator Admin</Link>
          <Link href="/billing"   className="wwai-btn-ghost text-xs">Billing Readiness</Link>
          <Link href="/analytics" className="wwai-btn-ghost text-xs">Analytics</Link>
        </div>
      </section>

      <div className="space-y-10">
        <Section title="Sponsor Packages" packages={SPONSOR_PACKAGES} />
        <Section title="Merchant / Restaurant / Bar Packages" packages={MERCHANT_PACKAGES} />
        <Section title="Hotel Packages" packages={HOTEL_PACKAGES} />
        <Section title="Driver / Transportation Packages" packages={DRIVER_PACKAGES} />
      </div>
    </AppShell>
  );
}

function Section({ title, packages }: { title: string; packages: typeof SPONSOR_PACKAGES }) {
  return (
    <section>
      <h2 className="text-xl font-extrabold text-white mb-3">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
      </div>
    </section>
  );
}
