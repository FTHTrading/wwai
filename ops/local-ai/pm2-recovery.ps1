# pm2-recovery.ps1 — Restart stopped PM2 processes
# Only restarts ada-rag-indexer if it exists and is stopped.
# Safe: will not start unknown processes.

$TARGET = "ada-rag-indexer"

Write-Host ""
Write-Host "[PM2 Recovery]" -ForegroundColor Cyan

try {
    $pm2Raw  = pm2 list 2>&1
    $procLine = $pm2Raw | Select-String $TARGET | Select-Object -First 1
    if (-not $procLine) {
        Write-Host "  WARN Process '$TARGET' not found in PM2 list." -ForegroundColor Yellow
        Write-Host "       Run: pm2 start scripts/rag_index.py --name $TARGET --cron '15 * * * *' --no-autorestart" -ForegroundColor Gray
        exit 0
    }
    $status = if ($procLine -match "online") { "online" } elseif ($procLine -match "stopped") { "stopped" } elseif ($procLine -match "errored") { "errored" } else { "unknown" }
} catch {
    Write-Host "  FAIL Could not read PM2 process list: $_" -ForegroundColor Red
    exit 1
}
Write-Host "  INFO $TARGET status: $status" -ForegroundColor Gray

if ($status -eq "online") {
    Write-Host "  OK  $TARGET is already online. No action needed." -ForegroundColor Green
    exit 0
}

if ($status -eq "stopped" -or $status -eq "errored") {
    Write-Host "  WARN $TARGET is $status — restarting..." -ForegroundColor Yellow
    pm2 restart $TARGET 2>&1
    Start-Sleep 3
    $check = pm2 list 2>&1 | Select-String $TARGET | Select-Object -First 1
    $newStatus = if ($check -match "online") { "online" } else { "not online" }
    if ($newStatus -eq "online") {
        Write-Host "  OK  $TARGET restarted successfully." -ForegroundColor Green
        pm2 save 2>&1 | Out-Null
        Write-Host "  OK  PM2 list saved." -ForegroundColor Green
    } else {
        Write-Host "  FAIL $TARGET failed to restart. Status: $newStatus" -ForegroundColor Red
        pm2 logs $TARGET --lines 10 2>&1
        exit 1
    }
} else {
    Write-Host "  INFO $TARGET status '$status' — not handling automatically." -ForegroundColor Gray
    Write-Host "       Check: pm2 logs $TARGET" -ForegroundColor Gray
}
