# Quick Start Guide

## Prerequisites
- Node.js v14+
- MongoDB v4+
- Git

## Installation (5 minutes)

### 1. Clone & Install
```bash
# Clone repository
git clone <your-repo-url>
cd medical

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical_clinic
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start Services

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Create First Admin User

Use any API client (Postman, curl) or the registration form:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@clinic.com",
    "password": "admin123",
    "role": "Admin",
    "fullName": "System Administrator",
    "phoneNumber": "9876543210"
  }'
```

## First Steps

1. **Login** with admin credentials
2. **Add Patients** - Register new patients
3. **Schedule Appointments** - Book appointments
4. **Add Doctors** - Register doctor users
5. **Configure Medicine** - Add medicine inventory
6. **Setup Lab Tests** - Add available tests

## Module Overview

### For Receptionists
1. Register patients
2. Schedule appointments
3. Generate bills
4. Accept payments

### For Doctors
1. View appointments
2. Record consultations
3. Prescribe medicines
4. Order lab tests

### For Pharmacists
1. Manage medicine inventory
2. Process prescriptions
3. Record sales

### For Lab Technicians
1. View lab orders
2. Enter test results
3. Upload reports

### For Admins
1. Full system access
2. User management
3. View reports
4. System configuration

## Common Tasks

### Register a Patient
1. Navigate to Patients
2. Click "Add Patient"
3. Fill form with patient details
4. Submit

### Schedule Appointment
1. Navigate to Appointments
2. Click "New Appointment"
3. Select patient and doctor
4. Choose date and time
5. Submit

### Generate Bill
1. Navigate to Billing
2. Click "New Bill"
3. Select patient
4. Add line items
5. Enter payment details
6. Generate

### Record Consultation
1. Navigate to Appointments
2. Find appointment
3. Click "Start Consultation"
4. Record vitals and diagnosis
5. Add prescriptions
6. Save

## Export Data to CSV
- Go to any list view (Patients, Appointments, etc.)
- Click "Export CSV" button
- File downloads automatically

## Upload Reports
- In consultation or lab order
- Click upload button
- Select PDF, image, or document
- Maximum 5MB per file

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env configuration
- Check if port 5000 is available

### Frontend won't start
- Clear node_modules and reinstall
- Check if port 3000 is available
- Verify backend is running

### Can't login
- Verify user exists in database
- Check JWT_SECRET in .env
- Clear browser cache

### Database connection error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB port (default 27017)

## Production Deployment

### Backend
```bash
cd backend
npm start
# Use process manager like PM2
pm2 start server.js
```

### Frontend
```bash
cd frontend
npm run build
# Serve build folder with nginx or serve
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=strong-random-secret
PORT=5000
```

## Security Checklist
- [ ] Change JWT_SECRET
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up MongoDB authentication
- [ ] Use environment variables
- [ ] Implement rate limiting
- [ ] Regular backups

## Support
- Check README.md for detailed documentation
- Check API_DOCUMENTATION.md for API details
- Open an issue on GitHub

---
Ready to manage your clinic! 🏥
