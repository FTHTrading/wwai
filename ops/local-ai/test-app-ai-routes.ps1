# ops/local-ai/test-app-ai-routes.ps1
# Smoke-tests /api/ai/health and /api/ai/chat against the running Next.js dev server.
# Does not restart Docker or expose secrets.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\ops\local-ai\test-app-ai-routes.ps1
#   powershell -ExecutionPolicy Bypass -File .\ops\local-ai\test-app-ai-routes.ps1 -Port 3002
#
# NOTE: Port 3000 is used by NeedAI (PM2). Start the FIFA Troptions dev server on a
#       different port:
#   cd "C:\Users\Kevan\fifa troptions"
#   $env:PORT=3002; npm run dev
# Then run this script.

param(
    [int]$Port = 3002
)

$BASE = "http://localhost:$Port"
$SEP  = "-" * 60

function Write-Ok   { param($msg) Write-Host "  OK  $msg" -ForegroundColor Green  }
function Write-Warn { param($msg) Write-Host "  WARN $msg" -ForegroundColor Yellow }
function Write-Fail { param($msg) Write-Host "  FAIL $msg" -ForegroundColor Red    }
function Write-Info { param($msg) Write-Host "  INFO $msg" -ForegroundColor Cyan   }

Write-Host $SEP
Write-Host "FIFA Troptions -- App AI Routes Smoke Test" -ForegroundColor White
Write-Host "Target: $BASE" -ForegroundColor Gray
Write-Host $SEP

# ------------------------------------------------------------------
# 1. Check dev server is reachable at all
# ------------------------------------------------------------------
Write-Host "`n[Connectivity]"
try {
    $statusCode = curl.exe -s -o NUL -w "%{http_code}" --max-time 5 "$BASE/" 2>&1
    if ($LASTEXITCODE -ne 0 -or [int]$statusCode -lt 200) { throw "HTTP $statusCode" }
    Write-Ok "Dev server responding (HTTP $statusCode)"
} catch {
    Write-Fail "Dev server not reachable at $BASE"
    Write-Host "  -> Run: `$env:PORT=3002; npm run dev" -ForegroundColor Yellow
    exit 1
}

# ------------------------------------------------------------------
# 2. /api/ai/health
# ------------------------------------------------------------------
Write-Host "`n[GET $BASE/api/ai/health]"
try {
    $json = curl.exe -s --max-time 10 "$BASE/api/ai/health" 2>&1
    if ($LASTEXITCODE -ne 0) { throw "curl exit $LASTEXITCODE" }
    $h = $json | ConvertFrom-Json
    Write-Info "Overall OK  : $($h.ok)"
    Write-Info "Recommended : $($h.recommendedProvider)"

    $nim = $h.providers.nim
    if ($nim.ok) {
        Write-Ok   "NIM LIVE  -- latency $($nim.latencyMs)ms | model: $($nim.model)"
    } else {
        Write-Warn "NIM OFFLINE -- $($nim.error)"
    }

    $oll = $h.providers.ollama
    if ($oll.ok) {
        Write-Ok   "Ollama LIVE -- latency $($oll.latencyMs)ms"
    } else {
        Write-Warn "Ollama OFFLINE -- $($oll.error)"
    }
} catch {
    Write-Fail "/api/ai/health request failed: $($_.Exception.Message)"
}

# ------------------------------------------------------------------
# 3. /api/ai/chat
# ------------------------------------------------------------------
Write-Host "`n[POST $BASE/api/ai/chat]"
$tmpBody = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tmpBody -Value '{"messages":[{"role":"user","content":"Confirm FIFA Troptions AI route is working."}]}' -Encoding UTF8 -NoNewline

try {
    $json = curl.exe -s --max-time 90 -X POST "$BASE/api/ai/chat" -H "Content-Type: application/json" --data-binary "@$tmpBody" 2>&1
    if ($LASTEXITCODE -ne 0) { throw "curl exit $LASTEXITCODE" }
    $c = $json | ConvertFrom-Json

    if ($c.ok) {
        Write-Ok   "Chat OK -- provider: $($c.provider) | model: $($c.model) | latency: $($c.latencyMs)ms | status: $($c.status)"
        Write-Host "`n  Response:" -ForegroundColor Gray
        $text = $c.text
        while ($text.Length -gt 0) {
            $chunk = $text.Substring(0, [Math]::Min(100, $text.Length))
            Write-Host "  $chunk" -ForegroundColor White
            $text = $text.Substring($chunk.Length)
        }
    } else {
        Write-Fail "Chat returned ok=false -- provider: $($c.provider)"
        Write-Warn "Error: $($c.error)"
    }
} catch {
    Write-Fail "/api/ai/chat request failed: $($_.Exception.Message)"
} finally {
    if ($tmpBody -and (Test-Path $tmpBody)) { Remove-Item $tmpBody -Force }
}

# ------------------------------------------------------------------
# 4. /api/ai/presets
# ------------------------------------------------------------------
Write-Host "`n[GET $BASE/api/ai/presets]"
try {
    $json = curl.exe -s --max-time 10 "$BASE/api/ai/presets" 2>&1
    if ($LASTEXITCODE -ne 0) { throw "curl exit $LASTEXITCODE" }
    $p = $json | ConvertFrom-Json
    if ($p.ok -and $p.presets.Count -gt 0) {
        Write-Ok   "Presets OK -- $($p.presets.Count) presets returned"
        foreach ($preset in $p.presets) {
            Write-Info "  [$($preset.id)] $($preset.label) -- $($preset.description)"
        }
    } else {
        Write-Fail "Presets returned ok=false or empty list"
    }
} catch {
    Write-Fail "/api/ai/presets request failed: $($_.Exception.Message)"
}

# ------------------------------------------------------------------
# 5. /infrastructure/ai — page renders (200)
# ------------------------------------------------------------------
Write-Host "`n[GET $BASE/infrastructure/ai]"
try {
    $code = curl.exe -s -o NUL -w "%{http_code}" --max-time 10 "$BASE/infrastructure/ai" 2>&1
    if ([int]$code -eq 200) {
        Write-Ok "AI infrastructure page returns HTTP 200"
    } else {
        Write-Fail "AI infrastructure page returned HTTP $code"
    }
} catch {
    Write-Fail "/infrastructure/ai check failed: $($_.Exception.Message)"
}

# ------------------------------------------------------------------
# 6. /dashboard — page renders (200)
# ------------------------------------------------------------------
Write-Host "`n[GET $BASE/dashboard]"
try {
    $code = curl.exe -s -o NUL -w "%{http_code}" --max-time 10 "$BASE/dashboard" 2>&1
    if ([int]$code -eq 200) {
        Write-Ok "Dashboard page returns HTTP 200"
    } else {
        Write-Fail "Dashboard page returned HTTP $code"
    }
} catch {
    Write-Fail "/dashboard check failed: $($_.Exception.Message)"
}

Write-Host "`n$SEP"
Write-Host "Smoke test complete." -ForegroundColor White
Write-Host $SEP
