import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const DOCUMENTS = [
  {
    id: "partner-overview",
    title: "Partner Overview",
    description: "High-level overview of the WWAI / TROPTIONS platform for business partners. Covers what the system is, who it serves, and why businesses register.",
    category: "Onboarding",
    href: "/sales-documents/partner-overview",
    icon: "📄",
  },
  {
    id: "package-sheet",
    title: "Package Reference Sheet",
    description: "All packages across all categories with pricing, included services, and recommended buyers. Printable reference for sales conversations.",
    category: "Sales Reference",
    href: "/sales-documents/package-sheet",
    icon: "📋",
  },
  {
    id: "intake-summary",
    title: "Intake Summary Template",
    description: "Blank intake summary form template for prospects who want to understand what information will be collected during registration.",
    category: "Registration",
    href: "/sales-documents/intake-summary",
    icon: "📝",
  },
  {
    id: "proposal-worksheet",
    title: "Proposal Worksheet",
    description: "Interactive proposal worksheet to build a package proposal for a prospect. Shows pricing, services, and next steps.",
    category: "Sales Tool",
    href: "/sales-documents/proposal-worksheet",
    icon: "📊",
  },
  {
    id: "qr-campaign-guide",
    title: "QR Campaign Guide",
    description: "How QR campaigns work within WWAI — deployment, redemption tracking, analytics, and how to explain the value to clients.",
    category: "Campaign",
    href: "/sales-documents/qr-campaign-guide",
    icon: "📱",
  },
  {
    id: "analytics-overview",
    title: "Analytics Overview",
    description: "What analytics are available per package tier — dashboard views, redemption data, foot traffic impact, and how to present ROI.",
    category: "Analytics",
    href: "/sales-documents/analytics-overview",
    icon: "📈",
  },
  {
    id: "sponsorship-brief",
    title: "Sponsorship Brief",
    description: "Sponsor-focused overview of WWAI brand placement opportunities, from local sponsor to enterprise partner. Ideal for brand/marketing decision-makers.",
    category: "Sponsorship",
    href: "/sales-documents/sponsorship-brief",
    icon: "⭐",
  },
  {
    id: "sales-partner-program",
    title: "Sales Partner Program Guide",
    description: "How the sales partner program works — who can join, what they sell, commission structure, and how proposals flow.",
    category: "Partner Program",
    href: "/sales-documents/sales-partner-program",
    icon: "🤝",
  },
  {
    id: "onboarding-checklist",
    title: "Client Onboarding Checklist",
    description: "Step-by-step checklist for onboarding a new client after the package is sold — from intake to campaign go-live.",
    category: "Onboarding",
    href: "/sales-documents/onboarding-checklist",
    icon: "✅",
  },
  {
    id: "demo-disclaimer",
    title: "Demo System Disclaimer",
    description: "Formal disclaimer document explaining that the WWAI / TROPTIONS system is currently operating in demo mode. For use in early-stage client meetings.",
    category: "Legal / Compliance",
    href: "/sales-documents/demo-disclaimer",
    icon: "⚠",
  },
];

const CATEGORIES = [...new Set(DOCUMENTS.map((d) => d.category))];

export const metadata = {
  title: "Sales Documents | TROPTIONS · WWAI",
  description:
    "WWAI / TROPTIONS sales document center — partner overviews, package sheets, proposals, and onboarding materials.",
};

export default function SalesDocumentsPage() {
  return (
    <AppShell
      title="Sales Documents"
      subtitle="Sales support materials, partner overviews, package references, and printable documents for client meetings."
      badges={["Demo docs", "Printable"]}
    >
      <section className="wwai-panel p-5 mb-6">
        <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold mb-2">
          How to Use These Documents
        </div>
        <p className="text-sm text-slate-300">
          Select any document below to view a printable version. Use your browser&apos;s print function
          (Ctrl+P / Cmd+P) or the &quot;Print / Save PDF&quot; button within each document to export.
          All documents include proper print styling — white background, clean layout, no dark UI elements.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/sales-deck" className="wwai-btn-primary text-xs">View Sales Deck</Link>
          <Link href="/sales-registration/intake" className="wwai-btn-ghost text-xs">Start Registration</Link>
          <Link href="/proposals" className="wwai-btn-ghost text-xs">Proposal Builder</Link>
        </div>
      </section>

      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">{cat}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {DOCUMENTS.filter((d) => d.category === cat).map((doc) => (
              <Link
                key={doc.id}
                href={doc.href}
                className="card-dark-hover p-5 flex gap-4 no-underline"
              >
                <span className="text-3xl shrink-0">{doc.icon}</span>
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-white text-sm">{doc.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{doc.description}</div>
                  <div className="mt-2">
                    <span className="wwai-chip wwai-chip-cyan">{doc.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
