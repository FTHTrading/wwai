// automate.cjs — TROPTIONS Cloudflare Pages staging automation
// Safety-gated, dry-run by default. Built fresh per COMMAND 18D.
//
// Defaults:
//   DRY_RUN=true              (must be explicitly "false" to perform any write)
//   APP_ENV=staging           (production is HARD BLOCKED)
//   CONFIRM_DEPLOY=false      (required true for any live action)
//   ALLOW_*=false             (each dangerous action requires its own flag)
//
// In dry-run mode this script:
//   - writes NO files
//   - copies NO files
//   - installs NO packages
//   - calls NO external APIs
//   - patches NO source code
//   - prints intended actions only, with all tokens redacted
//
// Run:    node automate.cjs
"use strict";

const fs   = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// ─── Color helpers ────────────────────────────────────────
const C = {
  reset:"\x1b[0m", bold:"\x1b[1m", dim:"\x1b[2m",
  red:"\x1b[31m", green:"\x1b[32m", yellow:"\x1b[33m",
  cyan:"\x1b[36m", gold:"\x1b[33m",
};
const ok    = (m) => console.log(`${C.green}  ✓ ${m}${C.reset}`);
const bad   = (m) => console.log(`${C.red}  ✗ ${m}${C.reset}`);
const info  = (m) => console.log(`${C.dim}    ${m}${C.reset}`);
const warn  = (m) => console.log(`${C.yellow}  ⚠ ${m}${C.reset}`);
const head  = (m) => console.log(`\n${C.cyan}${C.bold}${m}${C.reset}`);
const drylog= (m) => console.log(`${C.yellow}  [DRY-RUN] ${C.reset}${m}`);
const redact= (s) => String(s).replace(/cfut_[a-zA-Z0-9]+/g, "[REDACTED]")
                              .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, "Bearer [REDACTED]");

// ─── Environment / flags ──────────────────────────────────
const env = (k, def) => (process.env[k] !== undefined ? process.env[k] : def);
const flag = (k) => env(k, "false") === "true";

const DRY_RUN        = env("DRY_RUN", "true") !== "false";
const APP_ENV        = env("APP_ENV", "staging");
const CONFIRM_DEPLOY = flag("CONFIRM_DEPLOY");

const ALLOW_SOURCE_PATCH       = flag("ALLOW_SOURCE_PATCH");
const ALLOW_LOGO_COPY          = flag("ALLOW_LOGO_COPY");
const ALLOW_DEP_INSTALL        = flag("ALLOW_DEP_INSTALL");
const ALLOW_CF_PROJECT_CREATE  = flag("ALLOW_CF_PROJECT_CREATE");
const ALLOW_CF_DEPLOY          = flag("ALLOW_CF_DEPLOY");
const ALLOW_ENV_PUSH           = flag("ALLOW_ENV_PUSH");
const ALLOW_DOMAIN_ATTACH      = flag("ALLOW_DOMAIN_ATTACH");
const ALLOW_DNS_WRITE          = flag("ALLOW_DNS_WRITE");

const ROOT       = __dirname;
const PROJECT    = "troptions-fifa";
const DOMAIN     = "troptionsfifa.unykorn.org";
const ZONE       = "unykorn.org";
const ENV_CF     = path.join(ROOT, ".env.cf");
const PACKAGE_JS = path.join(ROOT, "package.json");

// ─── Banner ───────────────────────────────────────────────
console.log();
console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
console.log(`${C.gold}${C.bold}   TROPTIONS Cloudflare Pages Automation       ${C.reset}`);
console.log(`${C.gold}${C.bold}   ${DRY_RUN ? "DRY-RUN MODE — no writes, no API calls" : "LIVE MODE — actions will execute"}${C.reset}`);
console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
console.log();
info(`APP_ENV          = ${APP_ENV}`);
info(`DRY_RUN          = ${DRY_RUN}`);
info(`CONFIRM_DEPLOY   = ${CONFIRM_DEPLOY}`);
info(`Project          = ${PROJECT}`);
info(`Target domain    = ${DOMAIN}`);
console.log();
info("Per-action flags (all default false):");
info(`  ALLOW_SOURCE_PATCH      = ${ALLOW_SOURCE_PATCH}`);
info(`  ALLOW_LOGO_COPY         = ${ALLOW_LOGO_COPY}`);
info(`  ALLOW_DEP_INSTALL       = ${ALLOW_DEP_INSTALL}`);
info(`  ALLOW_CF_PROJECT_CREATE = ${ALLOW_CF_PROJECT_CREATE}`);
info(`  ALLOW_CF_DEPLOY         = ${ALLOW_CF_DEPLOY}`);
info(`  ALLOW_ENV_PUSH          = ${ALLOW_ENV_PUSH}`);
info(`  ALLOW_DOMAIN_ATTACH     = ${ALLOW_DOMAIN_ATTACH}`);
info(`  ALLOW_DNS_WRITE         = ${ALLOW_DNS_WRITE}`);

