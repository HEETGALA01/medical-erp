const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

// Get all consultations
router.get('/', async (req, res) => {
  try {
    const { patientId, status, startDate, endDate } = req.query;
    let query = {};
    
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.consultationDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const consultations = await Consultation.find(query)
      .sort({ consultationDate: -1 });
    
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
});

// Get single consultation
router.get('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json({ consultation });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultation', error: error.message });
  }
});

// Get consultations by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.params.patientId })
      .sort({ consultationDate: -1 });
    
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient consultations', error: error.message });
  }
});

// Create new consultation
router.post('/', async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    
    res.status(201).json({
      message: 'Consultation created successfully',
      consultation
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating consultation', error: error.message });
  }
});

// Update consultation
router.put('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json({
      message: 'Consultation updated successfully',
      consultation
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating consultation', error: error.message });
  }
});

// Delete consultation
router.delete('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation', error: error.message });
  }
});

module.exports = router;
