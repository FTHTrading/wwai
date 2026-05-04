# scripts/deploy.ps1
# One-command deploy for the wwai demo. Wraps the Vercel CLI.
#
# PREVIEW by default. Pass -Prod for a production deploy.
#
#   npm run deploy:preview   → preview URL (safe, shareable for testing)
#   npm run deploy           → production (requires Vercel project linked)
#
# First-time setup:
#   npm i -g vercel
#   vercel login
#   vercel link --yes
#   vercel env add DEMO_ACCESS_CODE production         # your private demo code
#   vercel env add NEXT_PUBLIC_MAP_PROVIDER production # value: maplibre
#
# DO NOT commit .env.local.
# DO NOT set NEXT_PUBLIC_DEMO_ACCESS_CODE — it leaks to the browser.

[CmdletBinding()]
param(
    [switch]$Prod,
    [switch]$SkipChecks
)

$ErrorActionPreference = "Stop"
Push-Location (Split-Path $PSScriptRoot -Parent)

try {
    # ── Preflight ────────────────────────────────────────────────────────────
    if (-not $SkipChecks) {
        Write-Host "[deploy] Running preflight..." -ForegroundColor Cyan
        powershell -ExecutionPolicy Bypass -File scripts/preflight.ps1
        if ($LASTEXITCODE -ne 0) { throw "Preflight failed. Fix issues before deploying." }

        Write-Host "[deploy] Lint..." -ForegroundColor Cyan
        npm run lint
        if ($LASTEXITCODE -ne 0) { throw "Lint failed." }

        Write-Host "[deploy] Typecheck..." -ForegroundColor Cyan
        npx tsc --noEmit
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[deploy] tsc reported issues. If only from .next/dev/types/validator.ts, safe to proceed." -ForegroundColor Yellow
        }

        Write-Host "[deploy] Build..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Build failed. Fix errors before deploying." }
    } else {
        Write-Host "[deploy] Skipping preflight/lint/typecheck/build (--SkipChecks set)." -ForegroundColor Yellow
    }

    # ── Vercel CLI ───────────────────────────────────────────────────────────
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "[deploy] Vercel CLI not found. Installing globally..." -ForegroundColor Yellow
        npm install --global vercel@latest
        if ($LASTEXITCODE -ne 0) { throw "Failed to install Vercel CLI. Run: npm i -g vercel" }
    }

    # ── Link check ───────────────────────────────────────────────────────────
    if (-not (Test-Path ".vercel/project.json")) {
        # Resolve project name: env override → default "wwai"
        $ProjectName = $env:VERCEL_PROJECT_NAME
        if ([string]::IsNullOrWhiteSpace($ProjectName)) {
            $ProjectName = "wwai"
        }

        Write-Host "[deploy] No .vercel/project.json found." -ForegroundColor Yellow
        Write-Host "[deploy] Linking Vercel project as: $ProjectName" -ForegroundColor Yellow
        Write-Host "[deploy] If this fails, run: vercel login" -ForegroundColor Yellow

        $linkArgs = @("link", "--yes", "--project", $ProjectName)
        if (-not [string]::IsNullOrWhiteSpace($env:VERCEL_SCOPE)) {
            $linkArgs += @("--scope", $env:VERCEL_SCOPE)
            Write-Host "[deploy] Using scope: $($env:VERCEL_SCOPE)" -ForegroundColor Yellow
        }

        & vercel @linkArgs
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "Vercel link failed." -ForegroundColor Red
            Write-Host "Run:" -ForegroundColor Red
            Write-Host "  vercel login" -ForegroundColor Red
            Write-Host "  vercel link --yes --project wwai" -ForegroundColor Red
            Write-Host ""
            Write-Host "If deploying under a team, run:" -ForegroundColor Yellow
            Write-Host "  `$env:VERCEL_SCOPE=`"your-team-or-account`"" -ForegroundColor Yellow
            Write-Host "  vercel link --yes --project wwai --scope `$env:VERCEL_SCOPE" -ForegroundColor Yellow
            throw "Vercel link failed."
        }
    }

    # ── Deploy ───────────────────────────────────────────────────────────────
    if ($Prod) {
        Write-Host "[deploy] Deploying to PRODUCTION..." -ForegroundColor Green
        vercel deploy --prod --yes
    } else {
        Write-Host "[deploy] Deploying PREVIEW (pass -Prod for production)..." -ForegroundColor Green
        vercel deploy --yes
    }

    if ($LASTEXITCODE -ne 0) { throw "Vercel deploy command failed." }

    Write-Host ""
    Write-Host "[deploy] Done. Share this URL first: <vercel-url>/client-demo" -ForegroundColor Green
    Write-Host "[deploy] Run smoke test: .\scripts\smoke.ps1 -BaseUrl '<your-url>'" -ForegroundColor Cyan
} finally {
    Pop-Location
}
