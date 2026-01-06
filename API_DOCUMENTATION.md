# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Error details"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "Admin|Doctor|Receptionist|Pharmacist|Lab Technician",
  "fullName": "string",
  "phoneNumber": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string",
    "fullName": "string"
  }
}
```

#### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

#### Get Current User
```http
GET /auth/me
```
*Requires authentication*

---

### Patients

#### Get All Patients
```http
GET /patients?search=string&isActive=boolean
```
*Requires authentication*

#### Get Patient by ID
```http
GET /patients/:id
```
*Requires authentication*

#### Create Patient
```http
POST /patients
```
*Requires authentication (Admin, Receptionist, Doctor)*

**Body:**
```json
{
  "fullName": "string",
  "dateOfBirth": "date",
  "gender": "Male|Female|Other",
  "phoneNumber": "string",
  "email": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "pincode": "string"
  },
  "bloodGroup": "A+|A-|B+|B-|AB+|AB-|O+|O-",
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phoneNumber": "string"
  }
}
```

#### Update Patient
```http
PUT /patients/:id
```
*Requires authentication (Admin, Receptionist, Doctor)*

---

### Appointments

#### Get All Appointments
```http
GET /appointments?status=string&date=YYYY-MM-DD&doctor=id&patient=id
```
*Requires authentication*

#### Create Appointment
```http
POST /appointments
```
*Requires authentication (Admin, Receptionist, Doctor)*

**Body:**
```json
{
  "patient": "patient_id",
  "doctor": "doctor_id",
  "appointmentDate": "date",
  "appointmentTime": "HH:MM",
  "appointmentType": "Consultation|Follow-up|Emergency|Check-up",
  "chiefComplaint": "string",
  "notes": "string"
}
```

---

### Consultations

#### Create Consultation
```http
POST /doctors
```
*Requires authentication (Doctor only)*

**Body:**
```json
{
  "appointment": "appointment_id",
  "patient": "patient_id",
  "vitals": {
    "temperature": 98.6,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "pulse": 72,
    "weight": 70,
    "height": 170
  },
  "symptoms": ["string"],
  "diagnosis": "string",
  "prescriptions": [{
    "medicineName": "string",
    "dosage": "string",
    "frequency": "string",
    "duration": "string",
    "instructions": "string"
  }],
  "labTests": [{
    "testName": "string"
  }],
  "followUpDate": "date",
  "notes": "string"
}
```

---

### Billing

#### Get All Bills
```http
GET /billing?patient=id&paymentStatus=string&startDate=date&endDate=date
```
*Requires authentication*

#### Create Bill
```http
POST /billing
```
*Requires authentication (Admin, Receptionist)*

**Body:**
```json
{
  "patient": "patient_id",
  "appointment": "appointment_id",
  "items": [{
    "description": "string",
    "category": "Consultation|Procedure|Medicine|Lab Test|Other",
    "quantity": 1,
    "unitPrice": 500,
    "amount": 500,
    "tax": 0
  }],
  "discount": 0,
  "tax": 0,
  "amountPaid": 500,
  "paymentMethod": "Cash|Card|UPI|Net Banking|Cheque|Insurance",
  "transactionId": "string",
  "notes": "string"
}
```

#### Update Payment
```http
PUT /billing/:id
```
*Requires authentication (Admin, Receptionist)*

**Body:**
```json
{
  "amountPaid": 500,
  "paymentMethod": "string",
  "transactionId": "string"
}
```

---

### Pharmacy

#### Get All Medicines
```http
GET /pharmacy/medicines?search=string&category=string&lowStock=boolean
```
*Requires authentication*

#### Add Medicine
```http
POST /pharmacy/medicines
```
*Requires authentication (Admin, Pharmacist)*

**Body:**
```json
{
  "name": "string",
  "genericName": "string",
  "manufacturer": "string",
  "category": "Tablet|Capsule|Syrup|Injection|Ointment|Drops|Other",
  "strength": "string",
  "batchNumber": "string",
  "expiryDate": "date",
  "stock": 100,
  "reorderLevel": 10,
  "unitPrice": 50,
  "mrp": 60,
  "gstRate": 12
}
```

#### Create Sale
```http
POST /pharmacy/sales
```
*Requires authentication (Pharmacist, Admin)*

**Body:**
```json
{
  "patient": "patient_id",
  "prescription": "consultation_id",
  "items": [{
    "medicine": "medicine_id",
    "quantity": 2,
    "unitPrice": 50,
    "discount": 0,
    "gst": 6,
    "totalAmount": 106
  }],
  "subtotal": 100,
  "discount": 0,
  "gst": 6,
  "totalAmount": 106,
  "amountPaid": 106,
  "paymentMethod": "Cash|Card|UPI|Net Banking"
}
```

---

### Laboratory

#### Get All Lab Tests
```http
GET /laboratory/tests?search=string&category=string
```
*Requires authentication*

#### Add Lab Test
```http
POST /laboratory/tests
```
*Requires authentication (Admin, Lab Technician)*

**Body:**
```json
{
  "testName": "string",
  "category": "Blood|Urine|Stool|Radiology|Pathology|Microbiology|Other",
  "description": "string",
  "normalRange": "string",
  "price": 500,
  "duration": 1,
  "preparationInstructions": "string"
}
```

#### Create Lab Order
```http
POST /laboratory/orders
```
*Requires authentication (Doctor, Receptionist, Admin)*

**Body:**
```json
{
  "patient": "patient_id",
  "doctor": "doctor_id",
  "consultation": "consultation_id",
  "tests": [{
    "test": "test_id"
  }],
  "totalAmount": 500,
  "priority": "Normal|Urgent|STAT"
}
```

#### Update Lab Order (Results)
```http
PUT /laboratory/orders/:id
```
*Requires authentication (Lab Technician, Admin)*

**Body:**
```json
{
  "tests": [{
    "test": "test_id",
    "status": "Completed",
    "result": {
      "value": "string",
      "unit": "string",
      "interpretation": "string",
      "remarks": "string"
    },
    "testedBy": "user_id",
    "testedDate": "date"
  }],
  "status": "Completed",
  "reportDate": "date"
}
```

---

### Reports

#### Upload Single File
```http
POST /reports/upload
```
*Requires authentication*

**Form Data:**
- `report`: File (image, PDF, document)
- `uploadType`: string (optional, default: "reports")

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "fileName": "original_name.pdf",
    "filePath": "/uploads/reports/filename.pdf",
    "fileSize": 12345,
    "mimeType": "application/pdf",
    "uploadedAt": "date"
  }
}
```

#### Upload Multiple Files
```http
POST /reports/upload-multiple
```
*Requires authentication*

**Form Data:**
- `reports[]`: Multiple files (up to 5)
- `uploadType`: string (optional)

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
