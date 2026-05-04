// install-pwsh.cjs — installs PowerShell 7 via winget, then runs verification
// Run: node install-pwsh.cjs
"use strict";
const { execSync, spawnSync } = require("child_process");
const fs   = require("fs");
const path = require("path");

const C = {
  reset: "\x1b[0m", gold: "\x1b[33m", cyan: "\x1b[36m",
  green: "\x1b[32m", red: "\x1b[31m", dim: "\x1b[2m", bold: "\x1b[1m",
};
const ok   = (m) => console.log(`${C.green}  ✓ ${m}${C.reset}`);
const fail = (m) => console.log(`${C.red}  ✗ ${m}${C.reset}`);
const info = (m) => console.log(`${C.dim}    ${m}${C.reset}`);
const head = (m) => console.log(`\n${C.cyan}${C.bold}${m}${C.reset}`);

console.log(`\n${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}`);
console.log(`${C.gold}${C.bold}   Installing PowerShell 7 (pwsh)               ${C.reset}`);
console.log(`${C.gold}${C.bold}═══════════════════════════════════════════════${C.reset}\n`);

// Check if already installed
head("Checking if pwsh is already installed...");
const existing = spawnSync("pwsh", ["--version"], { encoding: "utf8" });
if (existing.status === 0) {
  ok(`Already installed: ${existing.stdout.trim()}`);
  console.log("\nPowerShell 7 is ready. Run: node verify-and-dryrun.cjs");
  process.exit(0);
}
info("pwsh not found — proceeding with install");

// Method 1: winget (available on Windows 10 1709+ / Windows 11)
head("Method 1: winget install PowerShell...");
try {
  const wingetCheck = spawnSync("winget", ["--version"], { encoding: "utf8" });
  if (wingetCheck.status === 0) {
    ok(`winget found: ${wingetCheck.stdout.trim()}`);
    info("Running: winget install --id Microsoft.PowerShell --accept-source-agreements --accept-package-agreements");
    const result = spawnSync(
      "winget",
      ["install", "--id", "Microsoft.PowerShell",
       "--accept-source-agreements", "--accept-package-agreements", "--silent"],
      { encoding: "utf8", stdio: "inherit", timeout: 120000 }
    );
    if (result.status === 0) {
      ok("PowerShell 7 installed via winget!");
      afterInstall();
    } else {
      fail(`winget install failed (exit ${result.status}) — trying Method 2`);
      method2();
    }
  } else {
    info("winget not available — trying Method 2");
    method2();
  }
} catch (e) {
  info(`winget error: ${e.message} — trying Method 2`);
  method2();
}

function method2() {
  // Method 2: Download MSI directly via Node.js https
  head("Method 2: Download PowerShell 7 MSI installer...");
  const https = require("https");
  const os    = require("os");

  const MSI_URL = "https://github.com/PowerShell/PowerShell/releases/download/v7.4.2/PowerShell-7.4.2-win-x64.msi";
  const dest    = path.join(os.tmpdir(), "PowerShell-7.4.2-win-x64.msi");

  info(`Downloading: ${MSI_URL}`);
  info(`Saving to:   ${dest}`);

  const file = fs.createWriteStream(dest);

  function download(url, redirectCount = 0) {
    if (redirectCount > 5) { fail("Too many redirects"); process.exit(1); }
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        info(`Redirect → ${res.headers.location}`);
        download(res.headers.location, redirectCount + 1);
        return;
      }
      if (res.statusCode !== 200) {
        fail(`HTTP ${res.statusCode}`);
        method3();
        return;
      }
      const total = parseInt(res.headers["content-length"] || "0", 10);
      let received = 0;
      let lastPct = 0;
      res.on("data", (chunk) => {
        file.write(chunk);
        received += chunk.length;
        if (total > 0) {
          const pct = Math.floor(received / total * 100);
          if (pct >= lastPct + 10) { process.stdout.write(`\r    Downloading... ${pct}%`); lastPct = pct; }
        }
      });
      res.on("end", () => {
        file.end();
        console.log();
        ok(`Downloaded (${(received / 1024 / 1024).toFixed(1)} MB)`);
        info("Running MSI installer silently (requires admin)...");
        const msi = spawnSync(
          "msiexec",
          ["/i", dest, "/quiet", "/norestart", "ADD_EXPLORER_CONTEXT_MENU_OPENPOWERSHELL=1"],
          { encoding: "utf8", stdio: "inherit", timeout: 120000 }
        );
        if (msi.status === 0) {
          ok("MSI installed successfully!");
          afterInstall();
        } else {
          fail(`MSI failed (exit ${msi.status})`);
          method3();
        }
      });
      res.on("error", (e) => { fail(`Download error: ${e.message}`); method3(); });
    }).on("error", (e) => { fail(`Connection error: ${e.message}`); method3(); });
  }
  download(MSI_URL);
}

function method3() {
  // Method 3: iex via cmd (uses built-in PowerShell 5)
  head("Method 3: Bootstrap via Windows PowerShell 5 (built-in)...");
  const result = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-Command",
     "iex \"& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI -Quiet\""],
    { encoding: "utf8", stdio: "inherit", timeout: 120000 }
  );
  if (result.status === 0) {
    ok("Installed via PowerShell 5 bootstrap!");
    afterInstall();
  } else {
    fail("All install methods failed.");
    console.log(`
${C.gold}Manual install:${C.reset}
  1. Go to: https://aka.ms/powershell
  2. Download the Windows x64 MSI
  3. Run as Administrator
  4. Then run: node verify-and-dryrun.cjs
`);
    process.exit(1);
  }
}

function afterInstall() {
  console.log(`\n${C.cyan}${C.bold}Verifying installation...${C.reset}`);

  // Refresh PATH by finding common install locations
  const locations = [
    "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
    "C:\\Program Files (x86)\\PowerShell\\7\\pwsh.exe",
  ];
  let pwshPath = null;
  for (const loc of locations) {
    if (fs.existsSync(loc)) { pwshPath = loc; break; }
  }

  if (pwshPath) {
    const ver = spawnSync(pwshPath, ["--version"], { encoding: "utf8" });
    ok(`PowerShell 7 ready: ${ver.stdout.trim()}`);
    ok(`Path: ${pwshPath}`);
    console.log(`\n${C.green}${C.bold}✓ PowerShell 7 installed successfully!${C.reset}`);
    console.log(`\n${C.bold}Now run the verification:${C.reset}`);
    console.log(`${C.dim}  node verify-and-dryrun.cjs${C.reset}\n`);

    // Auto-run verify-and-dryrun if present
    const verifyScript = path.join(__dirname, "verify-and-dryrun.cjs");
    if (fs.existsSync(verifyScript)) {
      console.log(`${C.cyan}Auto-running verify-and-dryrun.cjs...${C.reset}\n`);
      spawnSync("node", [verifyScript], {
        cwd: __dirname, stdio: "inherit",
        env: { ...process.env, DRY_RUN: "true", APP_ENV: "staging" }
      });
    }
  } else {
    console.log(`\n${C.gold}NOTE: pwsh.exe not found in default locations.${C.reset}`);
    console.log("You may need to restart your terminal / open a new Command Prompt.");
    console.log("Then run: node verify-and-dryrun.cjs");
  }
}
