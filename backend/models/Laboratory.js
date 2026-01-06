const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
    unique: true
  },
  testName: {
    type: String,
    required: true
  },
  testCode: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    enum: ['Blood', 'Urine', 'Stool', 'Radiology', 'Pathology', 'Microbiology', 'Other'],
    required: true
  },
  description: String,
  normalRange: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    default: 1 // in days
  },
  preparationInstructions: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

labTestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('LabTest').countDocuments();
    this.testId = `TEST${String(count + 1).padStart(6, '0')}`;
    this.testCode = `LAB${String(count + 1).padStart(4, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

const labOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
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
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  tests: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    result: {
      value: String,
      unit: String,
      normalRange: String,
      interpretation: String,
      remarks: String
    },
    testedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    testedDate: Date
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Normal', 'Urgent', 'STAT'],
    default: 'Normal'
  },
  sampleCollectedDate: Date,
  reportDate: Date,
  reportFile: {
    fileName: String,
    filePath: String,
    uploadedAt: Date
  },
  notes: String,
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

labOrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('LabOrder').countDocuments();
    this.orderId = `LAB${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

const LabTest = mongoose.model('LabTest', labTestSchema);
const LabOrder = mongoose.model('LabOrder', labOrderSchema);

module.exports = { LabTest, LabOrder };
