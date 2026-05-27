@echo off
setlocal enabledelayedexpansion

echo.
echo ======================================
echo JTCUTZ Performance Testing Tool
echo ======================================
echo.

REM Check if K6 is installed
k6 version >nul 2>&1
if errorlevel 1 (
    echo X K6 is not installed. Please install it first:
    echo.
    echo Windows (Chocolatey): choco install k6
    echo Or download from: https://github.com/grafana/k6/releases
    echo.
    pause
    exit /b 1
)

echo + K6 is installed
echo.

REM Change to server directory
cd /d "%~dp0server"

REM Display menu
echo Choose a test scenario:
echo 1. Smoke Test (5 users, 30s) - Quick validation
echo 2. Load Test (50 users, 2m) - Baseline performance
echo 3. Stress Test (100 users, 5m) - Find breaking point
echo 4. Spike Test (Dynamic load) - Sudden traffic spike
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo + Running Smoke Test...
    echo.
    call npm run test:performance:smoke
) else if "%choice%"=="2" (
    echo.
    echo + Running Load Test...
    echo.
    call npm run test:performance:load
) else if "%choice%"=="3" (
    echo.
    echo + Running Stress Test...
    echo ! This will stress your system. Continue? (y/n)
    set /p confirm="Enter: "
    if /i "%confirm%"=="y" (
        call npm run test:performance:stress
    )
) else if "%choice%"=="4" (
    echo.
    echo + Running Spike Test...
    echo.
    call npm run test:performance:spike
) else if "%choice%"=="5" (
    echo + Exiting...
    exit /b 0
) else (
    echo X Invalid choice
    exit /b 1
)

echo.
echo + Test completed!
echo.
pause
