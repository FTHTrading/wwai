# health-check.ps1 - Kevan Local AI Stack Health Check
# Read-only. No destructive operations.

$ErrorActionPreference = "SilentlyContinue"

function Section($name) {
    Write-Host ""
    Write-Host "[$name]" -ForegroundColor Cyan
}

function OK($msg)   { Write-Host "  OK  $msg" -ForegroundColor Green }
function WARN($msg) { Write-Host "  WARN $msg" -ForegroundColor Yellow }
function FAIL($msg) { Write-Host "  FAIL $msg" -ForegroundColor Red }
function INFO($msg) { Write-Host "  INFO $msg" -ForegroundColor Gray }

# ── Docker ─────────────────────────────────────────────────────────────────
Section "Docker"
try {
    $info = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        OK "Docker Desktop responding"
        $runtimes = ($info | Select-String "Runtimes:").ToString().Trim()
        if ($runtimes -match "nvidia") { OK "nvidia runtime registered" }
        else { WARN "nvidia runtime NOT found in Docker runtimes" }
    } else { FAIL "Docker not responding" }
} catch { FAIL "Docker error: $_" }

# ── NVIDIA GPU ─────────────────────────────────────────────────────────────
Section "NVIDIA GPU"
try {
    $gpu = nvidia-smi --query-gpu=name,driver_version,memory.total,memory.used,memory.free,utilization.gpu --format=csv,noheader 2>&1
    if ($LASTEXITCODE -eq 0) {
        $parts = $gpu -split ","
        OK  "Name:     $($parts[0].Trim())"
        INFO "Driver:   $($parts[1].Trim())"
        INFO "VRAM:     $($parts[2].Trim()) total | $($parts[3].Trim()) used | $($parts[4].Trim()) free"
        INFO "GPU util: $($parts[5].Trim())"
    } else { FAIL "nvidia-smi not available" }
} catch { FAIL "nvidia-smi error: $_" }

# ── NIM ────────────────────────────────────────────────────────────────────
Section "NIM"
$nimStatus = docker ps --filter "name=nvidia-assistant-llm" --format "{{.Status}}" 2>&1
if ($nimStatus -match "Up") {
    OK "Container nvidia-assistant-llm: $nimStatus"
    $stats = docker stats nvidia-assistant-llm --no-stream --format "CPU={{.CPUPerc}} MEM={{.MemUsage}} NET={{.NetIO}}" 2>&1
    INFO "Stats: $stats"
    try {
        $resp = Invoke-WebRequest http://localhost:8800/v1/models -UseBasicParsing -TimeoutSec 5
        if ($resp.StatusCode -eq 200) {
            OK "NIM API http://localhost:8800/v1/models - LIVE"
            $models = ($resp.Content | ConvertFrom-Json).data | ForEach-Object { $_.id }
            INFO "Models: $($models -join ', ')"
        }
    } catch {
        WARN "NIM API not ready yet (still building TRT engine)"
        $lastLog = docker logs --tail 3 nvidia-assistant-llm 2>&1 | Select-Object -Last 1
        INFO "Last log: $lastLog"
    }
} elseif ($nimStatus) {
    WARN "Container exists but not running: $nimStatus"
} else {
    FAIL "Container nvidia-assistant-llm not found"
}

# ── Open WebUI ─────────────────────────────────────────────────────────────
Section "Open WebUI"
$owStatus = docker ps --filter "name=open-webui" --format "{{.Status}}" 2>&1
if ($owStatus -match "Up") {
    OK "Container open-webui: $owStatus"
    try {
        $ow = Invoke-WebRequest http://localhost:3001 -UseBasicParsing -TimeoutSec 5
        if ($ow.StatusCode -eq 200) { OK "Open WebUI http://localhost:3001 - LIVE" }
    } catch { WARN "Open WebUI container up but HTTP check failed: $($_.Exception.Message)" }
} else { FAIL "open-webui container not running" }

# ── Ollama ─────────────────────────────────────────────────────────────────
Section "Ollama"
$ollamaProc = Get-Process ollama -ErrorAction SilentlyContinue
if ($ollamaProc) {
    $pids = ($ollamaProc | ForEach-Object { $_.Id }) -join ", "
    WARN "Ollama is running (PIDs: $pids) - may compete with NIM for VRAM"
    try {
        $tags = Invoke-WebRequest http://localhost:11434/api/tags -UseBasicParsing -TimeoutSec 3 | ConvertFrom-Json
        $loaded = $tags.models | Measure-Object | Select-Object -ExpandProperty Count
        INFO "Ollama models available: $loaded"
    } catch { INFO "Ollama process up but API not responding" }
} else {
    OK "Ollama not running (VRAM free for NIM)"
}

# ── PM2 ────────────────────────────────────────────────────────────────────
Section "PM2"
try {
    $pm2Raw = pm2 list 2>&1
    $online  = ($pm2Raw | Select-String "online").Count
    $stopped = ($pm2Raw | Select-String "stopped").Count
    $errored = ($pm2Raw | Select-String "errored").Count
    if ($online -gt 0 -or $stopped -gt 0) {
        OK  "PM2 online: $online  stopped: $stopped  errored: $errored"
        $pm2Raw | Select-String "\| " | ForEach-Object {
            $line = $_.ToString().Trim()
            if ($line -match "\|\s+(\S+)\s+\|.*\|\s+(online|stopped|errored)\s+\|") {
                $pname = $Matches[1]; $pstatus = $Matches[2]
                if ($pstatus -eq "online") { OK  "  $pname - online" }
                else { WARN "  $pname - $pstatus" }
            }
        }
    } else { WARN "PM2 returned no processes" }
} catch { WARN "PM2 not available: $_" }

# ── Ports ──────────────────────────────────────────────────────────────────
Section "Ports"
$ports = @(
    @{port=3000; name="NeedAI"},
    @{port=3001; name="Open WebUI"},
    @{port=7332; name="Apostle Chain"},
    @{port=8010; name="Infra Backend API"},
    @{port=8011; name="Infra LLM Service"},
    @{port=8089; name="ClawdBot Runner"},
    @{port=8099; name="ClawdHub Registry"},
    @{port=8110; name="MCP Control"},
    @{port=8300; name="NemoClaw"},
    @{port=8800; name="NIM (Nemotron)"},
    @{port=11434; name="Ollama"}
)
foreach ($p in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $p.port -State Listen -ErrorAction SilentlyContinue
    if ($conn) { OK "$($p.name.PadRight(25)) :$($p.port) - LISTENING" }
    else        { INFO "$($p.name.PadRight(25)) :$($p.port) - not listening" }
}

Write-Host ""
Write-Host "Health check complete." -ForegroundColor Cyan
