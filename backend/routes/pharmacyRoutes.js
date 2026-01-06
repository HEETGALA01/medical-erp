const express = require('express');
const router = express.Router();
const { Medicine, PharmacySale } = require('../models/Pharmacy');
const { authenticate, authorize } = require('../middleware/auth');

// ===== MEDICINE ROUTES =====

// Get all medicines
router.get('/medicines', authenticate, async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { medicineId: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stock', '$reorderLevel'] };
    }

    const medicines = await Medicine.find(query).sort({ name: 1 });
    res.json({ medicines });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
});

// Get single medicine
router.get('/medicines/:id', authenticate, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine', error: error.message });
  }
});

// Add new medicine
router.post('/medicines', authenticate, authorize('Admin', 'Pharmacist'), async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
});

// Update medicine
router.put('/medicines/:id', authenticate, authorize('Admin', 'Pharmacist'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error: error.message });
  }
});

// ===== PHARMACY SALES ROUTES =====

// Get all sales
router.get('/sales', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, patient } = req.query;
    let query = {};

    if (patient) query.patient = patient;
    if (startDate && endDate) {
      query.saleDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const sales = await PharmacySale.find(query)
      .populate('patient', 'fullName patientId')
      .populate('items.medicine', 'name medicineId')
      .populate('soldBy', 'fullName')
      .sort({ saleDate: -1 });

    res.json({ sales });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
});

// Get single sale
router.get('/sales/:id', authenticate, async (req, res) => {
  try {
    const sale = await PharmacySale.findById(req.params.id)
      .populate('patient')
      .populate('items.medicine')
      .populate('soldBy', 'fullName')
      .populate('prescription');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json({ sale });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale', error: error.message });
  }
});

// Create new sale
router.post('/sales', authenticate, authorize('Pharmacist', 'Admin'), async (req, res) => {
  try {
    const { items } = req.body;

    // Update medicine stock
    for (let item of items) {
      const medicine = await Medicine.findById(item.medicine);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.medicine}` });
      }
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}` 
        });
      }
      medicine.stock -= item.quantity;
      await medicine.save();
    }

    const saleData = {
      ...req.body,
      soldBy: req.user._id
    };

    const sale = new PharmacySale(saleData);
    await sale.save();

    const populatedSale = await PharmacySale.findById(sale._id)
      .populate('patient', 'fullName patientId')
      .populate('items.medicine', 'name');

    res.status(201).json({ 
      message: 'Sale recorded successfully', 
      sale: populatedSale 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale', error: error.message });
  }
});

module.exports = router;
