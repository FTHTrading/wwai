import AppShell from "@/components/layout/AppShell";
import DemoWarning from "@/components/layout/DemoWarning";

const SECTIONS = [
  {
    title: "Database",
    items: [
      "Provision Postgres / Cosmos / Cloud SQL",
      "Run prisma migrations (schema in /prisma/schema.prisma)",
      "Seed core packages, sponsors, zones, and agent definitions",
      "Wire submissions, proposals, leads, campaigns to real DB instead of localStorage",
    ],
  },
  { title: "Map provider",       items: ["Outdoor adapter scaffolded at lib/maps/* (provider/maplibre/mapbox/mappedin)", "Set NEXT_PUBLIC_MAP_PROVIDER=maplibre for free OSM + OSRM today", "Mapbox token (NEXT_PUBLIC_MAPBOX_TOKEN) for branded tiles + Directions API", "Azure Maps key (NEXT_PUBLIC_AZURE_MAPS_KEY) as enterprise alternative"] },
  { title: "Indoor venue map",   items: ["Mappedin SDK (NEXT_PUBLIC_MAPPEDIN_*) for stadium-grade wayfinding", "IMDF (Indoor Mapping Data Format, OGC standard) for portable venue data", "ArcGIS Indoors for IPS + BIM/CAD ingest at enterprise venues", "Apple MapKit Indoor when venue publishes IMDF to Apple"] },
  { title: "Routing",            items: ["MapLibre adapter uses public OSRM demo — replace with hosted OSRM/Valhalla", "Mapbox Directions / Azure Maps Route for production SLAs", "Add safety-corridor scoring + operator review queue"] },
  { title: "Payment provider",   items: ["Connect Square / Stripe / manual invoicing", "Wire subscription billing for monthly packages, one-time setup", "Webhooks for invoice paid, failed, refunded"] },
  { title: "CRM integration",    items: ["HubSpot / Salesforce / Pipedrive sync for leads + proposals", "Outbound email transactional via Postmark / SendGrid / Resend"] },
  { title: "RAG layer",          items: ["Document corpus → embeddings", "Vector store (pgvector / Azure AI Search / Pinecone)", "Retrieval policy + citation surfacing in WWAI"] },
  { title: "MCP layer",          items: ["Wire MCP tools: place_search, route_build, qr_activate, sponsor_match, lead_create, proposal_draft, safety_query"] },
  { title: "AI runtime",         items: ["Choose primary LLM (Azure OpenAI / Foundry / Anthropic / NIM / Ollama)", "Add fallback model + safety filter", "Voice (Deepgram / Azure Speech) for concierge"] },
  { title: "Language packs",     items: ["Reviewed translation packs for 8 demo languages", "Localize WWAI personality and disclaimers per region"] },
  { title: "Safety operator",    items: ["Designate safety operator for route review", "Operator dashboard for live event monitoring", "Incident escalation paths (911, venue ops, hotel ops)"] },
  { title: "Environment vars",   items: ["DATABASE_URL", "NEXT_PUBLIC_MAP_KEY", "STRIPE_SECRET / SQUARE_ACCESS_TOKEN", "OPENAI_API_KEY / FOUNDRY_KEY", "DEEPGRAM_KEY", "RAG_INDEX_URL"] },
  { title: "Open TODOs",         items: ["Replace localStorage with API routes", "Wire admin actions to DB", "Add auth (operator vs guest vs sponsor)", "Add analytics provider (PostHog / Azure Monitor)", "QR scan service + redemption tracker"] },
];

export default function LaunchPage() {
  return (
    <AppShell
      title="Production Launch Checklist"
      subtitle="Everything required to take this demo from sales-ready to production in a real event city."
      badges={["Operator handoff"]}
    >
      <DemoWarning />
      <div className="wwai-panel p-4 mb-5 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">Production handoff.</span>{" "}
        Today: TROPTIONS is sales-ready as a demo — packages, registration, proposals, admin, analytics, billing,
        WWAI concierge, and safety-informed routes all run on local data. Below is the work required to connect
        live data, payments, CRM, AI runtimes, and operator review for a real event city.
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <div key={s.title} className="wwai-panel p-5">
            <h3 className="font-bold text-white">{s.title}</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
              {s.items.map((it) => (
                <li key={it} className="flex gap-2">
                  <span className="text-cyan-400">›</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
