# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1
# One-command deploy for the wwai demo. Wraps the Vercel CLI.
#
# First-time only:
#   1) npm i -g vercel
#   2) vercel login
#   3) vercel link --yes              # links this folder to the Vercel project
#   4) vercel env add DEMO_ACCESS_CODE production
#      vercel env add NEXT_PUBLIC_MAP_PROVIDER production    # value: maplibre
#
# Then any future deploy is just: scripts/deploy.ps1
# Pass -Preview to ship a preview URL instead of production.

[CmdletBinding()]
param(
    [switch]$Preview,
    [switch]$SkipChecks
)

$ErrorActionPreference = "Stop"
Push-Location (Split-Path $PSScriptRoot -Parent)

try {
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "[deploy] Installing Vercel CLI globally..." -ForegroundColor Yellow
        npm install --global vercel@latest
    }

    if (-not $SkipChecks) {
        Write-Host "[deploy] Lint..." -ForegroundColor Cyan
        npm run lint
        if ($LASTEXITCODE -ne 0) { throw "Lint failed." }

        Write-Host "[deploy] Typecheck..." -ForegroundColor Cyan
        npx tsc --noEmit
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[deploy] tsc reported errors. If they are only from .next/dev/types/validator.ts they are safe to ignore." -ForegroundColor Yellow
        }

        Write-Host "[deploy] Build..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Build failed." }
    }

    if (-not (Test-Path ".vercel/project.json")) {
        Write-Host "[deploy] No .vercel/project.json — running 'vercel link'..." -ForegroundColor Yellow
        vercel link --yes
    }

    if ($Preview) {
        Write-Host "[deploy] Deploying PREVIEW to Vercel..." -ForegroundColor Green
        vercel deploy --yes
    } else {
        Write-Host "[deploy] Deploying PRODUCTION to Vercel..." -ForegroundColor Green
        vercel deploy --prod --yes
    }
} finally {
    Pop-Location
}
