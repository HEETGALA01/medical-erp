# 🎯 DEMO MODE - Medical Management System

## ⚡ Quick Start (No Backend Required!)

The application is now running in **DEMO MODE** with mock data - you can explore all features without MongoDB or backend setup.

### 🚀 Start the Application

```powershell
cd frontend
npm start
```

The application will open at **http://localhost:3000**

### 🔐 Login

**Any username and password will work!** Try:
- Username: `admin`
- Password: `admin` (or anything)

### 📊 What You'll See

The ERP includes **mock data** for:

#### 1. **Dashboard** 📈
- Today's statistics (12 appointments, 8 patients, ₹45,600 revenue)
- Recent appointments list
- Recent patients list
- Quick action buttons

#### 2. **Patient Management** 👥
- 3 Sample Patients:
  - Rajesh Kumar (PAT000001) - B+, Hypertension
  - Priya Sharma (PAT000002) - O+, Diabetes Type 2
  - Mohammad Ali (PAT000003) - A+
- Search functionality
- CSV export
- Age calculation

#### 3. **Appointments** 📅
- 3 Sample Appointments:
  - Tomorrow: Rajesh with Dr. Anjali Mehta
  - Today: Priya with Dr. Suresh Patel (Completed)
  - Day After: Mohammad with Dr. Kavita Singh
- Filter by date and status
- Multiple appointment types

#### 4. **Billing** 💰
- 2 Sample Bills:
  - BILL000001: ₹1,400 (Consultation + HbA1c + Blood Sugar)
  - BILL000002: ₹800 (Consultation + ECG)
- Payment status tracking
- Indian currency formatting (₹)
- CSV export

#### 5. **Pharmacy** 💊
- 4 Sample Medicines:
  - Paracetamol 500mg (500 units)
  - Amoxicillin 250mg (300 units)
  - Metformin 500mg (450 units)
  - Atorvastatin 10mg (200 units)
- Stock management
- Low stock alerts
- Search by name/generic

#### 6. **Laboratory** 🔬
- 4 Sample Lab Tests:
  - Complete Blood Count (CBC) - ₹400
  - HbA1c - ₹800
  - Lipid Profile - ₹600
  - Liver Function Test - ₹500
- Normal range references
- Turnaround times
- Search functionality

### ✨ Features You Can Explore

✅ **Authentication** - Login with any credentials (demo mode)
✅ **Navigation** - Clean sidebar with all modules
✅ **Search & Filter** - Real-time filtering in all modules
✅ **Indian Formatting** - ₹ currency, phone numbers
✅ **Responsive UI** - Modern, clean design
✅ **Data Export** - CSV export functionality
✅ **Role-Based UI** - Admin user interface

### 🎨 UI Components

- **Login Page** - Clean authentication interface
- **Dashboard** - Statistics cards and quick actions
- **Data Tables** - Sortable, searchable lists
- **Forms** - (Will show mock success messages)
- **Navbar** - User info and logout
- **Sidebar** - Module navigation

### 📝 Note About Forms

Since this is DEMO MODE:
- **View/List pages** work fully with mock data
- **Creating new records** will show success messages but won't persist
- **Editing records** will work in the session only
- **All data resets** on page refresh

### 🔧 When You're Ready for Full Setup

When you want to set up the complete system with MongoDB and backend:
1. Follow `QUICKSTART.md` for full installation
2. Remove "DEMO MODE" comments from code
3. Set up MongoDB and backend server
4. Replace mock data with real API calls

### 💡 Perfect For

- ✅ Understanding the ERP flow
- ✅ Testing UI/UX
- ✅ Demonstrations
- ✅ Learning the features
- ✅ Planning customizations

---

**Enjoy exploring your Medical Management System! 🏥**
