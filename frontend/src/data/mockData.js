// Mock data for demo mode - simulates backend responses

// Helper to get data from localStorage or use defaults
const getStoredData = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(`demo_${key}`);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
};

// Helper to save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(`demo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

const defaultPatients = [
  {
    _id: 'P001',
    patientId: 'PAT000001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    phoneNumber: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '123 MG Road, Mumbai, Maharashtra 400001',
    emergencyContact: {
      name: 'Priya Kumar',
      relationship: 'Wife',
      phoneNumber: '+91 98765 43211'
    },
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: 'P002',
    patientId: 'PAT000002',
    firstName: 'Priya',
    lastName: 'Sharma',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    phoneNumber: '+91 98765 43220',
    email: 'priya.sharma@email.com',
    address: '456 Park Street, Kolkata, West Bengal 700016',
    emergencyContact: {
      name: 'Amit Sharma',
      relationship: 'Husband',
      phoneNumber: '+91 98765 43221'
    },
    bloodGroup: 'O+',
    allergies: [],
    chronicConditions: ['Diabetes Type 2'],
    createdAt: '2024-01-20T11:30:00Z'
  },
  {
    _id: 'P003',
    patientId: 'PAT000003',
    firstName: 'Mohammad',
    lastName: 'Ali',
    dateOfBirth: '1978-11-30',
    gender: 'Male',
    phoneNumber: '+91 98765 43230',
    email: 'mohammad.ali@email.com',
    address: '789 Nehru Place, New Delhi 110019',
    emergencyContact: {
      name: 'Fatima Ali',
      relationship: 'Sister',
      phoneNumber: '+91 98765 43231'
    },
    bloodGroup: 'A+',
    allergies: ['Sulfa drugs'],
    chronicConditions: [],
    createdAt: '2024-02-01T09:00:00Z'
  }
];

export const mockPatients = getStoredData('patients', defaultPatients);

const defaultBillings = [
  {
    _id: 'B001',
    billNumber: 'BILL000001',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    items: [
      { description: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 },
      { description: 'HbA1c Test', quantity: 1, rate: 800, amount: 800 },
      { description: 'Blood Sugar Test', quantity: 1, rate: 150, amount: 150 }
    ],
    subtotal: 1450,
    tax: 0,
    discount: 50,
    total: 1400,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    date: '2024-03-01',
    createdAt: '2024-03-01T15:30:00Z'
  },
  {
    _id: 'B002',
    billNumber: 'BILL000002',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    items: [
      { description: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 },
      { description: 'ECG', quantity: 1, rate: 300, amount: 300 }
    ],
    subtotal: 800,
    tax: 0,
    discount: 0,
    total: 800,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    date: '2024-02-28',
    createdAt: '2024-02-28T16:00:00Z'
  }
];

export const mockBillings = getStoredData('billings', defaultBillings);

const defaultMedicines = [
  {
    _id: 'M001',
    medicineId: 'MED000001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'Cipla Ltd',
    category: 'Analgesic',
    stockQuantity: 500,
    unitPrice: 2.5,
    expiryDate: '2025-12-31',
    reorderLevel: 100
  },
  {
    _id: 'M002',
    medicineId: 'MED000002',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    manufacturer: 'Sun Pharma',
    category: 'Antibiotic',
    stockQuantity: 300,
    unitPrice: 8.0,
    expiryDate: '2025-09-30',
    reorderLevel: 50
  },
  {
    _id: 'M003',
    medicineId: 'MED000003',
    name: 'Metformin 500mg',
    genericName: 'Metformin HCl',
    manufacturer: 'Dr. Reddy\'s',
    category: 'Antidiabetic',
    stockQuantity: 450,
    unitPrice: 3.5,
    expiryDate: '2025-11-30',
    reorderLevel: 100
  },
  {
    _id: 'M004',
    medicineId: 'MED000004',
    name: 'Atorvastatin 10mg',
    genericName: 'Atorvastatin',
    manufacturer: 'Ranbaxy',
    category: 'Cholesterol',
    stockQuantity: 200,
    unitPrice: 12.0,
    expiryDate: '2025-08-31',
    reorderLevel: 75
  }
];

export const mockMedicines = getStoredData('medicines', defaultMedicines);

const defaultLabTests = [
  {
    _id: 'L001',
    testId: 'LAB000001',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    cost: 400,
    normalRange: 'WBC: 4000-11000, RBC: 4.5-5.5 million',
    turnaroundTime: '4 hours'
  },
  {
    _id: 'L002',
    testId: 'LAB000002',
    testName: 'HbA1c (Glycated Hemoglobin)',
    category: 'Biochemistry',
    cost: 800,
    normalRange: '4.0-5.6%',
    turnaroundTime: '24 hours'
  },
  {
    _id: 'L003',
    testId: 'LAB000003',
    testName: 'Lipid Profile',
    category: 'Biochemistry',
    cost: 600,
    normalRange: 'Total Cholesterol: <200 mg/dL',
    turnaroundTime: '6 hours'
  },
  {
    _id: 'L004',
    testId: 'LAB000004',
    testName: 'Liver Function Test (LFT)',
    category: 'Biochemistry',
    cost: 500,
    normalRange: 'ALT: 7-56 U/L, AST: 10-40 U/L',
    turnaroundTime: '6 hours'
  }
];

export const mockLabTests = getStoredData('labTests', defaultLabTests);

// Function to add a new patient
export const addMockPatient = (patientData) => {
  const patients = getStoredData('patients', defaultPatients);
  const newPatient = {
    _id: 'P' + Date.now(),
    patientId: 'PAT' + String(patients.length + 1).padStart(6, '0'),
    ...patientData,
    createdAt: new Date().toISOString()
  };
  patients.push(newPatient);
  saveToStorage('patients', patients);
  return newPatient;
};

// Function to get all patients
export const getAllPatients = () => {
  return getStoredData('patients', defaultPatients);
};

export const mockDashboardStats = {
  todayPatients: 8,
  pendingBills: 3,
  totalRevenue: 45600,
  recentPatients: mockPatients.slice(0, 5)
};
