# Simple Setup Script
Write-Host "Checking system..." -ForegroundColor Yellow

# Check backend
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 3 | Out-Null
    Write-Host "[OK] Backend running" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Backend not running!" -ForegroundColor Red
    exit 1
}

# Create admin
Write-Host "Creating admin user..." -ForegroundColor Yellow
$body = '{"username":"admin","email":"admin@clinic.com","password":"admin123","role":"Admin","fullName":"System Administrator","phoneNumber":"9876543210"}'

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 | Out-Null
    Write-Host "[OK] Admin created" -ForegroundColor Green
}
catch {
    if ($_.Exception.Message -like "*timeout*") {
        Write-Host "[ERROR] MongoDB not running!" -ForegroundColor Red
        Write-Host "RUN: mongod" -ForegroundColor Cyan
        exit 1
    }
    Write-Host "[OK] Admin exists" -ForegroundColor Green
}

# Test login
Write-Host "Testing login..." -ForegroundColor Yellow
$loginBody = '{"username":"admin","password":"admin123"}'

try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" | Out-Null
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "SUCCESS! You can now login with:" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Username: admin" -ForegroundColor Cyan
    Write-Host "Password: admin123" -ForegroundColor Cyan
    Write-Host "`nURL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Login failed!" -ForegroundColor Red
}
