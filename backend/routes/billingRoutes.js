const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const { authenticate, authorize } = require('../middleware/auth');

// Get all bills
router.get('/', authenticate, async (req, res) => {
  try {
    const { patient, paymentStatus, startDate, endDate } = req.query;
    let query = {};

    if (patient) query.patient = patient;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (startDate && endDate) {
      query.billDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const bills = await Billing.find(query)
      .populate('patient', 'fullName patientId phoneNumber')
      .populate('generatedBy', 'fullName')
      .sort({ billDate: -1 });

    res.json({ bills });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error: error.message });
  }
});

// Get single bill
router.get('/:id', authenticate, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('patient')
      .populate('appointment')
      .populate('consultation')
      .populate('generatedBy', 'fullName');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ bill });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill', error: error.message });
  }
});

// Create new bill
router.post('/', authenticate, authorize('Admin', 'Receptionist'), async (req, res) => {
  try {
    const { items, discount, tax } = req.body;

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    // Calculate total
    const totalAmount = subtotal - (discount || 0) + (tax || 0);

    const billData = {
      ...req.body,
      subtotal,
      totalAmount,
      balanceDue: totalAmount - (req.body.amountPaid || 0),
      paymentStatus: (req.body.amountPaid || 0) >= totalAmount ? 'Paid' : 
                     (req.body.amountPaid || 0) > 0 ? 'Partial' : 'Unpaid',
      generatedBy: req.user._id
    };

    const bill = new Billing(billData);
    await bill.save();

    const populatedBill = await Billing.findById(bill._id)
      .populate('patient', 'fullName patientId');

    res.status(201).json({ 
      message: 'Bill generated successfully', 
      bill: populatedBill 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
});

// Update bill/payment
router.put('/:id', authenticate, authorize('Admin', 'Receptionist'), async (req, res) => {
  try {
    const { amountPaid } = req.body;
    
    const bill = await Billing.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    const newAmountPaid = bill.amountPaid + (amountPaid || 0);
    const balanceDue = bill.totalAmount - newAmountPaid;
    const paymentStatus = balanceDue <= 0 ? 'Paid' : newAmountPaid > 0 ? 'Partial' : 'Unpaid';

    const updatedBill = await Billing.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        amountPaid: newAmountPaid,
        balanceDue,
        paymentStatus,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    ).populate('patient', 'fullName patientId');

    res.json({ message: 'Bill updated successfully', bill: updatedBill });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bill', error: error.message });
  }
});

// Get payment statistics
router.get('/stats/revenue', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchQuery = {};

    if (startDate && endDate) {
      matchQuery.billDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const stats = await Billing.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$amountPaid' },
          totalDue: { $sum: '$balanceDue' },
          billCount: { $sum: 1 }
        }
      }
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
