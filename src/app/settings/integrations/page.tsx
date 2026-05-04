"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ProviderReadiness {
  name:       string;
  status:     "configured" | "unconfigured" | "partial";
  configured: boolean;
  envKeys:    string[];
  missing:    string[];
  docNote:    string;
}

interface SystemReadiness {
  database:    { mode: "local" | "remote"; url: string };
  auth:        { secretOk: boolean; urlOk: boolean };
  payments:    { square: ProviderReadiness; stripe: ProviderReadiness };
  map:         ProviderReadiness;
  crm:         { zoho: ProviderReadiness; hubspot: ProviderReadiness; airtable: ProviderReadiness };
  email:       ProviderReadiness;
  environment: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "configured")
    return <span className="text-xs font-bold text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded">Configured</span>;
  if (status === "partial")
    return <span className="text-xs font-bold text-[#d4a017] border border-[#d4a017]/30 bg-[#d4a017]/10 px-2 py-0.5 rounded">Partial</span>;
  return <span className="text-xs font-bold text-slate-500 border border-slate-700 bg-slate-800 px-2 py-0.5 rounded">Not configured</span>;
}

function BoolBadge({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return ok
    ? <span className="text-xs font-bold text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded">{yes}</span>
    : <span className="text-xs font-bold text-[#d4a017] border border-[#d4a017]/30 bg-[#d4a017]/10 px-2 py-0.5 rounded">{no}</span>;
}

function ProviderCard({ provider, alwaysOn = false }: { provider: ProviderReadiness; alwaysOn?: boolean }) {
  return (
    <div className={`card-dark rounded-xl overflow-hidden border ${
      alwaysOn || provider.configured
        ? "border-green-500/20"
        : provider.status === "partial"
        ? "border-[#d4a017]/20"
        : "border-slate-700"
    }`}>
      <div className="border-b border-[#162035] px-4 py-3 flex items-center justify-between gap-2">
        <span className="text-white font-semibold text-sm">{provider.name}</span>
        <StatusBadge status={alwaysOn ? "configured" : provider.status} />
      </div>
      <div className="p-4 space-y-3">
        {!alwaysOn && provider.envKeys.length > 0 && (
          <div className="space-y-1">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">Required env vars</p>
            <div className="space-y-1">
              {provider.envKeys.map(k => (
                <div key={k} className="flex items-center gap-2">
                  <code className="text-[11px] font-mono text-[#00d4ff] bg-[#050810] border border-[#162035] px-2 py-0.5 rounded flex-1">{k}</code>
                  {provider.missing.includes(k)
                    ? <span className="text-[#d4a017] text-[9px] font-bold shrink-0">missing</span>
                    : <span className="text-green-400 text-[9px] font-bold shrink-0">set</span>
                  }
                </div>
              ))}
            </div>
          </div>
        )}
        {alwaysOn && (
          <p className="text-green-400/70 text-xs">Always available. No configuration required.</p>
        )}
        {!alwaysOn && (
          <p className="text-slate-600 text-[10px] leading-relaxed">{provider.docNote}</p>
        )}
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [data,    setData]    = useState<SystemReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"payments" | "crm" | "system">("payments");

  useEffect(() => {
    fetch("/api/system-status")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <section className="pt-8 pb-2 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/settings" className="hover:text-slate-300 transition-colors">Settings</Link>
            <span>/</span>
            <span className="text-slate-300">Integrations</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="pill-gold">Integration Readiness</span>
              <h1 className="text-3xl font-black text-white">
                <span className="gradient-cyan">Provider</span> Status
              </h1>
              <p className="text-slate-400 text-sm">
                All provider readiness is based on presence of env vars. No secrets are displayed.
              </p>
            </div>
            <Link href="/launch" className="px-4 py-2 border border-[#162035] text-slate-300 rounded-xl text-sm font-semibold hover:border-[#00d4ff]/40 transition-colors">
              Deploy Checklist →
            </Link>
          </div>
        </div>
      </section>

      {loading && (
        <div className="card-dark rounded-2xl p-10 text-center">
          <p className="text-slate-500 text-sm">Loading system status…</p>
        </div>
      )}

      {!loading && !data && (
        <div className="card-dark rounded-2xl p-10 text-center space-y-2">
          <p className="text-red-400 font-semibold text-sm">Could not load system status</p>
          <p className="text-slate-500 text-xs">Check that the Next.js server is running and /api/system-status is reachable.</p>
        </div>
      )}

      {!loading && data && (
        <>
          {/* System Summary Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card space-y-1">
              <p className="text-white font-bold text-base capitalize">{data.environment}</p>
              <p className="text-slate-500 text-xs">Environment</p>
            </div>
            <div className="stat-card space-y-1">
              <p className="text-white font-bold text-base capitalize">{data.database.mode}</p>
              <p className="text-slate-500 text-xs">Database Mode</p>
              <p className="text-slate-600 text-[10px]">{data.database.url}</p>
            </div>
            <div className="stat-card space-y-1">
              <BoolBadge ok={data.auth.secretOk} yes="Set" no="Missing" />
              <p className="text-slate-500 text-xs mt-1">NEXTAUTH_SECRET</p>
            </div>
            <div className="stat-card space-y-1">
              {[
                data.payments.square.configured,
                data.payments.stripe.configured,
              ].some(Boolean)
                ? <span className="text-green-400 text-base font-bold">Active</span>
                : <span className="text-[#d4a017] text-base font-bold">Manual only</span>
              }
              <p className="text-slate-500 text-xs mt-1">Payment Providers</p>
            </div>
          </section>

          {/* Tabs */}
          <section>
            <div className="flex gap-1 border-b border-[#162035] mb-6">
              {(["payments", "crm", "system"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                    tab === t
                      ? "border-[#00d4ff] text-[#00d4ff]"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}>{t === "crm" ? "CRM" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>

            {/* Payments Tab */}
            {tab === "payments" && (
              <div className="space-y-4">
                <p className="text-slate-500 text-xs">Configure at least one payment provider to enable payment link generation. Manual tracking is always active.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <ProviderCard provider={data.payments.square} />
                  <ProviderCard provider={data.payments.stripe} />
                  <ProviderCard provider={{ name: "Manual Payments", status: "configured", configured: true, envKeys: [], missing: [], docNote: "" }} alwaysOn />
                </div>
                <div className="card-dark rounded-xl p-4 space-y-2">
                  <p className="text-slate-400 text-xs font-semibold">How to enable a payment provider</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-500 text-xs leading-relaxed">
                    <li>Add the required env vars to <code className="text-slate-400">.env.local</code></li>
                    <li>Restart the dev server (<code className="text-slate-400">npm run dev</code>) or redeploy</li>
                    <li>Implement the payment link function in <code className="text-slate-400">src/lib/payments.ts</code></li>
                    <li>The Billing page will automatically enable the Create Payment Link button</li>
                  </ol>
                </div>
              </div>
            )}

            {/* CRM Tab */}
            {tab === "crm" && (
              <div className="space-y-4">
                <p className="text-slate-500 text-xs">Configure one CRM provider to automatically push new leads. Manual CSV export is always available from the Analytics page.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProviderCard provider={data.crm.zoho} />
                  <ProviderCard provider={data.crm.hubspot} />
                  <ProviderCard provider={data.crm.airtable} />
                  <ProviderCard provider={{ name: "Manual CSV Export", status: "configured", configured: true, envKeys: [], missing: [], docNote: "" }} alwaysOn />
                </div>
                <div className="card-dark rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-xs font-semibold">Export leads now</p>
                    <a href="/api/leads/export" download
                      className="px-3 py-1.5 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 rounded-lg text-xs font-semibold hover:bg-[#00d4ff]/20 transition-colors">
                      Download CSV
                    </a>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Downloads all leads as a CSV file — name, email, company, type, status, source, estimated value, created date.
                  </p>
                </div>
                <div className="card-dark rounded-xl p-4 space-y-2">
                  <p className="text-slate-400 text-xs font-semibold">How to enable a CRM provider</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-500 text-xs leading-relaxed">
                    <li>Add the required env vars to <code className="text-slate-400">.env.local</code></li>
                    <li>Restart the dev server or redeploy</li>
                    <li>Implement the push function in <code className="text-slate-400">src/lib/crm.ts</code> for your provider</li>
                    <li>Call <code className="text-slate-400">pushLeadToCRM(contact)</code> from the lead creation flow</li>
                  </ol>
                </div>
              </div>
            )}

            {/* System Tab */}
            {tab === "system" && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Auth */}
                  <div className="card-dark rounded-xl overflow-hidden">
                    <div className="border-b border-[#162035] px-4 py-3">
                      <span className="text-white font-semibold text-sm">Authentication</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        { key: "NEXTAUTH_SECRET", ok: data.auth.secretOk, note: "Required for session security" },
                        { key: "NEXTAUTH_URL",    ok: data.auth.urlOk,    note: "Must match production domain" },
                      ].map(row => (
                        <div key={row.key} className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <code className="text-[11px] font-mono text-[#00d4ff]">{row.key}</code>
                            <p className="text-slate-600 text-[10px]">{row.note}</p>
                          </div>
                          <BoolBadge ok={row.ok} yes="Set" no="Missing" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Database */}
                  <div className="card-dark rounded-xl overflow-hidden">
                    <div className="border-b border-[#162035] px-4 py-3">
                      <span className="text-white font-semibold text-sm">Database</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Mode</span>
                        <span className={`text-sm font-semibold ${data.database.mode === "remote" ? "text-green-400" : "text-[#d4a017]"}`}>
                          {data.database.url}
                        </span>
                      </div>
                      <div>
                        <code className="text-[11px] font-mono text-[#00d4ff] bg-[#050810] border border-[#162035] px-2 py-0.5 rounded block">DATABASE_URL</code>
                        <p className="text-slate-600 text-[10px] mt-1">
                          {data.database.mode === "local"
                            ? "Using local SQLite. Set DATABASE_URL to a Turso libsql:// URL for production."
                            : "Using remote LibSQL / Turso database."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="card-dark rounded-xl overflow-hidden">
                    <div className="border-b border-[#162035] px-4 py-3">
                      <span className="text-white font-semibold text-sm">Map Tiles</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Provider</span>
                        <span className="text-green-400 text-sm font-semibold">OpenFreeMap</span>
                      </div>
                      <p className="text-slate-600 text-xs">{data.map.docNote}</p>
                      {data.map.envKeys.map(k => (
                        <code key={k} className="text-[11px] font-mono text-[#00d4ff]/60 bg-[#050810] border border-[#162035] px-2 py-0.5 rounded block">{k} (optional)</code>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`card-dark rounded-xl overflow-hidden border ${data.email.configured ? "border-green-500/20" : "border-slate-700"}`}>
                    <div className="border-b border-[#162035] px-4 py-3 flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">Email (SendGrid)</span>
                      <StatusBadge status={data.email.status} />
                    </div>
                    <div className="p-4 space-y-3">
                      {data.email.envKeys.map(k => (
                        <div key={k} className="flex items-center gap-2">
                          <code className="text-[11px] font-mono text-[#00d4ff] bg-[#050810] border border-[#162035] px-2 py-0.5 rounded flex-1">{k}</code>
                          {data.email.missing.includes(k)
                            ? <span className="text-[#d4a017] text-[9px] font-bold shrink-0">missing</span>
                            : <span className="text-green-400 text-[9px] font-bold shrink-0">set</span>
                          }
                        </div>
                      ))}
                      <p className="text-slate-600 text-[10px]">{data.email.docNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
}
