# scripts/preflight.ps1
# Pre-deploy sanity check. Run before every deploy.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/preflight.ps1
# Exit code: 0 = all PASS/WARN. Nonzero = one or more FAIL (local blockers).

[CmdletBinding()]
param()

$ErrorActionPreference = "SilentlyContinue"

$pass  = 0
$warn  = 0
$fail  = 0

function Pass($msg) {
    Write-Host "  [PASS] $msg" -ForegroundColor Green
    $script:pass++
}
function Warn($msg) {
    Write-Host "  [WARN] $msg" -ForegroundColor Yellow
    $script:warn++
}
function Fail($msg) {
    Write-Host "  [FAIL] $msg" -ForegroundColor Red
    $script:fail++
}

$root = Split-Path $PSScriptRoot -Parent
Push-Location $root

Write-Host ""
Write-Host "=== wwai deployment preflight ===" -ForegroundColor Cyan
Write-Host "  Root: $root"
Write-Host ""

# ── Runtime ──────────────────────────────────────────────────────────────────
Write-Host "── Runtime" -ForegroundColor Cyan

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $ver = (node --version 2>&1)
    Pass "node $ver"
} else {
    Fail "node not found. Install from https://nodejs.org"
}

$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if ($npmCmd) {
    $npmVer = (npm --version 2>&1)
    Pass "npm $npmVer"
} else {
    Fail "npm not found."
}

# ── Project files ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "── Project files" -ForegroundColor Cyan

if (Test-Path "package-lock.json") { Pass "package-lock.json exists" }
else { Fail "package-lock.json missing. Run: npm install" }

if (Test-Path "node_modules") { Pass "node_modules present" }
else { Fail "node_modules missing. Run: npm install" }

if (Test-Path "middleware.ts") { Pass "middleware.ts present (server-side demo gate)" }
else { Fail "middleware.ts missing — protected routes would be unguarded" }

if (Test-Path "src/app/demo-access/page.tsx") { Pass "src/app/demo-access/page.tsx present" }
else { Fail "src/app/demo-access/page.tsx missing" }

if (Test-Path "src/app/client-demo") { Pass "src/app/client-demo present (safe demo entry)" }
else { Warn "src/app/client-demo not found — confirm safe demo entry route exists" }

if (Test-Path ".env.example") { Pass ".env.example present" }
else { Warn ".env.example missing -- team has no reference for required vars" }

# ── Env documentation ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "── Env documentation" -ForegroundColor Cyan

if (Test-Path ".env.example") {
    $envEx = Get-Content ".env.example" -Raw
    if ($envEx -match "DEMO_ACCESS_CODE") { Pass "DEMO_ACCESS_CODE documented in .env.example" }
    else { Warn "DEMO_ACCESS_CODE not found in .env.example" }

    if ($envEx -match "NEXT_PUBLIC_MAP_PROVIDER") { Pass "NEXT_PUBLIC_MAP_PROVIDER documented in .env.example" }
    else { Warn "NEXT_PUBLIC_MAP_PROVIDER not found in .env.example" }

    if ($envEx -match "NEXT_PUBLIC_DEMO_ACCESS_CODE") {
        Warn "NEXT_PUBLIC_DEMO_ACCESS_CODE still in .env.example — ensure it is marked deprecated and not used"
    } else {
        Pass "NEXT_PUBLIC_DEMO_ACCESS_CODE absent from .env.example (good)"
    }
}

if (Test-Path ".env.local") {
    $envLocal = Get-Content ".env.local" -Raw
    if ($envLocal -match "NEXT_PUBLIC_DEMO_ACCESS_CODE\s*=") {
        Warn ".env.local has NEXT_PUBLIC_DEMO_ACCESS_CODE — this value ships in the browser bundle. Use DEMO_ACCESS_CODE instead."
    }
}

# ── Vercel link ───────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "── Vercel" -ForegroundColor Cyan

