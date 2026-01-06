const express = require('express');
const router = express.Router();
const { LabTest, LabOrder } = require('../models/Laboratory');
const { authenticate, authorize } = require('../middleware/auth');

// ===== LAB TEST ROUTES =====

// Get all lab tests
router.get('/tests', authenticate, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { testName: { $regex: search, $options: 'i' } },
        { testCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;

    const tests = await LabTest.find(query).sort({ testName: 1 });
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab tests', error: error.message });
  }
});

// Get single lab test
router.get('/tests/:id', authenticate, async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    res.json({ test });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab test', error: error.message });
  }
});

// Add new lab test
router.post('/tests', authenticate, authorize('Admin', 'Lab Technician'), async (req, res) => {
  try {
    const test = new LabTest(req.body);
    await test.save();
    res.status(201).json({ message: 'Lab test added successfully', test });
  } catch (error) {
    res.status(500).json({ message: 'Error adding lab test', error: error.message });
  }
});

// Update lab test
router.put('/tests/:id', authenticate, authorize('Admin', 'Lab Technician'), async (req, res) => {
  try {
    const test = await LabTest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({ message: 'Lab test not found' });
    }

    res.json({ message: 'Lab test updated successfully', test });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lab test', error: error.message });
  }
});

// ===== LAB ORDER ROUTES =====

// Get all lab orders
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { status, patient, doctor, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    if (startDate && endDate) {
      query.orderDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const orders = await LabOrder.find(query)
      .populate('patient', 'fullName patientId phoneNumber')
      .populate('doctor', 'fullName')
      .populate('tests.test', 'testName testCode')
      .populate('orderedBy', 'fullName')
      .sort({ orderDate: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab orders', error: error.message });
  }
});

// Get single lab order
router.get('/orders/:id', authenticate, async (req, res) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate('patient')
      .populate('doctor', 'fullName')
      .populate('tests.test')
      .populate('tests.testedBy', 'fullName')
      .populate('orderedBy', 'fullName');

    if (!order) {
      return res.status(404).json({ message: 'Lab order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab order', error: error.message });
  }
});

// Create new lab order
router.post('/orders', authenticate, authorize('Doctor', 'Receptionist', 'Admin'), async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      orderedBy: req.user._id
    };

    const order = new LabOrder(orderData);
    await order.save();

    const populatedOrder = await LabOrder.findById(order._id)
      .populate('patient', 'fullName patientId')
      .populate('doctor', 'fullName')
      .populate('tests.test', 'testName');

    res.status(201).json({ 
      message: 'Lab order created successfully', 
      order: populatedOrder 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab order', error: error.message });
  }
});

// Update lab order/results
router.put('/orders/:id', authenticate, authorize('Lab Technician', 'Admin'), async (req, res) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('patient', 'fullName patientId')
     .populate('tests.test', 'testName');

    if (!order) {
      return res.status(404).json({ message: 'Lab order not found' });
    }

    res.json({ message: 'Lab order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lab order', error: error.message });
  }
});

module.exports = router;
