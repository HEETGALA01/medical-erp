# Medical Management System - Complete Startup Script
# This script starts all required services

Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "  Medical Management System - Startup  " -ForegroundColor Cyan
Write-Host "=======================================`n" -ForegroundColor Cyan

$projectRoot = "C:\Users\Admin\Desktop\medical"

# Step 1: Start MongoDB
Write-Host "[Step 1/4] Starting MongoDB..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'MongoDB Server' -ForegroundColor Cyan; mongod"
Start-Sleep -Seconds 3
Write-Host "✓ MongoDB started in new window" -ForegroundColor Green

# Step 2: Start Backend
Write-Host "`n[Step 2/4] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Cyan; node server.js"
Start-Sleep -Seconds 5
Write-Host "✓ Backend started in new window" -ForegroundColor Green

# Step 3: Create Admin User
Write-Host "`n[Step 3/4] Creating Admin User..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$body = '{"username":"admin","email":"admin@clinic.com","password":"admin123","role":"Admin","fullName":"System Administrator","phoneNumber":"9876543210"}'

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 | Out-Null
    Write-Host "✓ Admin user created successfully!" -ForegroundColor Green
}
catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "✓ Admin user already exists" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Could not create user yet, will retry..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        try {
            Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" | Out-Null
            Write-Host "✓ Admin user created!" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠ User might already exist or MongoDB still starting" -ForegroundColor Yellow
        }
    }
}

# Step 4: Start Frontend
Write-Host "`n[Step 4/4] Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm start"
Write-Host "✓ Frontend started in new window" -ForegroundColor Green

# Final Instructions
Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "           ALL SERVICES STARTED         " -ForegroundColor Green
Write-Host "=======================================`n" -ForegroundColor Cyan

Write-Host "📝 3 new PowerShell windows opened:" -ForegroundColor Yellow
Write-Host "   1. MongoDB Server" -ForegroundColor Gray
Write-Host "   2. Backend API Server" -ForegroundColor Gray
Write-Host "   3. Frontend React App" -ForegroundColor Gray

Write-Host "`n⏳ Please wait 20-30 seconds for everything to start..." -ForegroundColor Yellow
Write-Host "`n🌐 Then open your browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor Cyan

Write-Host "`n🔑 Login Credentials:" -ForegroundColor Yellow
Write-Host "   Username: " -NoNewline
Write-Host "admin" -ForegroundColor Cyan
Write-Host "   Password: " -NoNewline
Write-Host "admin123" -ForegroundColor Cyan

Write-Host "`n=======================================`n" -ForegroundColor Cyan

# Keep this window open
Read-Host "Press Enter to close this window"
