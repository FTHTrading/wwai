import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch Readiness — TROPTIONS™ Deployment Checklist",
  description: "Pre-launch deployment checklist for TROPTIONS. Review environment variables, database setup, payment providers, build status, and deploy steps.",
};

const ITEMS = [
  {
    section: "Database",
    color: "#22c55e",
    checks: [
      { label: "Prisma schema valid",           detail: "Run `npx prisma validate` to confirm",                                     envKey: null },
      { label: "Database migrations applied",   detail: "Run `npx prisma migrate deploy` in production",                           envKey: null },
      { label: "Seed data present",             detail: "Run `npx prisma db seed` if starting fresh",                              envKey: null },
      { label: "DATABASE_URL configured",       detail: "Libsql / Turso connection string or file:// path for SQLite",             envKey: "DATABASE_URL" },
    ],
  },
  {
    section: "Core Environment",
    color: "#00d4ff",
    checks: [
      { label: "NEXTAUTH_SECRET set",           detail: "Required for session security. Run `openssl rand -hex 32` to generate",  envKey: "NEXTAUTH_SECRET" },
      { label: "NEXTAUTH_URL configured",       detail: "Must match production URL (e.g. https://yourdomain.com)",                envKey: "NEXTAUTH_URL" },
      { label: "NODE_ENV=production in deploy", detail: "Set automatically by Vercel/Cloudflare. Verify if self-hosting",         envKey: "NODE_ENV" },
    ],
  },
  {
    section: "Payment Providers",
    color: "#d4a017",
    checks: [
      { label: "SQUARE_ACCESS_TOKEN (optional)",  detail: "Square sandbox token for testing, production token for live payments", envKey: "SQUARE_ACCESS_TOKEN" },
      { label: "STRIPE_SECRET_KEY (optional)",    detail: "Stripe sk_test_... for testing, sk_live_... for production",           envKey: "STRIPE_SECRET_KEY" },
      { label: "STRIPE_PUBLISHABLE_KEY (optional)", detail: "Stripe pk_test_... or pk_live_... for client-side elements",         envKey: "STRIPE_PUBLISHABLE_KEY" },
    ],
  },
  {
    section: "AI / CRM (Optional)",
    color: "#8b5cf6",
    checks: [
      { label: "OPENAI_API_KEY (optional)",     detail: "Used by the AI chat assistant and proposal drafting features",            envKey: "OPENAI_API_KEY" },
      { label: "CRM webhook URL (optional)",    detail: "POST target when a new lead or proposal is created",                     envKey: "CRM_WEBHOOK_URL" },
      { label: "SENDGRID_API_KEY (optional)",   detail: "For automated invoice email delivery",                                   envKey: "SENDGRID_API_KEY" },
    ],
  },
  {
    section: "Build & Deploy",
    color: "#22c55e",
    checks: [
      { label: "npm run build passes",          detail: "Run locally before deployment. Should output 55+ routes",               envKey: null },
      { label: "npm run lint passes 0/0",       detail: "Run locally. Fix all ESLint errors before deploying",                   envKey: null },
      { label: "Wrangler config present",       detail: "wrangler.toml exists for Cloudflare Pages deployment",                  envKey: null },
      { label: "Public assets verified",        detail: "Check public/ for icons, manifest.json, and any sponsor logos",        envKey: null },
    ],
  },
];

const DEPLOY_STEPS = [
  { num: "1", label: "Configure .env.local",    desc: "Copy .env.example to .env.local. Fill in DATABASE_URL, NEXTAUTH_SECRET, and any payment keys you need." },
  { num: "2", label: "Run migrations",           desc: "npx prisma migrate deploy — applies all pending migrations to the production database." },
  { num: "3", label: "Generate Prisma client",  desc: "npx prisma generate — must run after any schema change or fresh install." },
  { num: "4", label: "Seed initial data",        desc: "npx prisma db seed — loads 5 sponsor packages, sample venues, and demo invoices." },
  { num: "5", label: "Run build",               desc: "npm run build — confirms no TypeScript or lint errors. Expect 55+ routes." },
  { num: "6", label: "Deploy to Cloudflare",    desc: "npm run deploy or wrangler pages deploy. See CLOUDFLARE_PAGES_STAGING_RUNBOOK.md for full steps." },
];

function StatusBadge({ ok }: { ok: boolean | null }) {
  if (ok === null) return <span className="text-slate-600 text-xs">Manual check</span>;
  return ok
    ? <span className="text-green-400 text-xs font-semibold">Detected</span>
    : <span className="text-[#d4a017] text-xs font-semibold">Not set</span>;
}

export default function LaunchPage() {

  return (
    <div className="space-y-10">

      {/* Header */}
      <section className="pt-10 pb-2 text-center space-y-4 relative">
        <div className="absolute inset-0 city-bg-glow pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="pill-gold">Launch Readiness</span>
          <h1 className="troptions-hero-brand">Deployment Checklist</h1>
          <p className="troptions-hero-subtitle">Environment, database, build, and deploy</p>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Review each section before going live. Yellow items need configuration. Green items are in place.
          </p>
        </div>
      </section>

      {/* Checklist Sections */}
      <section className="space-y-6">
        {ITEMS.map(section => (
          <div key={section.section} className="card-dark rounded-2xl overflow-hidden">
            <div className="border-b border-[#162035] px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: section.color }} />
              <h2 className="text-white font-bold text-sm">{section.section}</h2>
            </div>
            <div className="divide-y divide-[#162035]">
              {section.checks.map(c => (
                <div key={c.label} className="px-6 py-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{c.label}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{c.detail}</p>
                    {c.envKey && (
                      <code className="text-[#00d4ff] text-[11px] font-mono bg-[#050810] px-2 py-0.5 rounded border border-[#162035]">
                        {c.envKey}
                      </code>
                    )}
                  </div>
                  <div className="shrink-0 pt-1">
                    {c.envKey ? (
                      <StatusBadge ok={null} />
                    ) : (
                      <span className="text-slate-600 text-xs">Manual check</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Deploy Steps */}
      <section className="space-y-4">
        <h2 className="text-white font-bold text-lg">Deployment Steps</h2>
        <div className="space-y-3">
          {DEPLOY_STEPS.map(step => (
            <div key={step.num} className="card-dark rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center shrink-0">
                <span className="text-[#00d4ff] text-xs font-bold">{step.num}</span>
              </div>
              <div className="space-y-1">
                <p className="text-white text-sm font-semibold">{step.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Env file example */}
      <section className="card-dark rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-bold text-sm">Example .env.local</h2>
        <pre className="text-[11px] text-slate-400 font-mono bg-[#050810] rounded-xl p-4 border border-[#162035] overflow-x-auto leading-6">{`# Core
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://yourdomain.com"

# Payment (optional)
SQUARE_ACCESS_TOKEN="EAAAl..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# AI (optional)
OPENAI_API_KEY="sk-..."

# CRM / Email (optional)
CRM_WEBHOOK_URL="https://hook.example.com/troptions"
SENDGRID_API_KEY="SG..."`}</pre>
        <p className="text-slate-600 text-xs">Never commit .env.local to source control. Add it to .gitignore.</p>
      </section>

    </div>
  );
}
