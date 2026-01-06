# Medical Management System

A comprehensive medical management system built with MERN stack for small and mid-size clinics in India.

## 🏥 Features

### Core Modules
- **Patient Management** - Complete patient registration and records
- **Appointment & Reception** - Scheduling and appointment tracking
- **Doctor Consultation** - Patient consultations with vitals, diagnosis, and prescriptions
- **Billing & Payments** - Invoice generation with Indian Rupee formatting
- **Pharmacy Management** - Medicine inventory and sales tracking
- **Laboratory** - Lab test management and result tracking

### Key Features
- ✅ Role-based access control (Admin, Doctor, Receptionist, Pharmacist, Lab Technician)
- ✅ Indian Rupee (INR) currency formatting
- ✅ CSV export functionality for all data
- ✅ Medical report uploads (PDF, images, documents)
- ✅ Auto-generated IDs for patients, appointments, bills, etc.
- ✅ Secure JWT authentication
- ✅ Responsive design

## 🚀 Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- React Toastify
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- Bcrypt.js

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd medical
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical_clinic
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start MongoDB
```bash
mongod
```

### Start Backend Server
```bash
cd backend
npm run dev
# or
npm start
```
Backend will run on: http://localhost:5000

### Start Frontend
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

## 👥 User Roles & Access

### Admin
- Full access to all modules
- User management
- System configuration
- Revenue reports

### Doctor
- Patient consultations
- View patient history
- Prescribe medications and lab tests
- View appointments

### Receptionist
- Patient registration
- Appointment scheduling
- Billing and payments
- View patient records

### Pharmacist
- Medicine inventory management
- Process prescriptions
- Record pharmacy sales

### Lab Technician
- Manage lab tests
- Record test results
- Upload lab reports

## 🔑 Default Login Credentials

After initial setup, create users using the registration endpoint or create them directly in MongoDB:

**Admin:**
- Username: admin
- Password: admin123

**Doctor:**
- Username: doctor1
- Password: doctor123

## 📊 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Patients
- GET `/api/patients` - Get all patients
- GET `/api/patients/:id` - Get patient by ID
- POST `/api/patients` - Register new patient
- PUT `/api/patients/:id` - Update patient
- DELETE `/api/patients/:id` - Deactivate patient

### Appointments
- GET `/api/appointments` - Get all appointments
- GET `/api/appointments/:id` - Get appointment by ID
- POST `/api/appointments` - Schedule appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment

### Consultations (Doctor Module)
- GET `/api/doctors` - Get all consultations
- GET `/api/doctors/:id` - Get consultation by ID
- POST `/api/doctors` - Create consultation
- PUT `/api/doctors/:id` - Update consultation
- GET `/api/doctors/patient/:patientId` - Get patient history

### Billing
- GET `/api/billing` - Get all bills
- GET `/api/billing/:id` - Get bill by ID
- POST `/api/billing` - Generate new bill
- PUT `/api/billing/:id` - Update bill/payment
- GET `/api/billing/stats/revenue` - Get revenue statistics

### Pharmacy
- GET `/api/pharmacy/medicines` - Get all medicines
- POST `/api/pharmacy/medicines` - Add medicine
- PUT `/api/pharmacy/medicines/:id` - Update medicine
- GET `/api/pharmacy/sales` - Get all sales
- POST `/api/pharmacy/sales` - Record sale

### Laboratory
- GET `/api/laboratory/tests` - Get all lab tests
- POST `/api/laboratory/tests` - Add lab test
- GET `/api/laboratory/orders` - Get all lab orders
- POST `/api/laboratory/orders` - Create lab order
- PUT `/api/laboratory/orders/:id` - Update order/results

### Reports
- POST `/api/reports/upload` - Upload single file
- POST `/api/reports/upload-multiple` - Upload multiple files

## 💰 Indian Rupee Formatting

The system uses the Indian numbering system and currency format:
- Currency: ₹ (Indian Rupee)
- Format: ₹1,00,000.00 (1 lakh)
- Decimal places: 2

## 📤 CSV Export

All major data tables support CSV export:
- Patient list
- Appointments
- Billing records
- Pharmacy sales
- Lab orders

## 📁 Project Structure

```
medical/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & upload middleware
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   ├── utils/       # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- Secure file uploads

## 🎨 UI Features

- Responsive design
- Modern card-based layout
- Color-coded status badges
- Toast notifications
- Loading states
- Error handling

## 📝 Data Models

### Patient
- Personal information
- Contact details
- Medical history
- Allergies
- Current medications

### Appointment
- Patient reference
- Doctor reference
- Date and time
- Status tracking
- Chief complaint

### Consultation
- Vitals (BP, pulse, temperature, etc.)
- Symptoms
- Diagnosis
- Prescriptions
- Lab tests
- Follow-up dates

### Billing
- Line items with categories
- Subtotal, discount, tax
- Payment status
- Payment methods (Cash, Card, UPI, etc.)
- Balance tracking

### Medicine
- Stock management
- Pricing (MRP, unit price)
- GST rates
- Expiry tracking
- Low stock alerts

### Lab Test
- Test categories
- Normal ranges
- Sample collection
- Result entry
- Report uploads

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # React development server
```

### Build for Production
```bash
cd frontend
npm run build
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- None reported yet

## 🔮 Future Enhancements

- SMS notifications for appointments
- Email integration
- Advanced reporting and analytics
- Patient portal
- Mobile app
- Telemedicine integration
- Insurance claim management
- Multi-language support
- Prescription printing
- Digital signatures

## 📞 Support

For support, please open an issue in the repository or contact the development team.

## 🙏 Acknowledgments

- MERN Stack Community
- MongoDB Documentation
- React Documentation
- Express.js Documentation

---

Made with ❤️ for Indian Healthcare
