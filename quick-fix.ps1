# Simple Login Fix Script
Write-Host "`nChecking Backend..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
    Write-Host "✓ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is NOT running!" -ForegroundColor Red
    Write-Host "Start backend first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nCreating Admin User..." -ForegroundColor Yellow

$admin = @{
    username = "admin"
    email = "admin@clinic.com"
    password = "admin123"
    role = "Admin"
    fullName = "System Administrator"
    phoneNumber = "9876543210"
} | ConvertTo-Json

try {
    $null = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $admin -ContentType "application/json" -TimeoutSec 10
    Write-Host "✓ Admin user created!" -ForegroundColor Green
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -like "*buffering timed out*") {
        Write-Host "✗ MongoDB is NOT running!" -ForegroundColor Red
        Write-Host "`nSTART MONGODB FIRST:" -ForegroundColor Yellow
        Write-Host "Open new terminal and run: mongod" -ForegroundColor Cyan
        exit 1
    } elseif ($errorMsg -like "*already exists*") {
        Write-Host "✓ Admin user already exists" -ForegroundColor Green
    } else {
        Write-Host "Error: $errorMsg" -ForegroundColor Red
    }
}

Write-Host "`nTesting Login..." -ForegroundColor Yellow

$login = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $login -ContentType "application/json"
    Write-Host "✓ Login works!" -ForegroundColor Green
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "SUCCESS! Login Credentials:" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nUsername: admin" -ForegroundColor Cyan
    Write-Host "Password: admin123" -ForegroundColor Cyan
    Write-Host "`nGo to: http://localhost:3000" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}
