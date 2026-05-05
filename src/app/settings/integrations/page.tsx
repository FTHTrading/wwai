
import AppShell from "@/components/layout/AppShell";
import DemoWarning from "@/components/layout/DemoWarning";
import { getSystemReadiness, type ProviderReadiness } from "@/lib/env";

export const dynamic = "force-dynamic";

function statusColor(s: ProviderReadiness["status"]) {
  return s === "configured" ? "wwai-chip-green"
       : s === "partial"    ? "wwai-chip-cyan"
       : "wwai-chip-red";
}

function ProviderRow({ p }: { p: ProviderReadiness }) {
  return (
    <div className="wwai-panel p-4">
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-white">{p.name}</div>
        <span className={`wwai-chip ${statusColor(p.status)}`}>{p.status}</span>
      </div>
      <div className="text-xs text-slate-400 mt-2">{p.docNote}</div>
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-widest text-slate-500">Required env</div>
        <ul className="mt-1 text-xs font-mono text-slate-300 space-y-0.5">
          {p.envKeys.map((k) => (
            <li key={k}>
              <span className={p.missing.includes(k) ? "text-rose-400" : "text-emerald-400"}>
                {p.missing.includes(k) ? "missing" : "set    "}
              </span>{"  "}
              {k}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const r = getSystemReadiness();

  return (
    <AppShell
      title="Integration Status"
      subtitle="Single source of truth for what is connected and what still needs credentials. Values are never displayed — only readiness flags and required env keys."
      badges={[r.environment, "Demo-safe"]}
    >
      <DemoWarning message="Provider keys shown here are read from server env only. Never paste secrets into the UI." />
      <div className="wwai-panel p-4 mb-6 text-sm text-slate-300">
        <span className="text-cyan-300 font-bold">How readiness works.</span>{" "}
        Each row checks <code className="text-cyan-300">process.env</code> for the listed keys. No secret values leave the server. Set keys in
        <code className="text-cyan-300"> .env.local</code> for development or in your hosting provider for production. Restart the dev server after changes.
      </div>

      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Database & Auth</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <div className="wwai-panel p-4">
          <div className="text-base font-bold text-white">Database</div>
          <div className="text-xs text-slate-400 mt-1">Mode: {r.database.mode}</div>
          <div className="text-xs font-mono text-slate-300 mt-2">{r.database.url}</div>
        </div>
        <div className="wwai-panel p-4">
          <div className="text-base font-bold text-white">Auth secrets</div>
          <ul className="text-xs font-mono text-slate-300 mt-2 space-y-0.5">
            <li><span className={r.auth.secretOk ? "text-emerald-400" : "text-rose-400"}>{r.auth.secretOk ? "set    " : "missing"}</span>{"  "}NEXTAUTH_SECRET</li>
            <li><span className={r.auth.urlOk    ? "text-emerald-400" : "text-rose-400"}>{r.auth.urlOk    ? "set    " : "missing"}</span>{"  "}NEXTAUTH_URL</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Payments</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <ProviderRow p={r.payments.square} />
        <ProviderRow p={r.payments.stripe} />
      </div>

      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-2">CRM</h2>
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <ProviderRow p={r.crm.zoho} />
        <ProviderRow p={r.crm.hubspot} />
        <ProviderRow p={r.crm.airtable} />
      </div>

      <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Map & Communications</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <ProviderRow p={r.map} />
        <ProviderRow p={r.email} />
      </div>

      <div className="wwai-panel p-4 text-xs text-slate-400">
        Demo mode never processes real payments and never writes to external CRM systems. Provider clients are only invoked when their required env keys are present.
      </div>
    </AppShell>
  );
}