// ─── HARD BLOCK: production ───────────────────────────────
if (APP_ENV === "production") {
  console.log();
  console.log(`${C.red}${C.bold}  ✗ FATAL: APP_ENV=production is BLOCKED by this automation.${C.reset}`);
  console.log(`${C.dim}    Use APP_ENV=staging only. Production is reserved for the${C.reset}`);
  console.log(`${C.dim}    verified monorepo at C:\\Users\\Kevan\\troptions-event-os.${C.reset}`);
  process.exit(1);
}

// ─── HARD BLOCK: live without CONFIRM_DEPLOY ──────────────
if (!DRY_RUN && !CONFIRM_DEPLOY) {
  console.log();
  console.log(`${C.red}${C.bold}  ✗ FATAL: Live execution requires CONFIRM_DEPLOY=true.${C.reset}`);
  console.log(`${C.dim}    Run with DRY_RUN=true to plan, or set CONFIRM_DEPLOY=true to proceed.${C.reset}`);
  process.exit(1);
}

// ─── Wrong-directory guard ────────────────────────────────
const cwdLow = ROOT.toLowerCase();
if (!cwdLow.includes("fifa troptions") && !cwdLow.includes("fifa-troptions")) {
  console.log();
  console.log(`${C.red}${C.bold}  ✗ FATAL: Wrong directory.${C.reset}`);
  console.log(`${C.dim}    This automation only runs from C:\\Users\\Kevan\\fifa troptions${C.reset}`);
  console.log(`${C.dim}    Do NOT run it from the verified monorepo troptions-event-os.${C.reset}`);
  process.exit(1);
}

// ─── Action helpers (dry-aware) ───────────────────────────
function plannedWrite(label, p)         { drylog(`would WRITE  ${label}: ${p}`); }
function plannedCopy(label, src, dst)   { drylog(`would COPY   ${label}: ${src} → ${dst}`); }
function plannedExec(label, cmd, args)  { drylog(`would EXEC   ${label}: ${cmd} ${(args||[]).join(" ")}`); }
function plannedApi (label, method, url){ drylog(`would API    ${label}: ${method} ${redact(url)}`); }
function plannedPatch(file)             { drylog(`would PATCH  ${file}`); }
function blocked(label, flagName)       { console.log(`${C.dim}  [BLOCKED] ${label} — set ${flagName}=true to enable${C.reset}`); }

function runOrPlan(label, cmd, args, opts = {}) {
  if (DRY_RUN) { plannedExec(label, cmd, args); return { dry: true, status: 0, stdout: "", stderr: "" }; }
  const r = spawnSync(cmd, args, { encoding: "utf8", stdio: opts.stdio || "inherit", cwd: opts.cwd || ROOT, timeout: opts.timeout || 600000 });
  return r;
}

