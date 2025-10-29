# Page Crafter - Development Setup (PowerShell)
# Usage: .\dev.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Page Crafter - Development Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Cleaning up ports 3000 and 5000..." -ForegroundColor Yellow
Write-Host ""

# Function to kill process on a specific port
function Stop-ProcessOnPort {
    param($Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($proc in $processes) {
            $processId = $proc.OwningProcess
            Write-Host "  Killing process on port $Port (PID: $processId)" -ForegroundColor Gray
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "  Port $Port is already free" -ForegroundColor Gray
    }
}

# Kill processes on ports
Stop-ProcessOnPort -Port 5000
Stop-ProcessOnPort -Port 3000

Write-Host ""
Write-Host "[2/4] Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Write-Host ""

# Start Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server - Port 5000' -ForegroundColor Green; npm run dev"

# Wait for backend to initialize
Write-Host "  Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[3/4] Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Write-Host ""

# Start Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server - Port 3000' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "[4/4] Done!" -ForegroundColor Green
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Servers Starting..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Two PowerShell windows have opened." -ForegroundColor Gray
Write-Host "Press Ctrl+C in each window to stop." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
