# Medical Management System
# Windows Batch Setup Script

@echo off
color 0A
echo ================================
echo Medical Management System Setup
echo ================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB might not be installed
    echo Install from https://www.mongodb.com/try/download/community
)

echo.
echo ================================
echo Installing Dependencies
echo ================================

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo [OK] .env file created
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

cd ..

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next Steps:
echo 1. Start MongoDB: mongod
echo 2. Start Backend: cd backend ^&^& npm run dev
echo 3. Start Frontend: cd frontend ^&^& npm start
echo.
echo Application URLs:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo.
echo Read QUICKSTART.md for detailed instructions
echo.
pause