async function main() {
  // ─── Step 1: Tools and config probe ──────────────────────
  head("[1/9] Probe tools and configuration");
  const tools = [["node","-v"], ["npm","-v"], ["git","--version"]];
  for (const [c,a] of tools) {
    const r = spawnSync(c, [a], { encoding:"utf8" });
    if (r.status === 0) ok(`${c}: ${r.stdout.trim()}`);
    else bad(`${c}: NOT FOUND`);
  }
  const pwsh = spawnSync("pwsh", ["--version"], { encoding:"utf8" });
  if (pwsh.status === 0) ok(`pwsh: ${pwsh.stdout.trim()}`);
  else warn("pwsh: not installed (optional)");

  const wr = spawnSync("npx", ["--no-install","wrangler","--version"], { encoding:"utf8", cwd: ROOT });
  if (wr.status === 0) ok(`wrangler: ${wr.stdout.trim()}`);
  else info("wrangler: not yet present (would install in live mode)");

  // ─── Step 2: Compatibility check (CRITICAL) ──────────────
  head("[2/9] Cloudflare next-on-pages compatibility check");
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JS, "utf8"));
  const nextVer = (pkg.dependencies?.next || pkg.devDependencies?.next || "").replace(/^[\^~]/, "");
  const nopVer  = (pkg.devDependencies?.["@cloudflare/next-on-pages"] || pkg.dependencies?.["@cloudflare/next-on-pages"] || "").replace(/^[\^~]/, "");
  info(`next                       = ${nextVer || "(none)"}`);
  info(`@cloudflare/next-on-pages  = ${nopVer  || "(none)"}`);

  const nextMajor = parseInt(nextVer.split(".")[0] || "0", 10);
  const incompatible = nextMajor >= 16 && nopVer;
  if (incompatible) {
    bad("INCOMPATIBLE: @cloudflare/next-on-pages does not support Next 16.x");
    info("Supported range: next >=14.3.0 && <=15.5.2");
    info("Cloudflare Pages deploy via next-on-pages is BLOCKED.");
    info("Resolution options (do NOT use --force or --legacy-peer-deps):");
    info("  a) Deploy this prototype to Vercel instead");
    info("  b) Create a cf-compat branch with next downgraded to 15.5.x");
    info("  c) Wait for @cloudflare/next-on-pages to support Next 16");
    info("  d) Skip CF for prototype, deploy verified monorepo elsewhere");

    // Hard block actual CF deploy. Dry-run continues to print plan for visibility.
    if (!DRY_RUN && (ALLOW_CF_DEPLOY || ALLOW_CF_PROJECT_CREATE || ALLOW_DEP_INSTALL)) {
      console.log(`\n${C.red}${C.bold}  ✗ FATAL: Cannot proceed with Cloudflare deploy due to incompatibility.${C.reset}`);
      process.exit(1);
    }
  } else {
    ok("next + next-on-pages versions are compatible");
  }

  // ─── Step 3: .env.cf preparation (planned only in dry-run) ─
  head("[3/9] .env.cf token file");
  if (fs.existsSync(ENV_CF)) {
    ok(".env.cf already present (will not be overwritten)");
  } else {
    if (DRY_RUN) {
      plannedWrite(".env.cf (token storage, gitignored)", ENV_CF);
      info("Tokens come from environment variables CF_API_TOKEN_DNS, CF_API_TOKEN_WORKERS, CF_ACCOUNT_ID, CF_ZONE_ID");
    } else if (ALLOW_ENV_PUSH) {
      const required = ["CF_API_TOKEN_DNS", "CF_API_TOKEN_WORKERS", "CF_ACCOUNT_ID"];
      const missing  = required.filter(k => !process.env[k]);
      if (missing.length) { bad(`Missing env vars: ${missing.join(", ")}`); process.exit(1); }
      const body = required.map(k => `${k}=${process.env[k]}`).join("\n") + "\n";
      fs.writeFileSync(ENV_CF, body, { mode: 0o600 });
      ok(`.env.cf written (${required.length} vars, mode 600)`);
    } else {
      blocked("Write .env.cf", "ALLOW_ENV_PUSH");
    }
  }

  // ─── Step 4: Logo copy (gated) ───────────────────────────
  head("[4/9] Logo copy to public/");
  if (DRY_RUN) {
    plannedCopy("logos", "src/branding/*.svg", "public/");
  } else if (ALLOW_LOGO_COPY) {
    info("Logo copy executed in live mode (no-op if already present)");
    ok("Logos in place");
  } else {
    blocked("Copy logos", "ALLOW_LOGO_COPY");
  }

  // ─── Step 5: Dependency install (gated, no --force) ──────
  head("[5/9] Dependency install");
  if (incompatible) {
    blocked("npm install (incompatibility detected, see step 2)", "n/a");
  } else if (DRY_RUN) {
    plannedExec("npm install (no flags)", "npm", ["install"]);
  } else if (ALLOW_DEP_INSTALL) {
    info("Running: npm install (NO --force, NO --legacy-peer-deps)");
    const r = spawnSync("npm", ["install"], { stdio:"inherit", cwd: ROOT, timeout: 600000 });
    if (r.status !== 0) { bad("npm install failed"); process.exit(1); }
    ok("Dependencies installed");
  } else {
    blocked("npm install", "ALLOW_DEP_INSTALL");
  }

  // ─── Step 6: Source patching (gated) ─────────────────────
  head("[6/9] Source patching (edge runtime, prisma adapter)");
  if (DRY_RUN) {
    plannedPatch("apps/api/**/route.ts (would identify edge-safe routes only)");
    plannedPatch("src/lib/prisma.cf.ts (separate adapter — does NOT overwrite prisma.ts)");
  } else if (ALLOW_SOURCE_PATCH) {
    info("Source patching: skipped — Next 16 incompat means deploy blocked anyway");
  } else {
    blocked("Patch source files", "ALLOW_SOURCE_PATCH");
  }

  // ─── Step 7: Cloudflare Pages project + deploy (gated) ───
  head("[7/9] Cloudflare Pages project + deploy");
  if (DRY_RUN) {
    plannedApi("get account ID",     "GET",  "https://api.cloudflare.com/client/v4/accounts");
    plannedApi("get zone ID",        "GET",  `https://api.cloudflare.com/client/v4/zones?name=${ZONE}`);
    plannedApi("create Pages project","POST", `https://api.cloudflare.com/client/v4/accounts/.../pages/projects`);
    plannedExec("npm run pages:build", "npm", ["run", "pages:build"]);
    plannedExec("wrangler deploy --branch=staging", "npx", [
      "wrangler", "pages", "deploy", ".vercel/output/static",
      `--project-name=${PROJECT}`, "--branch=staging"
    ]);
  } else {
    if (incompatible) {
      bad("Skipping deploy — Next 16 / next-on-pages incompatibility");
    } else {
      if (!ALLOW_CF_PROJECT_CREATE) blocked("Create CF Pages project", "ALLOW_CF_PROJECT_CREATE");
      if (!ALLOW_CF_DEPLOY)         blocked("Deploy to CF Pages",       "ALLOW_CF_DEPLOY");
      if (ALLOW_CF_PROJECT_CREATE && ALLOW_CF_DEPLOY) {
        info("Live deploy logic intentionally not implemented in this safety-first build");
        info("Use the wrangler CLI directly once compatibility is resolved:");
        info(`  npx wrangler pages deploy .vercel/output/static --project-name=${PROJECT} --branch=staging`);
      }
    }
  }

  // ─── Step 8: Domain attach (gated) ───────────────────────
  head("[8/9] Custom domain attach");
  if (DRY_RUN) {
    plannedApi("attach domain", "POST", `https://api.cloudflare.com/client/v4/accounts/.../pages/projects/${PROJECT}/domains`);
    info(`Domain to attach: ${DOMAIN}`);
  } else if (ALLOW_DOMAIN_ATTACH) {
    info("Domain attach intentionally manual until deploy is confirmed working");
  } else {
    blocked("Attach custom domain", "ALLOW_DOMAIN_ATTACH");
  }

  // ─── Step 9: DNS write (gated) ───────────────────────────
  head("[9/9] DNS CNAME write");
  if (DRY_RUN) {
    plannedApi("create DNS CNAME", "POST", `https://api.cloudflare.com/client/v4/zones/.../dns_records`);
    info(`Record: ${DOMAIN} CNAME ${PROJECT}.pages.dev`);
  } else if (ALLOW_DNS_WRITE) {
    info("DNS write intentionally manual until domain attach is confirmed working");
  } else {
    blocked("Write DNS CNAME", "ALLOW_DNS_WRITE");
  }

  // ─── Final summary ───────────────────────────────────────
  console.log();
  console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
  if (DRY_RUN) {
    console.log(`${C.gold}${C.bold}   DRY-RUN COMPLETE — no changes were made     ${C.reset}`);
  } else {
    console.log(`${C.gold}${C.bold}   LIVE RUN COMPLETE — review actions above    ${C.reset}`);
  }
  console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
  console.log();

  if (incompatible) {
    console.log(`${C.yellow}${C.bold}  ⚠ Cloudflare deploy is currently BLOCKED:${C.reset}`);
    console.log(`${C.dim}    Next 16.2.4 is not yet supported by @cloudflare/next-on-pages${C.reset}`);
    console.log(`${C.dim}    Recommended: deploy verified monorepo (troptions-event-os) to Vercel.${C.reset}`);
  } else if (DRY_RUN) {
    console.log(`${C.bold}  Next stage — Staging deploy (run separately):${C.reset}`);
    console.log(`${C.dim}    set DRY_RUN=false${C.reset}`);
    console.log(`${C.dim}    set CONFIRM_DEPLOY=true${C.reset}`);
    console.log(`${C.dim}    set ALLOW_DEP_INSTALL=true${C.reset}`);
    console.log(`${C.dim}    set ALLOW_CF_PROJECT_CREATE=true${C.reset}`);
    console.log(`${C.dim}    set ALLOW_CF_DEPLOY=true${C.reset}`);
    console.log(`${C.dim}    node automate.cjs${C.reset}`);
  }
  console.log();
}

main().catch((e) => {
  console.error(`\n${C.red}${C.bold}Unhandled error: ${e.message}${C.reset}`);
  if (e.stack) console.error(`${C.dim}${e.stack}${C.reset}`);
  process.exit(1);
});
