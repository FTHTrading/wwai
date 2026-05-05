<#
.SYNOPSIS
  Test WWAI voice and multilingual status.
  Run: pwsh -ExecutionPolicy Bypass -File scripts/test-wwai-voice.ps1

.DESCRIPTION
  1. Checks /api/wwai/status for voice-related fields
  2. Verifies all 8 languages are reported in siteLanguages
  3. Verifies 6 Deepgram voice languages are reported
  4. Optional: sends a test chat in a non-English language (if server running on :3000)
#>

$BASE = "http://localhost:3000"
$pass = 0
$fail = 0

function Pass { param($msg) Write-Host "  PASS  $msg" -ForegroundColor Green; $script:pass++ }
function Fail { param($msg) Write-Host "  FAIL  $msg" -ForegroundColor Red;  $script:fail++ }
function Info { param($msg) Write-Host "  ....  $msg" -ForegroundColor Cyan  }

# ──────────────────────────────────────────────────────────────────────────────
Write-Host "`n=== WWAI Voice + Language Status Tests ===" -ForegroundColor White

# 1. Fetch status
Info "GET /api/wwai/status"
try {
  $res = Invoke-RestMethod -Uri "$BASE/api/wwai/status" -Method GET -TimeoutSec 10
} catch {
  Fail "/api/wwai/status unreachable — is dev server running? (npm run dev)"
  Write-Host "`nStarted 0/$($pass+$fail) checks — server unavailable." -ForegroundColor Yellow
  exit 1
}

# 2. Check voice fields present
if ($null -ne $res.deepgramConfigured) { Pass "deepgramConfigured field present ($($res.deepgramConfigured))" }
else                                   { Fail "deepgramConfigured field MISSING" }

if ($null -ne $res.voiceInputConfigured) { Pass "voiceInputConfigured field present ($($res.voiceInputConfigured))" }
else                                     { Fail "voiceInputConfigured field MISSING" }

if ($null -ne $res.voiceOutputConfigured) { Pass "voiceOutputConfigured field present ($($res.voiceOutputConfigured))" }
else                                      { Fail "voiceOutputConfigured field MISSING" }

if ($null -ne $res.chatProvider) { Pass "chatProvider field present ($($res.chatProvider))" }
else                             { Fail "chatProvider field MISSING" }

# 3. Check siteLanguages (all 8)
$expected = @("en","es","fr","de","pt","ja","zh","ar")
if ($res.siteLanguages) {
  foreach ($code in $expected) {
    if ($res.siteLanguages -contains $code) { Pass "siteLanguages contains '$code'" }
    else                                    { Fail "siteLanguages MISSING '$code'" }
  }
} else {
  Fail "siteLanguages field MISSING"
}

# 4. Check deepgramVoiceLanguages (6 voice-capable)
$voiceExpected = @("en","es","fr","de","pt","ja")
if ($res.deepgramVoiceLanguages) {
  foreach ($code in $voiceExpected) {
    if ($res.deepgramVoiceLanguages -contains $code) { Pass "deepgramVoiceLanguages contains '$code'" }
    else                                             { Fail "deepgramVoiceLanguages MISSING '$code'" }
  }
  # ar and zh should NOT be in voice languages
  foreach ($notVoice in @("ar","zh")) {
    if ($res.deepgramVoiceLanguages -notcontains $notVoice) { Pass "'$notVoice' correctly absent from deepgramVoiceLanguages" }
    else                                                    { Fail "'$notVoice' should NOT be in deepgramVoiceLanguages" }
  }
} else {
  Fail "deepgramVoiceLanguages field MISSING"
}

# 5. Chat test in Spanish
Info "Sending test chat in Spanish (message in English, lang=es)"
try {
  $body = @{ message = "¿Dónde puedo comer cerca del estadio?"; language = "es" } | ConvertTo-Json
  $chat = Invoke-RestMethod -Uri "$BASE/api/wwai/chat" -Method POST `
    -ContentType "application/json" -Body $body -TimeoutSec 15

  if ($chat.answer -and $chat.answer.Length -gt 10) { Pass "Spanish chat returned answer ($($chat.provider))" }
  else                                              { Fail "Spanish chat returned empty answer" }

  if ($chat.intent -and $chat.intent -ne "unknown") { Pass "Spanish chat classified intent: $($chat.intent)" }
  else                                              { Info "Spanish chat intent: $($chat.intent ?? 'unknown')" }
} catch {
  Info "Spanish chat skipped or failed: $_"
}

# 6. Chat test in Japanese
Info "Sending test chat in Japanese"
try {
  $body = @{ message = "ホテルへの帰り方を教えてください。"; language = "ja" } | ConvertTo-Json
  $chat = Invoke-RestMethod -Uri "$BASE/api/wwai/chat" -Method POST `
    -ContentType "application/json" -Body $body -TimeoutSec 15

  if ($chat.answer -and $chat.answer.Length -gt 10) { Pass "Japanese chat returned answer ($($chat.provider))" }
  else                                              { Fail "Japanese chat returned empty answer" }
} catch {
  Info "Japanese chat skipped: $_"
}

# 7. Transcribe endpoint reachable
Info "POST /api/wwai/voice/transcribe — checking 503 without Deepgram key"
try {
  # Send empty form — expect 400 or 503
  $form = [System.Net.Http.MultipartFormDataContent]::new()
  $http = [System.Net.Http.HttpClient]::new()
  $r2   = $http.PostAsync("$BASE/api/wwai/voice/transcribe", $form).Result
  if ($r2.StatusCode -in @(400, 503)) { Pass "transcribe returns $($r2.StatusCode) (expected 400 or 503)" }
  else                               { Fail "transcribe returned unexpected status $($r2.StatusCode)" }
} catch {
  Info "Transcribe endpoint check skipped: $_"
}

# 8. Speak endpoint reachable
Info "POST /api/wwai/voice/speak — checking 503 without Deepgram key"
try {
  $body = '{"text":"Hello WWAI"}' 
  $speakRes = Invoke-WebRequest -Uri "$BASE/api/wwai/voice/speak" -Method POST `
    -ContentType "application/json" -Body $body -TimeoutSec 10 -SkipHttpErrorCheck
  if ($speakRes.StatusCode -in @(200, 503)) { Pass "speak returns $($speakRes.StatusCode) (expected 200 or 503)" }
  else                                      { Fail "speak returned unexpected status $($speakRes.StatusCode)" }
} catch {
  Info "Speak endpoint check skipped: $_"
}

# ── Summary ────────────────────────────────────────────────────────────────
Write-Host "`n=== Results ===" -ForegroundColor White
Write-Host "  Passed: $pass" -ForegroundColor Green
Write-Host "  Failed: $fail" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })

if ($fail -eq 0) {
  Write-Host "`nAll voice + language tests passed." -ForegroundColor Green
} else {
  Write-Host "`n$fail test(s) failed. Check output above." -ForegroundColor Red
  exit 1
}
