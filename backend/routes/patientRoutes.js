const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authenticate, authorize } = require('../middleware/auth');

// Get all patients
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, isActive } = req.query;
    let query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Get single patient
router.get('/:id', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('registeredBy', 'fullName');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

// Create new patient
router.post('/', authenticate, authorize('Admin', 'Receptionist', 'Doctor'), async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      registeredBy: req.user._id
    };

    const patient = new Patient(patientData);
    await patient.save();

    res.status(201).json({ 
      message: 'Patient registered successfully', 
      patient 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
});

// Update patient
router.put('/:id', authenticate, authorize('Admin', 'Receptionist', 'Doctor'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete patient (soft delete)
router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

module.exports = router;
