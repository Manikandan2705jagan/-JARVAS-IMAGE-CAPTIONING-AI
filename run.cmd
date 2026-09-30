@echo off
setlocal EnableExtensions EnableDelayedExpansion
rem ===========================================================================
rem  Jarvas Image Captioning AI - start the backend and the frontend.
rem
rem  Usage:  run.cmd
rem
rem  No extra dependencies. Uses the venv in backend\.venv and npm.cmd.
rem  Close this window, or run stop.cmd, to shut both services down.
rem ===========================================================================

cd /d "%~dp0"

set "ROOT=%~dp0"
set "VENV_PY=%ROOT%backend\.venv\Scripts\python.exe"
set "API_URL=http://127.0.0.1:8000"
set "WEB_URL=http://localhost:5173"

echo.
echo  ==========================================================
echo    Jarvas Image Captioning AI  ::  development launcher
echo  ==========================================================
echo.

rem --- Preflight ------------------------------------------------------------
if not exist "%VENV_PY%" (
  echo  [X] Backend virtual environment is missing.
  echo.
  echo      Expected: %VENV_PY%
  echo.
  echo      Create it once with:
  echo          python -m venv backend\.venv
  echo          backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
  echo.
  pause
  exit /b 1
)

if not exist "%ROOT%node_modules" (
  echo  [X] Frontend dependencies are missing.
  echo      Run:  npm install
  echo.
  pause
  exit /b 1
)

rem --- Port checks ----------------------------------------------------------
rem Get-NetTCPConnection rather than netstat: Vite 8 binds ::1 and
rem `netstat -p TCP` does not list IPv6 sockets.
for /f "usebackq delims=" %%b in (`powershell -NoProfile -Command ^
  "$busy = foreach ($p in 8000,5173) { if (Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue) { $p } }; if ($busy) { $busy -join ',' }"`) do set "BUSYPORTS=%%b"

if defined BUSYPORTS (
  for %%P in (!BUSYPORTS:,= !) do (
    echo  [!] Port %%P is already in use - something may already be running.
  )
  echo      If startup fails, run stop.cmd first.
  echo.
)

rem --- Backend --------------------------------------------------------------
echo  [1/2] Starting backend  ^-^>  %API_URL%
start "Jarvas Backend :8000" /D "%ROOT%backend" cmd /k ""%VENV_PY%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo      waiting for the API to answer...
set /a WAITED=0
:waitloop
set /a WAITED+=2
set "HEALTH="
for /f "usebackq delims=" %%h in (`curl.exe -s -m 4 "%API_URL%/api/health" 2^>nul`) do set "HEALTH=%%h"

echo %HEALTH% | findstr /C:"\"status\"" >nul 2>&1
if not errorlevel 1 goto :backendready

if !WAITED! geq 60 (
  echo  [X] Backend did not respond within 60s. See the "Jarvas Backend" window.
  pause
  exit /b 1
)
>nul 2>&1 timeout /t 2 /nobreak
goto :waitloop

:backendready
echo      backend is up after !WAITED!s.
echo.

rem --- Frontend -------------------------------------------------------------
echo  [2/2] Starting frontend  ^-^>  %WEB_URL%
start "Jarvas Frontend :5173" /D "%ROOT%" cmd /k "npm.cmd run dev"

echo      waiting for Vite...
set /a VWAITED=0
:vwaitloop
set /a VWAITED+=2
curl.exe -s -o NUL -m 4 "%WEB_URL%" 2>nul
if not errorlevel 1 goto :frontendready

if !VWAITED! geq 60 (
  echo  [X] Vite did not respond within 60s. See the "Jarvas Frontend" window.
  pause
  exit /b 1
)
>nul 2>&1 timeout /t 2 /nobreak
goto :vwaitloop

:frontendready
echo      frontend is up after !VWAITED!s.
echo.
echo  ==========================================================
echo    Open:  %WEB_URL%
echo    API:   %API_URL%/api/health
echo.
echo    Use "localhost", not 127.0.0.1 - Vite 8 binds IPv6 only.
echo.
echo    The first caption request downloads ~1.5 GB of model
echo    weights (40-90 s). Later requests take 2-5 s on CPU.
echo.
echo    Run stop.cmd to shut everything down.
echo  ==========================================================
echo.
pause
exit /b 0
