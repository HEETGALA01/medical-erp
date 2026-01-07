# Medical Management System - START ALL
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host " Starting Medical Management System " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$root = "C:\Users\Admin\Desktop\medical"

# Start MongoDB
Write-Host "[1/4] MongoDB..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command Write-Host 'MongoDB Server' -ForegroundColor Cyan; mongod"
Start-Sleep -Seconds 3

# Start Backend
Write-Host "[2/4] Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command cd '$root\backend'; Write-Host 'Backend Server (Port 5000)' -ForegroundColor Cyan; node server.js"
Start-Sleep -Seconds 5

# Create User
Write-Host "[3/4] Creating admin user..." -ForegroundColor Yellow
$json = '{"username":"admin","email":"admin@clinic.com","password":"admin123","role":"Admin","fullName":"System Administrator","phoneNumber":"9876543210"}'
try {
    Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $json -ContentType "application/json" | Out-Null
    Write-Host "Admin created" -ForegroundColor Green
} catch {
    Write-Host "Admin exists" -ForegroundColor Green
}

# Start Frontend
Write-Host "[4/4] Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command cd '$root\frontend'; Write-Host 'Frontend (Port 3000)' -ForegroundColor Cyan; npm start"

# Done
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "ALL STARTED!" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 30 seconds, then go to:" -ForegroundColor Yellow
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login:" -ForegroundColor Yellow
Write-Host "Username: admin" -ForegroundColor Cyan
Write-Host "Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
