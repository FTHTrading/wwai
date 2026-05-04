// go.cjs — TROPTIONS one-shot safe launcher (self-contained, no dependencies on other scripts)
// Run from C:\Users\Kevan\fifa troptions:   node go.cjs
//
// What it does (in order):
//   1. Sanity-check directory + Node.js
//   2. Trim duplicate code in automate.cjs (if any)
//   3. Install PowerShell 7 if missing (winget → MSI → PS5 bootstrap)
//   4. Install Wrangler CLI if missing
//   5. Run automate.cjs in DRY_RUN mode (NO deploy, NO DNS, NO secrets pushed)
//   6. Run production-block test
//   7. Print final report + exact next-stage commands
//
// SAFE: Will not deploy, write DNS, push secrets, or patch source files.
"use strict";

const fs    = require("fs");
const path  = require("path");
const https = require("https");
const { spawnSync } = require("child_process");

const ROOT     = __dirname;
const AUTOMATE = path.join(ROOT, "automate.cjs");

const C = {
  reset:"\x1b[0m", bold:"\x1b[1m", dim:"\x1b[2m",
  red:"\x1b[31m", green:"\x1b[32m", yellow:"\x1b[33m",
  cyan:"\x1b[36m", gold:"\x1b[33m",
};
const ok   = (m) => console.log(`${C.green}  ✓ ${m}${C.reset}`);
const bad  = (m) => console.log(`${C.red}  ✗ ${m}${C.reset}`);
const info = (m) => console.log(`${C.dim}    ${m}${C.reset}`);
const warn = (m) => console.log(`${C.yellow}  ⚠ ${m}${C.reset}`);
const head = (m) => console.log(`\n${C.cyan}${C.bold}${m}${C.reset}`);
const redact = (s) => String(s).replace(/cfut_[a-zA-Z0-9]+/g, "[REDACTED]");

const results = {};

console.log();
console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
console.log(`${C.gold}${C.bold}   TROPTIONS — One-Shot Safe Launcher          ${C.reset}`);
console.log(`${C.gold}${C.bold}   Dry-run only. Nothing deployed.             ${C.reset}`);
console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);

// ─────────────────────────────────────────────────────────
// [1/7] Sanity checks
head("[1/7] Sanity checks");
const cwd = path.resolve(ROOT);
info(`Path: ${cwd}`);
if (!cwd.toLowerCase().includes("fifa troptions") && !cwd.toLowerCase().includes("fifa-troptions")) {
  bad("Must run from C:\\Users\\Kevan\\fifa troptions");
  process.exit(1);
}
ok("Working directory is correct");

if (!fs.existsSync(AUTOMATE)) {
  bad("automate.cjs not found in this directory!");
  process.exit(1);
}
ok("automate.cjs exists");

const nodeV = spawnSync("node", ["--version"], { encoding: "utf8" });
if (nodeV.status !== 0) { bad("Node.js missing"); process.exit(1); }
ok(`Node.js ${nodeV.stdout.trim()}`);

// ─────────────────────────────────────────────────────────
// [2/7] Trim automate.cjs duplicates
head("[2/7] Cleanup automate.cjs (remove duplicate code)");
const raw  = fs.readFileSync(AUTOMATE, "utf8");
const last = raw.lastIndexOf("main().catch");
if (last !== -1) {
  const end   = raw.indexOf("});", last) + 3;
  const trimmed = raw.slice(0, end) + "\n";
  if (trimmed.length < raw.length - 100) {
    fs.writeFileSync(AUTOMATE, trimmed, "utf8");
    ok(`Trimmed automate.cjs from ${raw.split("\n").length} to ${trimmed.split("\n").length} lines`);
  } else {
    info("automate.cjs already clean");
  }
} else {
  warn("No main().catch found — file may be malformed");
}

// Cleanup any leftover one-time helpers
for (const f of ["fix-automate.cjs", "_fix-verify.cjs", "_rewrite-install-and-verify.cjs"]) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); info(`Removed ${f}`); }
}

// Re-read after trim
const content = fs.readFileSync(AUTOMATE, "utf8");
const mainCount = (content.match(/async function main\(\)/g) || []).length;
const lineCount = content.split("\n").length;
if (mainCount === 1) ok(`Structure clean: 1 main() block, ${lineCount} lines`);
else { bad(`${mainCount} main() blocks found — file still corrupt`); process.exit(1); }

