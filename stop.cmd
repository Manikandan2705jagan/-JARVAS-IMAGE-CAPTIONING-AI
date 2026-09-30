@echo off
rem ===========================================================================
rem  Stop the Jarvas Image Captioning AI backend and frontend.
rem
rem  Usage:  stop.cmd
rem
rem  Kills whatever is listening on port 8000 (backend) and 5173 (frontend).
rem  Uses Get-NetTCPConnection because `netstat -p TCP` omits IPv6 sockets,
rem  and Vite 8 binds ::1 rather than 127.0.0.1.
rem ===========================================================================

setlocal EnableExtensions

echo.
echo  Stopping Jarvas Image Captioning AI services...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$found = $false; foreach ($p in 8000,5173) { $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue; if ($c) { foreach ($x in $c) { $found = $true; Write-Host ('    stopping PID ' + $x.OwningProcess + ' on port ' + $p + ' (' + $x.LocalAddress + ')'); Stop-Process -Id $x.OwningProcess -Force -ErrorAction SilentlyContinue } } }; if (-not $found) { Write-Host '    nothing was listening on 8000 or 5173' }"

echo.
echo  Done. Ports 8000 and 5173 should now be free.
echo.
exit /b 0
