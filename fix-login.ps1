# Diagnostic and Fix Script for Medical Management System
# This will check all services and create users if needed

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Medical Management System - Diagnostic" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Check if Backend is running
Write-Host "[1/4] Checking Backend Server..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
    Write-Host "✓ Backend is running on port 5000" -ForegroundColor Green
    Write-Host "   Status: $($healthCheck.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is NOT running or not responding!" -ForegroundColor Red
    Write-Host "   Please start backend: cd backend; node server.js" -ForegroundColor Yellow
    exit 1
}

# Test 2: Try to register a test user (will fail if MongoDB not connected)
Write-Host "`n[2/4] Checking MongoDB Connection..." -ForegroundColor Yellow
$testUser = @{
    username = "admin"
    email = "admin@clinic.com"
    password = "admin123"
    role = "Admin"
    fullName = "System Administrator"
    phoneNumber = "9876543210"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $testUser -ContentType "application/json" -TimeoutSec 10
    Write-Host "✓ MongoDB is connected!" -ForegroundColor Green
    Write-Host "✓ Admin user created successfully!" -ForegroundColor Green
    Write-Host "   Username: admin" -ForegroundColor Cyan
    Write-Host "   Password: admin123" -ForegroundColor Cyan
    $userCreated = $true
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*buffering timed out*" -or $errorMessage -like "*ECONNREFUSED*") {
        Write-Host "✗ MongoDB is NOT running or not connected!" -ForegroundColor Red
        Write-Host "   Error: Cannot connect to MongoDB" -ForegroundColor Yellow
        Write-Host "`n   SOLUTION: Start MongoDB first!" -ForegroundColor Yellow
        Write-Host "   Run in a new terminal: mongod" -ForegroundColor Cyan
        exit 1
    } elseif ($errorMessage -like "*already exists*" -or $errorMessage -like "*duplicate*") {
        Write-Host "✓ MongoDB is connected!" -ForegroundColor Green
        Write-Host "✓ Admin user already exists" -ForegroundColor Green
        $userCreated = $true
    } else {
        Write-Host "⚠ Unexpected error: $errorMessage" -ForegroundColor Yellow
    }
}

# Test 3: Try to login with admin credentials
Write-Host "`n[3/4] Testing Login..." -ForegroundColor Yellow
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.user.fullName)" -ForegroundColor Gray
    Write-Host "   Role: $($loginResponse.user.role)" -ForegroundColor Gray
    Write-Host "   Token received: Yes" -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 4: Check Frontend
Write-Host "`n[4/4] Checking Frontend Server..." -ForegroundColor Yellow
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5 -UseBasicParsing
    Write-Host "✓ Frontend is running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend is NOT running!" -ForegroundColor Red
    Write-Host "   Please start frontend: cd frontend; npm start" -ForegroundColor Yellow
}

# Create additional demo users
Write-Host "`n[BONUS] Creating additional demo users..." -ForegroundColor Yellow

$demoUsers = @(
    @{ username="doctor1"; email="doctor1@clinic.com"; password="doctor123"; role="Doctor"; fullName="Dr. Rajesh Kumar"; phoneNumber="9876543211" },
    @{ username="reception1"; email="reception@clinic.com"; password="reception123"; role="Receptionist"; fullName="Priya Sharma"; phoneNumber="9876543212" },
    @{ username="pharmacist1"; email="pharmacy@clinic.com"; password="pharma123"; role="Pharmacist"; fullName="Amit Patel"; phoneNumber="9876543213" },
    @{ username="labtech1"; email="lab@clinic.com"; password="lab123"; role="Lab Technician"; fullName="Suresh Reddy"; phoneNumber="9876543214" }
)

foreach ($user in $demoUsers) {
    $userJson = $user | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $userJson -ContentType "application/json" -ErrorAction SilentlyContinue
        Write-Host "✓ Created: $($user.username)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Message -like "*already exists*") {
            Write-Host "⚠ Already exists: $($user.username)" -ForegroundColor Gray
        }
    }
}

# Final Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SUMMARY - LOGIN CREDENTIALS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🌐 Application URL: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Green

Write-Host "`n📋 Login Credentials:`n" -ForegroundColor Yellow

Write-Host "Admin (Full Access):" -ForegroundColor White
Write-Host "  Username: " -NoNewline; Write-Host "admin" -ForegroundColor Cyan
Write-Host "  Password: " -NoNewline; Write-Host "admin123" -ForegroundColor Cyan

Write-Host "`nDoctor:" -ForegroundColor White
Write-Host "  Username: " -NoNewline; Write-Host "doctor1" -ForegroundColor Cyan
Write-Host "  Password: " -NoNewline; Write-Host "doctor123" -ForegroundColor Cyan

Write-Host "`nReceptionist:" -ForegroundColor White
Write-Host "  Username: " -NoNewline; Write-Host "reception1" -ForegroundColor Cyan
Write-Host "  Password: " -NoNewline; Write-Host "reception123" -ForegroundColor Cyan

Write-Host "`nPharmacist:" -ForegroundColor White
Write-Host "  Username: " -NoNewline; Write-Host "pharmacist1" -ForegroundColor Cyan
Write-Host "  Password: " -NoNewline; Write-Host "pharma123" -ForegroundColor Cyan

Write-Host "`nLab Technician:" -ForegroundColor White
Write-Host "  Username: " -NoNewline; Write-Host "labtech1" -ForegroundColor Cyan
Write-Host "  Password: " -NoNewline; Write-Host "lab123" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ ALL SET! You can now login!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
