const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  consultationId: {
    type: String,
    required: true,
    unique: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultationDate: {
    type: Date,
    default: Date.now
  },
  vitals: {
    temperature: { type: Number, unit: 'Celsius' },
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    pulse: { type: Number, unit: 'bpm' },
    respiratoryRate: { type: Number, unit: 'per min' },
    weight: { type: Number, unit: 'kg' },
    height: { type: Number, unit: 'cm' },
    bmi: Number,
    oxygenSaturation: { type: Number, unit: '%' }
  },
  symptoms: [String],
  diagnosis: {
    type: String,
    required: true
  },
  provisionalDiagnosis: String,
  examination: String,
  prescriptions: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  labTests: [{
    testName: String,
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    }
  }],
  followUpDate: Date,
  notes: String,
  documents: [{
    fileName: String,
    filePath: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-increment consultation ID
consultationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Consultation').countDocuments();
    this.consultationId = `CON${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Consultation', consultationSchema);
