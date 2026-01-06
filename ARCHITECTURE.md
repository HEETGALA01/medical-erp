# System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│                     http://localhost:3000                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Dashboard  │  │   Patients   │  │ Appointments │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Consultation │  │   Billing    │  │   Pharmacy   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │  Laboratory  │  │     Auth     │                                │
│  └──────────────┘  └──────────────┘                                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │          Context API (Authentication State)             │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │      Utils (INR Format, CSV Export, Date Format)        │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                      │
└──────────────────────┬───────────────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS (Axios)
                       │ JWT Token in Headers
                       │
┌──────────────────────▼───────────────────────────────────────────────┐
│                      BACKEND (Express.js)                             │
│                     http://localhost:5000                             │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                    Middleware Layer                         │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │
│  │  │   CORS   │  │   JSON   │  │   Auth   │  │  Upload  │  │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                      API Routes                             │     │
│  │                                                             │     │
│  │  /api/auth          - Authentication & Authorization        │     │
│  │  /api/patients      - Patient Management                   │     │
│  │  /api/appointments  - Appointment Scheduling               │     │
│  │  /api/doctors       - Consultation Records                 │     │
│  │  /api/billing       - Billing & Payments                   │     │
│  │  /api/pharmacy      - Medicine & Sales                     │     │
│  │  /api/laboratory    - Lab Tests & Orders                   │     │
│  │  /api/reports       - File Upload                          │     │
│  │                                                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                  Business Logic Layer                       │     │
│  │  • Authentication (JWT, Bcrypt)                            │     │
│  │  • Role-Based Access Control                               │     │
│  │  • Data Validation                                         │     │
│  │  • Error Handling                                          │     │
│  │  • File Processing                                         │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────┬───────────────────────────────────────────────┘
                        │
                        │ Mongoose ODM
                        │
┌───────────────────────▼────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                                  │
│                  mongodb://localhost:27017                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │    users     │  │   patients   │  │ appointments │               │
│  │  (5 roles)   │  │   (PAT001)   │  │   (APT001)   │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │consultations│  │   billings   │  │  medicines   │               │
│  │   (CON001)   │  │  (BILL001)   │  │   (MED001)   │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ pharmacysales│  │  labtests    │  │  laborders   │               │
│  │  (SALE001)   │  │  (TEST001)   │  │   (LAB001)   │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                         FILE SYSTEM                                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  backend/uploads/                                                      │
│  ├── reports/         - Medical reports (PDF, images)                 │
│  ├── prescriptions/   - Prescription documents                        │
│  └── lab-results/     - Laboratory test results                       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                      USER ROLES & PERMISSIONS                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Admin               → All Modules (Full Access)                       │
│  ├─ Users Management                                                   │
│  ├─ System Settings                                                    │
│  └─ Reports & Analytics                                                │
│                                                                        │
│  Doctor              → Medical Operations                              │
│  ├─ View Appointments                                                  │
│  ├─ Record Consultations                                               │
│  ├─ Prescribe Medicines                                                │
│  └─ Order Lab Tests                                                    │
│                                                                        │
│  Receptionist        → Front Desk Operations                           │
│  ├─ Patient Registration                                               │
│  ├─ Appointment Scheduling                                             │
│  ├─ Billing & Payments                                                 │
│  └─ Reception Management                                               │
│                                                                        │
│  Pharmacist          → Pharmacy Operations                             │
│  ├─ Medicine Inventory                                                 │
│  ├─ Process Prescriptions                                              │
│  └─ Record Sales                                                       │
│                                                                        │
│  Lab Technician      → Laboratory Operations                           │
│  ├─ Manage Lab Tests                                                   │
│  ├─ Enter Test Results                                                 │
│  └─ Upload Reports                                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW EXAMPLES                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. Patient Registration Flow:                                         │
│     User Input → Frontend Form → POST /api/patients                    │
│     → Auth Middleware → Patient Model → MongoDB                        │
│     → Auto-generate PAT ID → Return Patient Data                       │
│                                                                        │
│  2. Appointment Booking Flow:                                          │
│     Select Patient & Doctor → POST /api/appointments                   │
│     → Validate Availability → Create Appointment                       │
│     → Auto-generate APT ID → Confirm Booking                           │
│                                                                        │
│  3. Doctor Consultation Flow:                                          │
│     Open Appointment → Record Vitals → Add Diagnosis                   │
│     → Prescribe Medicines → Order Lab Tests                            │
│     → POST /api/doctors → Update Appointment Status                    │
│                                                                        │
│  4. Billing Flow:                                                      │
│     Select Patient → Add Line Items → Calculate Totals                 │
│     → POST /api/billing → Generate Invoice (BILL ID)                   │
│     → Record Payment → Update Payment Status                           │
│                                                                        │
│  5. Pharmacy Sale Flow:                                                │
│     Scan/Search Medicine → Check Stock → Add Quantity                  │
│     → POST /api/pharmacy/sales → Update Stock                          │
│     → Auto-generate SALE ID → Print Receipt                            │
│                                                                        │
│  6. Lab Order Flow:                                                    │
│     Doctor Orders Tests → POST /api/laboratory/orders                  │
│     → Lab Tech Receives → Perform Tests                                │
│     → Enter Results → Upload Report → Notify Doctor                    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Login → POST /api/auth/login                                          │
│    ↓                                                                   │
│  Validate Credentials (bcrypt.compare)                                 │
│    ↓                                                                   │
│  Generate JWT Token (jwt.sign)                                         │
│    ↓                                                                   │
│  Return Token + User Data                                              │
│    ↓                                                                   │
│  Store Token in localStorage                                           │
│    ↓                                                                   │
│  Set Axios Default Header (Authorization: Bearer <token>)              │
│    ↓                                                                   │
│  All Subsequent Requests Include Token                                 │
│    ↓                                                                   │
│  Backend Middleware Verifies Token (jwt.verify)                        │
│    ↓                                                                   │
│  Check User Role & Permissions                                         │
│    ↓                                                                   │
│  Allow/Deny Access                                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Technology Decisions

### Why MERN Stack?
- **Single Language**: JavaScript across frontend and backend
- **JSON**: Native data format for MongoDB and JavaScript
- **Scalability**: Easy to scale horizontally
- **Community**: Large community and resources
- **Speed**: Fast development and deployment

### Why MongoDB?
- **Flexible Schema**: Easy to adapt to changing requirements
- **Document Store**: Natural fit for medical records
- **Performance**: Fast read/write operations
- **Aggregation**: Powerful analytics capabilities
- **JSON Storage**: Direct mapping to JavaScript objects

### Why JWT Authentication?
- **Stateless**: No server-side session storage needed
- **Scalable**: Works well with multiple servers
- **Mobile-Friendly**: Easy to implement in mobile apps
- **Secure**: Industry-standard security

### Why Role-Based Access?
- **Security**: Limit access to sensitive data
- **Compliance**: Meet healthcare regulations
- **Usability**: Show only relevant features to each user
- **Accountability**: Track who did what

## Deployment Architecture

```
Production Setup:

┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Nginx    │  (Reverse Proxy + SSL)
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│   React     │ │  Express    │
│   (Build)   │ │  (API)      │
└─────────────┘ └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  MongoDB    │
                └─────────────┘
```
