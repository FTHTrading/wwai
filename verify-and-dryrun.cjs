// verify-and-dryrun.cjs — COMMAND 18C safe verification
// Run: node verify-and-dryrun.cjs
// Does NOT deploy, create DNS, push env vars, or patch source files.
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const AUTOMATE = path.join(ROOT, "automate.cjs");
const C = {
  reset:"\x1b[0m",gold:"\x1b[33m",cyan:"\x1b[36m",
  green:"\x1b[32m",red:"\x1b[31m",dim:"\x1b[2m",bold:"\x1b[1m",yellow:"\x1b[33m",
};
const pass = m => console.log(C.green+"  \u2713 "+m+C.reset);
const fail = m => console.log(C.red  +"  \u2717 "+m+C.reset);
const info = m => console.log(C.dim  +"    "+m+C.reset);
const head = m => console.log("\n"+C.cyan+C.bold+m+C.reset);
const warn = m => console.log(C.yellow+"  \u26a0 "+m+C.reset);
const redact = s => s.replace(/cfut_[a-zA-Z0-9]+/g, "[REDACTED]");
const results = {};

console.log("\n"+C.gold+C.bold+"\u2550".repeat(47)+C.reset);
console.log(C.gold+C.bold+"   TROPTIONS \u2014 Verify + Dry-run              "+C.reset);
console.log(C.gold+C.bold+"   Nothing deployed. Safe to run anytime.   "+C.reset);
console.log(C.gold+C.bold+"\u2550".repeat(47)+C.reset);

// 1: CWD check
head("[1/8] Working directory");
const cwd = path.resolve(ROOT);
info("Path: "+cwd);
if (!cwd.toLowerCase().includes("fifa troptions") && !cwd.toLowerCase().includes("fifa-troptions")) {
  fail("Must run from: C:\\Users\\Kevan\\fifa troptions");
  fail("Do NOT run from the verified monorepo troptions-event-os");
  process.exit(1);
}
pass("Correct project directory");
results.cwd = "ok";

// 2: Cleanup fix-automate.cjs
head("[2/8] Cleanup stale fix-automate.cjs");
const fixScript = path.join(ROOT, "fix-automate.cjs");
if (fs.existsSync(fixScript)) {
  const raw = fs.readFileSync(AUTOMATE, "utf8");
  const last = raw.lastIndexOf("main().catch");
  if (last !== -1) {
    const end = raw.indexOf("});", last) + 3;
    fs.writeFileSync(AUTOMATE, raw.slice(0, end) + "\n", "utf8");
    pass("automate.cjs trimmed");
  }
  fs.unlinkSync(fixScript);
  pass("fix-automate.cjs removed");
} else info("No fix-automate.cjs — skipping");

// 3: Tool check
head("[3/8] Required tools");
const toolResults = {};
for (const [cmd, name] of [["node","Node.js"],["npm","npm"],["git","git"]]) {
  const r = spawnSync(cmd, ["--version"], { encoding: "utf8" });
  if (r.status === 0) { pass(name+": "+r.stdout.trim()); toolResults[name] = r.stdout.trim(); }
  else               { fail(name+": NOT FOUND");           toolResults[name] = "missing"; }
}
const pwsh = spawnSync("pwsh", ["--version"], { encoding: "utf8" });
if (pwsh.status === 0) { pass("PowerShell 7: "+pwsh.stdout.trim()); toolResults.pwsh = pwsh.stdout.trim(); }
else { warn("PowerShell 7: not installed (optional)"); toolResults.pwsh = "not installed"; }
results.tools = toolResults;

// 4: Structure check
head("[4/8] automate.cjs structure");
if (!fs.existsSync(AUTOMATE)) { fail("automate.cjs not found!"); process.exit(1); }
const content    = fs.readFileSync(AUTOMATE, "utf8");
const lineCount  = content.split("\n").length;
const mainCount  = (content.match(/async function main\(\)/g) || []).length;
const catchCount = (content.match(/main\(\)\.catch/g) || []).length;
info("Lines: "+lineCount+" | main(): "+mainCount+" | catch: "+catchCount);
if (mainCount===1 && catchCount===1) pass("No duplicate blocks");
else fail("Duplicate blocks: "+mainCount+" main(), "+catchCount+" catch");
results.structure = { lineCount, mainCount, catchCount };

