# docker-safe-status.ps1 — Read-only Docker status report
# SAFE: only runs read commands. No stop/rm/prune/down.

$ErrorActionPreference = "SilentlyContinue"

function Section($name) {
    Write-Host ""
    Write-Host "[$name]" -ForegroundColor Cyan
    Write-Host ("-" * 60) -ForegroundColor DarkGray
}

Section "Running Containers"
docker ps --format "table {{.Names}}`t{{.Image}}`t{{.Status}}`t{{.Ports}}" 2>&1

Section "Container Resource Usage"
docker stats --no-stream --format "table {{.Name}}`t{{.CPUPerc}}`t{{.MemUsage}}`t{{.NetIO}}" 2>&1

Section "Volumes"
docker volume ls --format "table {{.Name}}`t{{.Driver}}`t{{.Scope}}" 2>&1

Section "Networks"
docker network ls --format "table {{.Name}}`t{{.Driver}}`t{{.Scope}}" 2>&1

Section "Stopped / Exited Containers"
docker ps -a --filter "status=exited" --filter "status=created" --format "table {{.Names}}`t{{.Image}}`t{{.Status}}" 2>&1

Write-Host ""
Write-Host "Docker safe status complete. No changes made." -ForegroundColor Cyan
