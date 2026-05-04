# scripts/smoke.ps1
# Post-deploy smoke test. Checks public pages are reachable and protected
# routes are gated (redirect to /demo-access or return 200 on that page).
# Does NOT attempt to submit the demo access code.
#
# Usage:
#   .\scripts\smoke.ps1 -BaseUrl "https://your-vercel-url.vercel.app"
#   .\scripts\smoke.ps1 -BaseUrl "http://localhost:3002"

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl
)

$ErrorActionPreference = "SilentlyContinue"

$pass = 0
$warn = 0
$fail = 0

$BaseUrl = $BaseUrl.TrimEnd("/")

# ── Guard: refuse placeholder URLs ────────────────────────────────────────────
$placeholderPatterns = @(
    "your-url\.vercel\.app",
    "your-vercel-url",
    "<your-vercel-url>",
    "example\.com",
    "REAL-VERCEL-URL",
    "wwai-your-real-deploy"
)
foreach ($pattern in $placeholderPatterns) {
    if ($BaseUrl -match $pattern) {
        Write-Host ""
        Write-Host "ERROR: Placeholder URL detected." -ForegroundColor Red
        Write-Host "  '$BaseUrl' is not a real deployment." -ForegroundColor Red
        Write-Host ""
        Write-Host "Deploy first, then run smoke against the real Vercel URL:" -ForegroundColor Yellow
        Write-Host "  npm run deploy" -ForegroundColor Yellow
        Write-Host "  .\scripts\smoke.ps1 -BaseUrl `"https://wwai-<hash>.vercel.app`"" -ForegroundColor Yellow
        exit 1
    }
}

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

function Probe {
    param(
        [string]$Path,
        [bool]$Protected = $false,
        [string]$Label = ""
    )

    $url = "$BaseUrl$Path"
    $display = if ($Label) { $Label } else { $Path }

    try {
        # AllowAutoRedirect=false so we can see 3xx on protected routes
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.AllowAutoRedirect = $false
        $req.Timeout = 10000
        $req.Method = "GET"
        $resp = $req.GetResponse()
        $status = [int]$resp.StatusCode
        $location = $resp.Headers["Location"]
        $resp.Close()

        if ($Protected) {
            # We expect a 307/302/301 redirect to /demo-access, or a 200 on /demo-access itself
            if ($status -in @(301, 302, 307, 308)) {
                if ($location -match "demo-access") {
                    Pass "$display — $status -> /demo-access (GATED)"
                } else {
                    Warn "$display — $status redirect to '$location' (expected /demo-access)"
                }
            } elseif ($status -eq 200) {
                Fail "$display — 200 without gate. Protected route is openly accessible!"
            } else {
                Warn "$display — $status (unexpected for protected route)"
            }
        } else {
            if ($status -eq 200) {
                Pass "$display — $status OK"
            } elseif ($status -in @(301, 302, 307, 308)) {
                Warn "$display — $status redirect to '$location'"
            } else {
                Fail "$display — $status (expected 200)"
            }
        }
    } catch [System.Net.WebException] {
        $status = [int]$_.Exception.Response.StatusCode

        if ($Protected -and $status -in @(301, 302, 307, 308)) {
            $location = $_.Exception.Response.Headers["Location"]
            if ($location -match "demo-access") {
                Pass "$display — $status -> /demo-access (GATED)"
            } else {
                Warn "$display — $status redirect to '$location'"
            }
        } elseif ($status -eq 500) {
            Fail "$display — 500 Internal Server Error"
        } elseif ($status -eq 404) {
            Fail "$display — 404 Not Found"
        } elseif ($status -eq 0 -or $null -eq $status) {
            Fail "$display — unreachable ($($_.Exception.Message))"
        } else {
            Warn "$display — $status"
        }
    }
}

Write-Host ""
Write-Host "=== wwai smoke test ===" -ForegroundColor Cyan
Write-Host "  Target: $BaseUrl"
Write-Host ""

# ── Public routes ──────────────────────────────────────────────────────────────
Write-Host "── Public routes" -ForegroundColor Cyan
Probe "/"
Probe "/client-demo"
Probe "/wwai"
Probe "/packages"
Probe "/register"
Probe "/area-guide"
Probe "/map"
Probe "/safety-routes"
Probe "/contact"
Probe "/demo-access"

# ── Protected routes (should redirect to /demo-access) ─────────────────────────
Write-Host ""
Write-Host "── Protected routes (gate check)" -ForegroundColor Cyan
Probe "/admin"                    -Protected $true
Probe "/billing"                  -Protected $true
Probe "/analytics"                -Protected $true
Probe "/settings/integrations"    -Protected $true
Probe "/launch"                   -Protected $true

# ── Summary ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Smoke test summary ===" -ForegroundColor Cyan
Write-Host "  PASS: $pass" -ForegroundColor Green
Write-Host "  WARN: $warn" -ForegroundColor Yellow
Write-Host "  FAIL: $fail" -ForegroundColor $(if ($fail -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($fail -gt 0) {
    Write-Host "Smoke test FAILED. Review issues above before sharing the demo URL." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Smoke test passed." -ForegroundColor Green
    exit 0
}
