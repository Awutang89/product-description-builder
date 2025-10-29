@echo off
echo ====================================
echo   Page Crafter - Development Setup
echo ====================================
echo.

echo [1/4] Cleaning up ports 3000 and 5000...
echo.

REM Kill processes on port 5000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process on port 5000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill processes on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [2/4] Starting Backend Server (Port 5000)...
echo.
start "Backend - Port 5000" cmd /k "cd backend && npm run dev"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

echo.
echo [3/4] Starting Frontend Server (Port 3000)...
echo.
start "Frontend - Port 3000" cmd /k "cd frontend && npm run dev"

echo.
echo [4/4] Done!
echo.
echo ====================================
echo   Servers Starting...
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows will open.
echo Press Ctrl+C in each window to stop.
echo.
pause
