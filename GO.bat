@echo off
REM GO.bat — TROPTIONS one-shot launcher
REM Just double-click this file (or run as Administrator if pwsh isn't installed yet).

title TROPTIONS — One-Shot Safe Launcher
cd /d "%~dp0"

echo.
echo ===============================================
echo   TROPTIONS - One-Shot Safe Launcher
echo   Dry-run only. Nothing deployed.
echo ===============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

node go.cjs

echo.
echo ===============================================
echo   Verification complete. Review output above.
echo   To proceed with staging deploy, follow the
echo   STAGE 2 commands shown above (run manually).
echo ===============================================
echo.
pause
