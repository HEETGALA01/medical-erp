const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: String,
  givenFromClinic: {
    type: Boolean,
    default: false
  },
  quantity: {
    type: Number,
    default: 0
  }
});

const consultationSchema = new mongoose.Schema({
  consultationId: {
    type: String,
    unique: true
  },
  patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  consultationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Chief Complaint
  chiefComplaint: {
    type: String,
    required: true
  },
  
  // Vitals
  vitals: {
    bloodPressure: String,
    temperature: String,
    pulse: String,
    weight: String,
    height: String,
    spo2: String
  },
  
  // Medical History
  symptoms: [String],
  diagnosis: {
    type: String,
    required: true
  },
  
  // Examination Findings
  examinationFindings: String,
  
  // Prescriptions
  medicinesGiven: [medicineSchema],
  medicinesPrescribed: [medicineSchema],
  
  // Lab Tests
  labTestsRecommended: [String],
  
  // Follow-up
  followUpDate: Date,
  followUpNotes: String,
  
  // Additional Notes
  doctorNotes: String,
  
  // Billing Link
  billId: {
    type: String
  },
  billStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Unpaid'],
    default: 'Pending'
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Follow-up Required'],
    default: 'Active'
  }
}, {
  timestamps: true
});

consultationSchema.pre('save', async function(next) {
  if (!this.consultationId) {
    const count = await mongoose.model('Consultation').countDocuments();
    this.consultationId = `CON${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Consultation', consultationSchema);