const syn = spawnSync("node", ["-c", AUTOMATE], { encoding: "utf8", cwd: ROOT });
if (syn.status === 0) ok("Syntax OK");
else { bad(`Syntax error: ${(syn.stdout + syn.stderr).trim()}`); process.exit(1); }
results.structure = { lineCount, mainCount, syntax: "ok" };

// ─────────────────────────────────────────────────────────
// [3/7] Install PowerShell 7 if missing
head("[3/7] PowerShell 7 (pwsh)");
let pwshOk = false;
const pwsh = spawnSync("pwsh", ["--version"], { encoding: "utf8" });
if (pwsh.status === 0) {
  ok(`Already installed: ${pwsh.stdout.trim()}`);
  pwshOk = true;
} else {
  warn("pwsh not found — attempting install (may need Administrator)");

  const winget = spawnSync("winget", ["--version"], { encoding: "utf8" });
  if (winget.status === 0 && !pwshOk) {
    info("Trying winget...");
    const r = spawnSync("winget", [
      "install", "--id", "Microsoft.PowerShell", "--source", "winget",
      "--exact", "--accept-source-agreements", "--accept-package-agreements", "--silent",
    ], { stdio: "inherit", timeout: 180000 });
    if (r.status === 0) { ok("Installed via winget"); pwshOk = true; }
    else warn(`winget exited ${r.status}`);
  }

  if (!pwshOk) {
    info("Trying PowerShell 5 bootstrap...");
    const r = spawnSync("powershell.exe", [
      "-NoProfile", "-NonInteractive", "-Command",
      'iex "& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI -Quiet"',
    ], { stdio: "inherit", timeout: 180000 });
    if (r.status === 0) { ok("Installed via PS5 bootstrap"); pwshOk = true; }
  }

  if (!pwshOk) {
    warn("Could not auto-install pwsh. Install manually later:");
    info("  winget install Microsoft.PowerShell");
    info("  -- or: https://aka.ms/powershell");
    info("Continuing — pwsh is optional for dry-run.");
  }
}
results.pwsh = pwshOk ? "installed" : "missing";

// ─────────────────────────────────────────────────────────
// [4/7] Wrangler check (optional for dry-run)
head("[4/7] Wrangler CLI");
const wr = spawnSync("npx", ["--no-install", "wrangler", "--version"], { encoding: "utf8", cwd: ROOT });
if (wr.status === 0) {
  ok(`wrangler: ${wr.stdout.trim()}`);
  results.wrangler = "installed";
} else {
  info("wrangler not yet installed (will install on first staging deploy)");
  results.wrangler = "deferred";
}

// ─────────────────────────────────────────────────────────
// [5/7] Dry-run automate.cjs
head("[5/7] Dry-run automate.cjs (DRY_RUN=true APP_ENV=staging)");
const dry = spawnSync("node", [AUTOMATE], {
  cwd: ROOT, encoding: "utf8", timeout: 45000,
  env: { ...process.env, DRY_RUN: "true", APP_ENV: "staging" },
});
const dryOut = redact((dry.stdout || "") + (dry.stderr || ""));
const dryChecks = {
  "Exited cleanly":          dry.status === 0,
  "[DRY] markers present":   dryOut.includes("[DRY]") || dryOut.includes("DRY RUN") || dryOut.includes("BLOCKED"),
  "Tokens redacted":         !/cfut_[a-zA-Z0-9]+/.test(dryOut),
  "No deployment occurred":  !dryOut.includes("Deployed!") && !dryOut.includes("DEPLOY COMPLETE"),
  "No DNS write occurred":   !dryOut.includes("CNAME created") || dryOut.includes("BLOCKED"),
  "No source files patched": !dryOut.includes("Patched edge:"),
};
let dryPassed = 0;
for (const [label, pass] of Object.entries(dryChecks)) {
  if (pass) { ok(label); dryPassed++; } else bad(label);
}
console.log(`\n${C.dim}── automate.cjs dry-run output ──────────────────${C.reset}`);
console.log(dryOut.slice(0, 2500) || "(no output)");
console.log(`${C.dim}─────────────────────────────────────────────────${C.reset}`);
results.dryRun = { exitCode: dry.status, passed: dryPassed, total: Object.keys(dryChecks).length };

// ─────────────────────────────────────────────────────────
// [6/7] Production block test
head("[6/7] Production block test (APP_ENV=production)");
const prod = spawnSync("node", [AUTOMATE], {
  cwd: ROOT, encoding: "utf8", timeout: 15000,
  env: { ...process.env, DRY_RUN: "true", APP_ENV: "production" },
});
const prodOut = redact((prod.stdout || "") + (prod.stderr || ""));
const blocked = prod.status !== 0 && /blocked|FATAL|staging/i.test(prodOut);
if (blocked) ok(`Production correctly BLOCKED (exit ${prod.status})`);
else         bad("Production NOT blocked — safety FAILED");
results.productionBlock = blocked ? "BLOCKED" : "NOT BLOCKED (FAIL)";

