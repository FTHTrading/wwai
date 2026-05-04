@echo off
echo.
echo  TROPTIONS Event OS — Full Deploy
echo  ===================================
echo.

cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo ERROR: Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

node automate.cjs
if %errorlevel% neq 0 (
  echo.
  echo Deploy failed — check the errors above.
  pause
  exit /b 1
)

pause
