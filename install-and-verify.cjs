// install-and-verify.cjs — COMMAND 18C: installs pwsh if missing, runs full safe verification
// Run: node install-and-verify.cjs
// SAFE: installs tools only. Does NOT deploy, write DNS, patch files, or push secrets.
"use strict";

const fs   = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const C = {
  reset:"\x1b[0m",gold:"\x1b[33m",cyan:"\x1b[36m",
  green:"\x1b[32m",red:"\x1b[31m",dim:"\x1b[2m",bold:"\x1b[1m",yellow:"\x1b[33m",
};
const pass = m => console.log(C.green+"  \u2713 "+m+C.reset);
const fail = m => console.log(C.red+"  \u2717 "+m+C.reset);
const info = m => console.log(C.dim+"    "+m+C.reset);
const warn = m => console.log(C.yellow+"  \u26a0 "+m+C.reset);
const head = m => console.log("\n"+C.cyan+C.bold+m+C.reset);

console.log("\n"+C.gold+C.bold+"==============================================="+C.reset);
console.log(C.gold+C.bold+"   COMMAND 18C - Install + Verify              "+C.reset);
console.log(C.gold+C.bold+"   No deploy. No DNS. No secrets exposed.      "+C.reset);
console.log(C.gold+C.bold+"==============================================="+C.reset);

// STEP 1: Check / install pwsh
head("[1/3] PowerShell 7 (pwsh) check");
const pwshCheck = spawnSync("pwsh", ["--version"], { encoding:"utf8" });
if (pwshCheck.status === 0) {
  pass("Already installed: " + (pwshCheck.stdout||"").trim());
} else {
  warn("pwsh not found - attempting install (may require Admin)");

  let installed = false;

  // Try winget first
  const wg = spawnSync("winget", ["--version"], { encoding:"utf8" });
  if (wg.status === 0) {
    info("winget found: " + (wg.stdout||"").trim());
    const r = spawnSync("winget", [
      "install","--id","Microsoft.PowerShell",
      "--accept-source-agreements","--accept-package-agreements","--silent",
    ], { stdio:"inherit", timeout:120000 });
    if (r.status === 0) { pass("Installed via winget"); installed = true; }
    else warn("winget failed (exit "+r.status+") - trying PS5 bootstrap");
  }

  if (!installed) {
    // Fallback: PowerShell 5 bootstrap
    info("Trying: powershell.exe iex install-powershell.ps1");
    const r = spawnSync("powershell.exe", [
      "-NoProfile","-NonInteractive","-Command",
      "iex \"& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI -Quiet\"",
    ], { stdio:"inherit", timeout:120000 });
    if (r.status === 0) { pass("Installed via PS5 bootstrap"); installed = true; }
    else {
      fail("All automated install methods failed");
      info("Manual install: https://aka.ms/powershell (download x64 MSI, run as Admin)");
      info("Then re-run: node install-and-verify.cjs");
      process.exit(1);
    }
  }
}

// STEP 2: Tool availability
head("[2/3] Tool availability");
const tools = [
  ["node","--version"],["npm","--version"],["git","--version"],
  ["npx","--version"],["wrangler","--version"],
];
for (const [cmd, arg] of tools) {
  const r = spawnSync(cmd, [arg], { encoding:"utf8", timeout:5000 });
  if (r.status === 0) pass(cmd+": "+(r.stdout||"").trim().split("\n")[0]);
  else if (cmd === "wrangler") warn("wrangler: not installed (npm install -g wrangler)");
  else info(cmd+": not found");
}

// STEP 3: Run verification
head("[3/3] Running full verification (dry-run only)");
const verifyScript = path.join(ROOT, "verify-and-dryrun.cjs");
if (!fs.existsSync(verifyScript)) {
  fail("verify-and-dryrun.cjs not found");
  process.exit(1);
}
info("Spawning verify-and-dryrun.cjs with DRY_RUN=true APP_ENV=staging\n");
const r = spawnSync("node", [verifyScript], {
  cwd: ROOT, stdio:"inherit",
  env: { ...process.env, DRY_RUN:"true", APP_ENV:"staging" },
  timeout: 60000,
});
process.exit(r.status || 0);