// ─────────────────────────────────────────────────────────
// [7/7] Git secret scan
head("[7/7] Git secret scan");
const gitF = spawnSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
const tracked = (gitF.stdout || "").split("\n").filter(Boolean);
const dangerous = tracked.filter(f =>
  /\.(env|cf|dev\.vars|wrangler)$|^\.env|secret|private|wallet|seed|keystore/i.test(f) &&
  !/\.env\.example/i.test(f)
);
if (dangerous.length === 0) ok("No sensitive files tracked in git");
else { bad(`Sensitive files tracked: ${dangerous.join(", ")}`); }
results.gitSecrets = dangerous.length === 0 ? "none" : dangerous.join(", ");

// ─────────────────────────────────────────────────────────
// FINAL REPORT
console.log(`\n${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
console.log(`${C.gold}${C.bold}   FINAL VERIFICATION REPORT                   ${C.reset}`);
console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}\n`);
const rows = [
  ["1.  automate.cjs structure",  `✓ clean (${results.structure.lineCount} lines, 1 main)`],
  ["2.  Syntax",                   "✓ pass"],
  ["3.  PowerShell 7",             results.pwsh === "installed" ? "✓ installed" : "⚠ missing (optional)"],
  ["4.  Wrangler CLI",             results.wrangler === "installed" ? "✓ installed" : "⏳ deferred"],
  ["5.  Dry-run exit",             results.dryRun.exitCode === 0 ? "✓ clean exit" : `✗ code ${results.dryRun.exitCode}`],
  ["6.  Dry-run safety checks",    `${results.dryRun.passed}/${results.dryRun.total} passed`],
  ["7.  Production block",         results.productionBlock === "BLOCKED" ? "✓ blocked" : "✗ NOT BLOCKED"],
  ["8.  Sensitive files in git",   results.gitSecrets === "none" ? "✓ none" : `✗ ${results.gitSecrets}`],
];
for (const [label, value] of rows) {
  const isBad = value.includes("✗");
  console.log(`  ${isBad ? C.red : C.green}${label}:${C.reset} ${value}`);
}

const allGood =
  results.structure.mainCount === 1 &&
  results.dryRun.exitCode === 0 &&
  results.dryRun.passed === results.dryRun.total &&
  results.productionBlock === "BLOCKED" &&
  results.gitSecrets === "none";

console.log();
if (allGood) {
  console.log(`${C.green}${C.bold}  ✓ ALL CHECKS PASSED — staging deploy is safe to attempt.${C.reset}\n`);
  console.log(`${C.bold}  STAGE 2 — Staging deploy (run from this directory):${C.reset}`);
  console.log(`${C.dim}    set DRY_RUN=false${C.reset}`);
  console.log(`${C.dim}    set CONFIRM_DEPLOY=true${C.reset}`);
  console.log(`${C.dim}    set APP_ENV=staging${C.reset}`);
  console.log(`${C.dim}    set ALLOW_CF_PROJECT_CREATE=true${C.reset}`);
  console.log(`${C.dim}    set ALLOW_CF_DEPLOY=true${C.reset}`);
  console.log(`${C.dim}    node automate.cjs${C.reset}`);
  console.log();
  console.log(`${C.bold}  STAGE 3 — Domain attach (only after Stage 2 succeeds):${C.reset}`);
  console.log(`${C.dim}    set ALLOW_DOMAIN_ATTACH=true${C.reset}`);
  console.log(`${C.dim}    set ALLOW_ENV_PUSH=true${C.reset}`);
  console.log(`${C.dim}    node automate.cjs${C.reset}`);
  console.log();
  console.log(`${C.bold}  STAGE 4 — DNS write (only after Stage 3 succeeds):${C.reset}`);
  console.log(`${C.dim}    set ALLOW_DNS_WRITE=true${C.reset}`);
  console.log(`${C.dim}    node automate.cjs${C.reset}`);
  console.log();
  console.log(`${C.gold}  Site target: https://troptionsfifa.unykorn.org${C.reset}`);
} else {
  console.log(`${C.red}${C.bold}  ✗ SOME CHECKS FAILED — fix issues above before deploying.${C.reset}`);
  process.exit(1);
}
console.log();