if (Test-Path ".vercel/project.json") {
    Pass "Vercel project linked (.vercel/project.json exists)"
} else {
    Warn "Vercel project not linked yet (.vercel/project.json missing)"
    Warn "deploy.ps1 will auto-link using VERCEL_PROJECT_NAME or default 'wwai'"
    Warn "To link manually: vercel login && vercel link --yes --project wwai"
}

# Validate VERCEL_PROJECT_NAME if set
if (-not [string]::IsNullOrWhiteSpace($env:VERCEL_PROJECT_NAME)) {
    $vProjName = $env:VERCEL_PROJECT_NAME
    if ($vProjName -match '\s') {
        Warn "VERCEL_PROJECT_NAME contains spaces ('$vProjName'). Vercel project names cannot have spaces."
    } elseif ($vProjName -cmatch '[A-Z]') {
        Warn "VERCEL_PROJECT_NAME contains uppercase ('$vProjName'). Vercel requires lowercase."
    } elseif ($vProjName -match '---') {
        Warn "VERCEL_PROJECT_NAME contains '---' ('$vProjName'). Vercel does not allow that sequence."
    } else {
        Pass "VERCEL_PROJECT_NAME='$vProjName' looks valid"
    }
}

# ── Git state ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "── Git state" -ForegroundColor Cyan

$gitRemote = git remote -v 2>&1
if ($gitRemote -match "origin") { Pass "git remote origin configured" }
else { Fail "no git remote. Run: git remote add origin https://github.com/FTHTrading/wwai.git" }

$branch = git branch --show-current 2>&1
if ($branch -eq "main") { Pass "on branch main" }
else { Warn "on branch '$branch' (deploy workflow targets main)" }

$dirty = git status --porcelain 2>&1
if ($dirty) {
    $count = ($dirty | Measure-Object -Line).Lines
    Warn "$count uncommitted change(s). Run 'git add -A && git commit' before deploying."
} else {
    Pass "working tree clean"
}

# ── npm scripts ───────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "── npm scripts" -ForegroundColor Cyan

$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$requiredScripts = @("lint", "build", "deploy", "deploy:preview")
foreach ($s in $requiredScripts) {
    if ($pkg.scripts.$s) { Pass "npm run $s defined" }
    else { Fail "npm run $s missing from package.json" }
}

# ── Workflow files ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "── GitHub Actions" -ForegroundColor Cyan

if (Test-Path ".github/workflows/ci.yml") { Pass ".github/workflows/ci.yml present" }
else { Warn "CI workflow not found" }

if (Test-Path ".github/workflows/deploy-vercel.yml") { Pass ".github/workflows/deploy-vercel.yml present" }
else { Warn "Vercel deploy workflow not found" }

# ── Remote secrets reminder (WARN only — can't check these locally) ───────────
Write-Host ""
Write-Host "── Remote secrets (cannot verify locally)" -ForegroundColor Cyan

Warn "Vercel: set DEMO_ACCESS_CODE in project env vars (server-only, never NEXT_PUBLIC_*)"
Warn "Vercel: set NEXT_PUBLIC_MAP_PROVIDER=maplibre in project env vars"
Warn "GitHub Actions: add VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID as repo secrets"
Warn "  GitHub → repo → Settings → Secrets and variables → Actions → New repository secret"
Warn "  After: push to main triggers auto-deploy"

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Preflight summary ===" -ForegroundColor Cyan
Write-Host "  PASS: $pass" -ForegroundColor Green
Write-Host "  WARN: $warn" -ForegroundColor Yellow
Write-Host "  FAIL: $fail" -ForegroundColor $(if ($fail -gt 0) { "Red" } else { "Gray" })
Write-Host ""

Pop-Location

if ($fail -gt 0) {
    Write-Host "Preflight FAILED. Fix the issues above before deploying." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Preflight passed. Ready to deploy." -ForegroundColor Green
    exit 0
}
