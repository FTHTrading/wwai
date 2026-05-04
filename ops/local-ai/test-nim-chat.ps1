# test-nim-chat.ps1 — Send a test chat completion to local NIM
# Tests: http://localhost:8800/v1/chat/completions

$NIM_URL   = "http://localhost:8800/v1/chat/completions"
$NIM_MODEL = "nvidia/llama-3.1-nemotron-nano-8b-v1"

Write-Host ""
Write-Host "[NIM Chat Test]" -ForegroundColor Cyan
Write-Host "  Endpoint: $NIM_URL"
Write-Host "  Model:    $NIM_MODEL"
Write-Host ""

# First verify the API is up
try {
    $models = Invoke-WebRequest "http://localhost:8800/v1/models" -UseBasicParsing -TimeoutSec 5
    if ($models.StatusCode -ne 200) { throw "Models endpoint returned $($models.StatusCode)" }
    Write-Host "  OK  /v1/models is live" -ForegroundColor Green
} catch {
    Write-Host "  FAIL NIM API not ready: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "       Run health-check.ps1 to diagnose, or wait for TRT build to finish." -ForegroundColor Yellow
    exit 1
}

$body = @{
    model    = $NIM_MODEL
    messages = @(
        @{ role = "user"; content = "Confirm the local NVIDIA NIM server is working." }
    )
    max_tokens = 150
} | ConvertTo-Json -Depth 5

$start = Get-Date
try {
    $response = Invoke-RestMethod `
        -Uri         $NIM_URL `
        -Method      Post `
        -ContentType "application/json" `
        -Body        $body `
        -TimeoutSec  60
    $latency = [math]::Round(((Get-Date) - $start).TotalMilliseconds)

    Write-Host "  OK  Request succeeded" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Model:    $($response.model)"
    Write-Host "  Latency:  ${latency}ms"
    Write-Host ""
    Write-Host "  Response:" -ForegroundColor Cyan
    Write-Host "  $($response.choices[0].message.content)"
    Write-Host ""
} catch {
    $latency = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
    Write-Host "  FAIL Chat request failed after ${latency}ms" -ForegroundColor Red
    Write-Host "       $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
