# Create Demo Users Script
# Run this after MongoDB and Backend are running

$baseUrl = "http://localhost:5000/api/auth/register"

$users = @(
    @{
        username = "admin"
        email = "admin@clinic.com"
        password = "admin123"
        role = "Admin"
        fullName = "System Administrator"
        phoneNumber = "9876543210"
    },
    @{
        username = "doctor1"
        email = "doctor1@clinic.com"
        password = "doctor123"
        role = "Doctor"
        fullName = "Dr. Rajesh Kumar"
        phoneNumber = "9876543211"
    },
    @{
        username = "reception1"
        email = "reception@clinic.com"
        password = "reception123"
        role = "Receptionist"
        fullName = "Priya Sharma"
        phoneNumber = "9876543212"
    },
    @{
        username = "pharmacist1"
        email = "pharmacy@clinic.com"
        password = "pharma123"
        role = "Pharmacist"
        fullName = "Amit Patel"
        phoneNumber = "9876543213"
    },
    @{
        username = "labtech1"
        email = "lab@clinic.com"
        password = "lab123"
        role = "Lab Technician"
        fullName = "Suresh Reddy"
        phoneNumber = "9876543214"
    }
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Creating Demo Users" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

foreach ($user in $users) {
    Write-Host "Creating user: $($user.username) ($($user.role))..." -ForegroundColor Yellow
    
    $json = $user | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $json -ContentType "application/json"
        Write-Host "✓ User created successfully: $($user.username)" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) {
            Write-Host "⚠ User already exists: $($user.username)" -ForegroundColor Yellow
        }
        else {
            Write-Host "✗ Error creating user: $($user.username)" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "User Creation Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now login with:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Admin:" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor Cyan
Write-Host "  Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Doctor:" -ForegroundColor White
Write-Host "  Username: doctor1" -ForegroundColor Cyan
Write-Host "  Password: doctor123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Receptionist:" -ForegroundColor White
Write-Host "  Username: reception1" -ForegroundColor Cyan
Write-Host "  Password: reception123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pharmacist:" -ForegroundColor White
Write-Host "  Username: pharmacist1" -ForegroundColor Cyan
Write-Host "  Password: pharma123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lab Technician:" -ForegroundColor White
Write-Host "  Username: labtech1" -ForegroundColor Cyan
Write-Host "  Password: lab123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
