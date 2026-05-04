@echo off
title TROPTIONS — Safe Install + Verify + Dry-Run
cd /d "%~dp0"
echo.
echo ===============================================
echo   TROPTIONS - Command 18C Safe Launcher
echo   1. Fix/clean all scripts
echo   2. Install pwsh if missing
echo   3. Verify + dry-run ONLY — NOTHING DEPLOYED
echo ===============================================
echo.
echo NOTE: Run as Administrator if PowerShell 7
echo       is not yet installed on this machine.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

rem Step 1: Write clean verify-and-dryrun.cjs (runs fix-automate.cjs too)
if exist _fix-verify.cjs (
  node _fix-verify.cjs
)

rem Step 2: Write clean install-and-verify.cjs
if exist _rewrite-install-and-verify.cjs (
  node _rewrite-install-and-verify.cjs
)

rem Step 3: Install pwsh + run full verification
node install-and-verify.cjs

echo.
pause

