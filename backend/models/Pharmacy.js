const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  genericName: String,
  manufacturer: String,
  category: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Other'],
    required: true
  },
  dosageForm: String,
  strength: String,
  batchNumber: String,
  expiryDate: Date,
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  reorderLevel: {
    type: Number,
    default: 10
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  gstRate: {
    type: Number,
    default: 0
  },
  rackLocation: String,
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

medicineSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Medicine').countDocuments();
    this.medicineId = `MED${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

const pharmacySaleSchema = new mongoose.Schema({
  saleId: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  items: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  gst: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking'],
    default: 'Cash'
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

pharmacySaleSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('PharmacySale').countDocuments();
    this.saleId = `SALE${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Medicine = mongoose.model('Medicine', medicineSchema);
const PharmacySale = mongoose.model('PharmacySale', pharmacySaleSchema);

module.exports = { Medicine, PharmacySale };
