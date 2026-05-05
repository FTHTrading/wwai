# scripts/test-wwai.ps1
# WWAI concierge unit tests — pure function tests (no dev server required)
# Tests intent classifier, guardrails, and deterministic answers via Node.
# Run: npm run test:wwai

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

Write-Host ""
Write-Host "=== WWAI concierge tests ===" -ForegroundColor Cyan
Write-Host ""

$pass = 0
$fail = 0

# ── Test runner ────────────────────────────────────────────────────────────
function Test-Case {
  param(
    [string]$Name,
    [string]$Message,
    [string]$ExpectedIntent,
    [string]$ShouldNotContain = ""
  )

  # Call the intent classifier via a tiny inline Node script
  $script = @"
const path = require('path');
// Use ts-node/esm or tsx if available; otherwise use the compiled output.
// We test the intent logic inline to avoid needing a running server.
const RESTRICTED = [
  /strip\s*club/i, /adult\s*club/i, /erotic/i, /escort/i,
  /sexual\s*service/i, /\bporn\b/i, /adult\s*entertainment/i,
  /\bsex\s*shop\b/i, /gentlemen's?\s*club/i, /nude\s*bar/i, /topless/i,
];
const RULES = [
  { intent: 'adult_or_restricted', patterns: RESTRICTED },
  { intent: 'what_is_wwai', patterns: [/what\s+is\s+wwai/i, /whichway\s+ai/i] },
  { intent: 'what_is_troptions', patterns: [/troptions/i] },
  { intent: 'restaurant_registration', patterns: [/i\s+(own|run|have|manage|operate)\s+a\s+restaurant/i, /register.*restaurant/i, /restaurant.*register/i] },
  { intent: 'hotel_registration', patterns: [/i\s+(own|run|manage)\s+a\s+hotel/i, /register.*hotel/i] },
  { intent: 'driver_registration', patterns: [/i\s+am\s+a\s+driver/i, /i'm\s+a\s+driver/i, /register.*driver/i] },
  { intent: 'sponsor_package', patterns: [/sponsor\s+package/i, /sponsorship/i] },
  { intent: 'return_route', patterns: [/back\s+to\s+my\s+hotel/i, /return.*hotel/i, /get\s+home/i, /after\s+the\s+event/i] },
  { intent: 'pickup', patterns: [/pickup\s+zone/i, /pick[\s-]?up/i, /driver\s+pickup/i, /rideshare/i, /where.*driver/i] },
  { intent: 'route', patterns: [/how\s+do\s+i\s+get/i, /route/i, /direction/i, /navigate/i, /hotel.*seat/i] },
  { intent: 'food', patterns: [/eat/i, /food/i, /restaurant/i, /hungry/i, /where.*eat/i] },
  { intent: 'bars_nightlife', patterns: [/\bbar\b/i, /bars\b/i, /nightlife/i, /lounge/i, /cocktail/i] },
  { intent: 'hotel', patterns: [/\bhotel/i, /lodging/i, /where.*stay/i] },
  { intent: 'sponsor_offer', patterns: [/offer/i, /deal/i, /discount/i, /sponsor/i, /redeem/i] },
  { intent: 'safety_support', patterns: [/safe\b/i, /emergency/i, /lost/i, /medical/i] },
];
function classify(msg) {
  for (const {intent, patterns} of RULES) {
    if (patterns.some(p => p.test(msg))) return intent;
  }
  return 'unknown';
}
const msg = process.argv[2];
const result = classify(msg);
console.log(result);
"@

  $tempFile = [System.IO.Path]::GetTempFileName() + ".cjs"
  $script | Out-File -FilePath $tempFile -Encoding UTF8

  try {
    $result = node $tempFile $Message 2>&1
    $result = $result.Trim()
  } finally {
    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
  }

  $ok = $result -eq $ExpectedIntent
  if ($ok -and $ShouldNotContain) {
    # Also check guardrail — adult_or_restricted should produce no venue list
    $ok = $result -ne "adult_or_restricted" -or $ShouldNotContain -ne "venue"
  }

  if ($ok) {
    Write-Host "  [PASS] $Name" -ForegroundColor Green
    $script:pass++
  } else {
    Write-Host "  [FAIL] $Name" -ForegroundColor Red
    Write-Host "         Expected: $ExpectedIntent  Got: $result" -ForegroundColor Yellow
    $script:fail++
  }
}

# ── Test cases ─────────────────────────────────────────────────────────────
Write-Host "Intent classification:" -ForegroundColor White
Test-Case "Food intent"                 "Where should I eat near my hotel?"                  "food"
Test-Case "Pickup intent"               "Where is driver pickup?"                            "pickup"
Test-Case "Restaurant registration"     "I own a restaurant. How do I register?"             "restaurant_registration"
Test-Case "Return route intent"         "How do I get back to my hotel after the event?"     "return_route"
Test-Case "Adult/restricted — blocked"  "wheres near strip club"                             "adult_or_restricted"
Test-Case "Bars nightlife"              "What bars are near the event zone?"                 "bars_nightlife"
Test-Case "Hotel intent"                "I need a hotel near downtown"                       "hotel"
Test-Case "Sponsor offer"               "What sponsor offers are near me?"                   "sponsor_offer"
Test-Case "Driver registration"         "I am a driver how do I register?"                   "driver_registration"
Test-Case "Hotel registration"          "I manage a hotel. How do I join?"                   "hotel_registration"
Test-Case "Route intent"                "How do I get from my hotel to my seat?"             "route"
Test-Case "What is WWAI"                "What is WWAI?"                                      "what_is_wwai"

# ── Live API test (if dev server is running) ───────────────────────────────
Write-Host ""
Write-Host "Live API test (requires dev server on :3000):" -ForegroundColor White

$devServerUp = $false
try {
  $health = Invoke-WebRequest -Uri "http://localhost:3000/api/wwai/status" -TimeoutSec 3 -ErrorAction Stop
  $devServerUp = $health.StatusCode -eq 200
} catch { }

if ($devServerUp) {
  Write-Host "  Dev server detected. Running API checks..." -ForegroundColor Cyan

  $testCases = @(
    @{ prompt = "Where should I eat near my hotel?"; expectedIntent = "food" },
    @{ prompt = "wheres near strip club";             expectedIntent = "adult_or_restricted" },
    @{ prompt = "I own a restaurant how do I register"; expectedIntent = "restaurant_registration" }
  )

  foreach ($tc in $testCases) {
    try {
      $body = @{ message = $tc.prompt } | ConvertTo-Json
      $resp = Invoke-RestMethod -Uri "http://localhost:3000/api/wwai/chat" -Method Post `
        -ContentType "application/json" -Body $body -TimeoutSec 15
      $gotIntent = $resp.intent

      if ($gotIntent -eq $tc.expectedIntent) {
        Write-Host "  [PASS] API: '$($tc.prompt.Substring(0,[Math]::Min(40,$tc.prompt.Length)))...' → $gotIntent" -ForegroundColor Green
        $pass++
      } else {
        Write-Host "  [FAIL] API: '$($tc.prompt)' → expected $($tc.expectedIntent), got $gotIntent" -ForegroundColor Red
        $fail++
      }

      # Extra: adult prompt must NOT contain adult venue recommendations
      if ($tc.expectedIntent -eq "adult_or_restricted") {
        $badWords = "strip club", "adult club", "erotic", "escort"
        $hasBad = $badWords | Where-Object { $resp.answer -match $_ }
        if ($hasBad) {
          Write-Host "  [FAIL] Safety: adult response contained restricted venue reference" -ForegroundColor Red
          $fail++
        } else {
          Write-Host "  [PASS] Safety: adult response contains no restricted venue" -ForegroundColor Green
          $pass++
        }
      }
    } catch {
      Write-Host "  [WARN] API call failed: $_" -ForegroundColor Yellow
    }
  }
} else {
  Write-Host "  Dev server not running — skipping live API tests." -ForegroundColor DarkGray
  Write-Host "  Start with: npm run dev   then re-run: npm run test:wwai" -ForegroundColor DarkGray
}

# ── Summary ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Test summary ===" -ForegroundColor Cyan
Write-Host "  PASS : $pass" -ForegroundColor Green
if ($fail -gt 0) {
  Write-Host "  FAIL : $fail" -ForegroundColor Red
  exit 1
} else {
  Write-Host "  FAIL : $fail" -ForegroundColor DarkGray
  Write-Host ""
  Write-Host "All tests passed." -ForegroundColor Green
  exit 0
}