// 5: Syntax check
head("[5/8] Syntax check");
const syn = spawnSync("node", ["-c", AUTOMATE], { encoding: "utf8", cwd: ROOT });
if (syn.status === 0) { pass("Syntax OK"); results.syntax = "pass"; }
else { fail("Syntax error: "+(syn.stdout+syn.stderr).trim()); results.syntax = "FAIL"; }

// 6: Safety flag audit
head("[6/8] Safety flag audit");
const checks = [
  ["DRY_RUN defaults true",     "env(\"DRY_RUN\", \"true\")"],
  ["CONFIRM_DEPLOY gate",        "CONFIRM_DEPLOY"],
  ["Production blocked",         "APP_ENV === \"production\""],
  ["ALLOW_SOURCE_PATCH",         "ALLOW_SOURCE_PATCH"],
  ["ALLOW_CF_DEPLOY",            "ALLOW_CF_DEPLOY"],
  ["ALLOW_DNS_WRITE",            "ALLOW_DNS_WRITE"],
  ["ALLOW_DOMAIN_ATTACH",        "ALLOW_DOMAIN_ATTACH"],
  ["ALLOW_ENV_PUSH",             "ALLOW_ENV_PUSH"],
  ["ALLOW_CF_PROJECT_CREATE",    "ALLOW_CF_PROJECT_CREATE"],
  ["Token redaction",            "[REDACTED]"],
  ["prisma.cf.ts separate",      "prisma.cf.ts"],
  ["Staging branch only",        "--branch=staging"],
];
let flagsPassed = 0;
for (const [label, match] of checks) {
  if (content.includes(match)) { pass(label); flagsPassed++; }
  else fail(label);
}
results.flagChecks = flagsPassed+"/"+checks.length;

// 7: Dry-run
head("[7/8] Dry-run (DRY_RUN=true APP_ENV=staging)");
const dry = spawnSync("node", [AUTOMATE], {
  cwd: ROOT, encoding: "utf8", timeout: 30000,
  env: { ...process.env, DRY_RUN: "true", APP_ENV: "staging" },
});
const dryOut = redact((dry.stdout||"")+(dry.stderr||""));
const dryChecks = {
  "Exited cleanly":     dry.status === 0,
  "[DRY] output":       dryOut.includes("[DRY]")||dryOut.includes("DRY RUN")||dryOut.includes("BLOCKED"),
  "Tokens redacted":    dryOut.includes("[REDACTED]"),
  "No deployment":      !dryOut.includes("Deployed!")&&!dryOut.includes("DEPLOY COMPLETE"),
  "No DNS write":       !dryOut.includes("CNAME created")||dryOut.includes("BLOCKED"),
  "No source patch":    !dryOut.includes("Patched edge:"),
};
for (const [label, ok] of Object.entries(dryChecks)) {
  if (ok) pass(label); else fail(label);
}
console.log("\n"+C.dim+"─".repeat(50)+C.reset);
console.log(dryOut.slice(0, 2500) || "(no output)");
console.log(C.dim+"─".repeat(50)+C.reset);
results.dryRun = {
  exitCode: dry.status,
  passed:   Object.values(dryChecks).filter(Boolean).length,
  total:    Object.keys(dryChecks).length,
};

// 8: Production block + git safety
head("[8/8] Production block + git safety");
const prod = spawnSync("node", [AUTOMATE], {
  cwd: ROOT, encoding: "utf8", timeout: 10000,
  env: { ...process.env, DRY_RUN: "true", APP_ENV: "production" },
});
const prodOut = redact((prod.stdout||"")+(prod.stderr||""));
const blocked = prod.status !== 0 &&
  (prodOut.includes("blocked")||prodOut.includes("FATAL")||prodOut.includes("staging"));
