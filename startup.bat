@echo off
REM College Recommendation System - Startup Script

echo.
echo ╔════════════════════════════════════════════╗
echo ║  College Recommendation System Startup     ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Node.js is not installed or not in PATH
    echo   Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB...
curl -s http://localhost:27017 >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠ WARNING: MongoDB does not appear to be running
    echo.
    echo To start MongoDB:
    echo   - Windows: mongod (run in separate terminal)
    echo   - macOS: brew services start mongodb-community
    echo   - Linux: sudo systemctl start mongod
    echo.
    pause
)

REM Check .env file
if not exist ".env" (
    echo ✗ ERROR: .env file not found in capstone_3.0 directory
    echo   Please follow SETUP.md instructions
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo ✓ MongoDB connection verified
echo ✓ Environment file found
echo.

REM Start backend in new window
echo Starting backend server...
start "Backend - College Recommendation System" cmd /k "npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting frontend...
start "Frontend - College Recommendation System" cmd /k "cd client && npm start"

echo.
echo ✓ Startup complete!
echo.
echo URLs:
echo   - Backend API: http://localhost:5000
echo   - Frontend: http://localhost:3000
echo   - Health Check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C in either window to stop that server
echo.
pause
