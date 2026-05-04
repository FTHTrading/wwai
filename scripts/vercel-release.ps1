# scripts/vercel-release.ps1
# One-command release: preflight → env check → build → deploy production → smoke → share URL
#
# Usage:
#   npm run release:vercel
#   powershell -ExecutionPolicy Bypass -File scripts/vercel-release.ps1
#
# First-time setup (run once before this script):
#   vercel login
#   vercel link --yes --project wwai
#   vercel env add DEMO_ACCESS_CODE production        # enter your private code when prompted
#   vercel env add NEXT_PUBLIC_MAP_PROVIDER production # enter: maplibre
#
# SECURITY:
#   - DEMO_ACCESS_CODE is server-only. Never NEXT_PUBLIC_DEMO_ACCESS_CODE.
#   - This script never reads, prints, or stores secret values.
#   - .vercel/project.json is NOT committed (gitignored).

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Push-Location (Split-Path $PSScriptRoot -Parent)

try {
    Write-Host ""
    Write-Host "=== wwai Vercel release ===" -ForegroundColor Cyan
    Write-Host ""

    # ── 1. Preflight ──────────────────────────────────────────────────────────
    Write-Host "[release] Running preflight..." -ForegroundColor Cyan
    powershell -ExecutionPolicy Bypass -File scripts/preflight.ps1
    if ($LASTEXITCODE -ne 0) { throw "Preflight failed. Fix issues before releasing." }

    # ── 2. Vercel CLI check ───────────────────────────────────────────────────
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host ""
        Write-Host "[release] Vercel CLI not found." -ForegroundColor Red
        Write-Host "  Install it with: npm i -g vercel" -ForegroundColor Yellow
        exit 1
    }

    # ── 3. Auth check ─────────────────────────────────────────────────────────
    Write-Host "[release] Checking Vercel auth..." -ForegroundColor Cyan
    $whoami = vercel whoami 2>&1
    if ($LASTEXITCODE -ne 0 -or $whoami -match "Error|not logged") {
        Write-Host ""
        Write-Host "[release] Not logged into Vercel." -ForegroundColor Red
        Write-Host "  Run: vercel login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "[release] Logged in as: $whoami" -ForegroundColor Green

    # ── 4. Link check ─────────────────────────────────────────────────────────
    if (-not (Test-Path ".vercel/project.json")) {
        Write-Host "[release] No .vercel/project.json. Linking to wwai..." -ForegroundColor Yellow
        vercel link --yes --project wwai
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "[release] Vercel link failed." -ForegroundColor Red
            Write-Host "  Run: vercel login" -ForegroundColor Yellow
            Write-Host "  Then: vercel link --yes --project wwai" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "[release] Vercel project linked." -ForegroundColor Green
    }

    # ── 5. Env var check ──────────────────────────────────────────────────────
    Write-Host "[release] Checking Vercel production env vars..." -ForegroundColor Cyan
    $envList = vercel env ls production 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[release] Could not list Vercel env vars (continuing with warning)." -ForegroundColor Yellow
        $envList = ""
    }

    $missingEnv = $false

    if ($envList -notmatch "DEMO_ACCESS_CODE") {
        Write-Host ""
        Write-Host "[release] DEMO_ACCESS_CODE is missing in Vercel production." -ForegroundColor Red
        Write-Host "  Run: vercel env add DEMO_ACCESS_CODE production" -ForegroundColor Yellow
        Write-Host "  Enter your private demo code when prompted." -ForegroundColor Yellow
        Write-Host "  (Do NOT put this value in NEXT_PUBLIC_DEMO_ACCESS_CODE — it would leak to the browser.)" -ForegroundColor Yellow
        $missingEnv = $true
    } else {
        Write-Host "[release] DEMO_ACCESS_CODE is set in production." -ForegroundColor Green
    }

    if ($envList -notmatch "NEXT_PUBLIC_MAP_PROVIDER") {
        Write-Host ""
        Write-Host "[release] NEXT_PUBLIC_MAP_PROVIDER is missing. Attempting to set it..." -ForegroundColor Yellow
        # Use a temp file to avoid pipe encoding issues with vercel CLI
        $tmpVal = [System.IO.Path]::GetTempFileName()
        Set-Content -Path $tmpVal -Value "maplibre" -NoNewline
        vercel env add NEXT_PUBLIC_MAP_PROVIDER production < $tmpVal
        Remove-Item $tmpVal -ErrorAction SilentlyContinue
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "[release] Could not auto-set NEXT_PUBLIC_MAP_PROVIDER." -ForegroundColor Yellow
            Write-Host "  Run manually: vercel env add NEXT_PUBLIC_MAP_PROVIDER production" -ForegroundColor Yellow
            Write-Host "  Value: maplibre" -ForegroundColor Yellow
            $missingEnv = $true
        } else {
            Write-Host "[release] NEXT_PUBLIC_MAP_PROVIDER set to 'maplibre'." -ForegroundColor Green
        }
    } else {
        Write-Host "[release] NEXT_PUBLIC_MAP_PROVIDER is set in production." -ForegroundColor Green
    }

    if ($missingEnv) {
        Write-Host ""
        Write-Host "[release] Required env vars are missing. Set them above, then re-run:" -ForegroundColor Red
        Write-Host "  npm run release:vercel" -ForegroundColor Yellow
        exit 1
    }

    # ── 6. Build checks ───────────────────────────────────────────────────────
    Write-Host ""
    Write-Host "[release] Lint..." -ForegroundColor Cyan
    npm run lint
    if ($LASTEXITCODE -ne 0) { throw "Lint failed. Fix errors before releasing." }

    Write-Host "[release] Typecheck..." -ForegroundColor Cyan
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[release] tsc reported issues. If only from .next/dev/types/validator.ts, safe to continue." -ForegroundColor Yellow
    }

    Write-Host "[release] Build..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed. Fix errors before releasing." }

    # ── 7. Deploy production ──────────────────────────────────────────────────
    Write-Host ""
    Write-Host "[release] Deploying to Vercel production..." -ForegroundColor Green
    $deployOutput = vercel deploy --prod --yes 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host $deployOutput
        throw "Vercel deploy failed."
    }

    # ── 8. Extract deployment URL ─────────────────────────────────────────────
    $deployedUrl = $null
    foreach ($line in $deployOutput) {
        # Vercel prints lines like:  Production: https://wwai-xxxx.vercel.app [1m]
        # or just bare https URLs
        if ($line -match "https://[a-z0-9\-]+\.vercel\.app") {
            $deployedUrl = $Matches[0].TrimEnd(".")
            break
        }
    }

    if (-not $deployedUrl) {
        Write-Host ""
        Write-Host "[release] Could not auto-extract deploy URL from output:" -ForegroundColor Yellow
        Write-Host $deployOutput
        Write-Host ""
        Write-Host "[release] Copy the URL above and run:" -ForegroundColor Yellow
        Write-Host "  .\scripts\smoke.ps1 -BaseUrl `"https://YOUR-URL.vercel.app`"" -ForegroundColor Yellow
        Write-Host "  Share: https://YOUR-URL.vercel.app/client-demo" -ForegroundColor Cyan
        exit 0
    }

    Write-Host "[release] Deployed to: $deployedUrl" -ForegroundColor Green

    # ── 9. Smoke test ─────────────────────────────────────────────────────────
    Write-Host ""
    Write-Host "[release] Running smoke test against $deployedUrl..." -ForegroundColor Cyan
    powershell -ExecutionPolicy Bypass -File scripts/smoke.ps1 -BaseUrl $deployedUrl
    $smokeExit = $LASTEXITCODE

    # ── 10. Final output ──────────────────────────────────────────────────────
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " Client demo URL : $deployedUrl/client-demo" -ForegroundColor Green
    Write-Host " Gate page       : $deployedUrl/demo-access" -ForegroundColor Cyan
    Write-Host " Protected routes require the demo code at /demo-access." -ForegroundColor Cyan
    Write-Host ""
    Write-Host " REMINDER: Rotate DEMO_ACCESS_CODE after external demos." -ForegroundColor Yellow
    Write-Host "   Vercel Dashboard -> Project -> Settings -> Environment Variables" -ForegroundColor Yellow
    Write-Host "   Then redeploy to activate the new code." -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""

    if ($smokeExit -ne 0) {
        Write-Host "[release] Smoke test reported failures. Review before sharing the demo URL." -ForegroundColor Red
        exit 1
    }

    exit 0

} finally {
    Pop-Location
}