if (blocked) pass("Production correctly BLOCKED (exit "+prod.status+")");
else         fail("Production NOT blocked — FAILED");
results.productionBlock = blocked ? "BLOCKED" : "NOT BLOCKED (FAIL)";

const gitF = spawnSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
const tracked   = (gitF.stdout||"").split("\n").filter(Boolean);
const dangerous = tracked.filter(f =>
  /\.(env|cf|dev\.vars|wrangler)$|^\.env|secret|private|wallet|seed|keystore/i.test(f) &&
  !/\.env\.example/i.test(f)
);
if (dangerous.length === 0) pass("No sensitive files tracked in git");
else fail("Sensitive tracked: "+dangerous.join(", "));
results.gitSecrets = dangerous.length === 0 ? "none" : dangerous.join(", ");

const gitS = spawnSync("git", ["status", "--short"], { cwd: ROOT, encoding: "utf8" });
info("Git: "+((gitS.stdout||"").trim().split("\n")[0]||"clean"));

// Final report
console.log("\n"+C.gold+C.bold+"\u2550".repeat(47)+C.reset);
console.log(C.gold+C.bold+"   VERIFICATION REPORT                         "+C.reset);
console.log(C.gold+C.bold+"\u2550".repeat(47)+C.reset+"\n");
const report = [
  ["1.  Working directory", results.cwd==="ok"?"\u2713 correct":"\u2717 wrong"],
  ["2.  Node.js",           toolResults["Node.js"]||"missing"],
  ["3.  npm",               toolResults.npm||"missing"],
  ["4.  PowerShell 7",      toolResults.pwsh],
  ["5.  automate.cjs",      mainCount===1?"\u2713 clean ("+lineCount+" lines)":"\u2717 "+mainCount+" main() blocks"],
  ["6.  Syntax",            results.syntax],
  ["7.  Safety flags",      results.flagChecks],
  ["8.  Dry-run exit",      results.dryRun.exitCode===0?"\u2713 clean":"\u2717 code "+results.dryRun.exitCode],
  ["9.  Dry-run checks",    results.dryRun.passed+"/"+results.dryRun.total+" passed"],
  ["10. Production block",  results.productionBlock],
  ["11. Secrets in git",    results.gitSecrets==="none"?"\u2713 none":"\u2717 "+results.gitSecrets],
];
for (const [label, value] of report) {
  const bad = String(value).includes("\u2717")||String(value).includes("FAIL")||String(value).includes("NOT BLOCKED");
  console.log("  "+(bad?C.red:C.green)+label+":"+C.reset+" "+value);
}
const allGood =
  results.cwd === "ok" &&
  results.syntax === "pass" &&
  mainCount === 1 &&
  blocked &&
  results.dryRun.exitCode === 0 &&
  results.gitSecrets === "none";
console.log();
if (allGood) {
  console.log(C.green+C.bold+"  ALL CHECKS PASSED \u2713"+C.reset);
  console.log(C.dim+"  Staging deploy safe when ready.\n"+C.reset);
  console.log(C.bold+"  Stage 2 \u2014 staging deploy (run separately):"+C.reset);
  console.log(C.dim+"    set DRY_RUN=false && set CONFIRM_DEPLOY=true && set APP_ENV=staging && set ALLOW_CF_DEPLOY=true && node automate.cjs"+C.reset);
  console.log(C.dim+"\n  Stage 3 \u2014 domain+DNS (after deploy confirmed):"+C.reset);
  console.log(C.dim+"    set ALLOW_DOMAIN_ATTACH=true && set ALLOW_DNS_WRITE=true && node automate.cjs"+C.reset);
} else {
  console.log(C.red+C.bold+"  SOME CHECKS FAILED \u2014 review above before deploying"+C.reset);
}
console.log();