const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');
const { authenticate, authorize } = require('../middleware/auth');

// Get all consultations
router.get('/', authenticate, async (req, res) => {
  try {
    const { patient, doctor, startDate, endDate } = req.query;
    let query = {};

    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    if (startDate && endDate) {
      query.consultationDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const consultations = await Consultation.find(query)
      .populate('patient', 'fullName patientId')
      .populate('doctor', 'fullName')
      .populate('appointment')
      .sort({ consultationDate: -1 });

    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
});

// Get single consultation
router.get('/:id', authenticate, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient')
      .populate('doctor', 'fullName')
      .populate('appointment');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json({ consultation });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultation', error: error.message });
  }
});

// Create new consultation
router.post('/', authenticate, authorize('Doctor'), async (req, res) => {
  try {
    const consultationData = {
      ...req.body,
      doctor: req.user._id
    };

    const consultation = new Consultation(consultationData);
    await consultation.save();

    // Update appointment status and link consultation
    if (req.body.appointment) {
      await Appointment.findByIdAndUpdate(req.body.appointment, {
        status: 'Completed',
        consultation: consultation._id
      });
    }

    const populatedConsultation = await Consultation.findById(consultation._id)
      .populate('patient', 'fullName patientId')
      .populate('doctor', 'fullName');

    res.status(201).json({ 
      message: 'Consultation recorded successfully', 
      consultation: populatedConsultation 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating consultation', error: error.message });
  }
});

// Update consultation
router.put('/:id', authenticate, authorize('Doctor'), async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('patient', 'fullName patientId')
     .populate('doctor', 'fullName');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json({ message: 'Consultation updated successfully', consultation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating consultation', error: error.message });
  }
});

// Get patient history
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.params.patientId })
      .populate('doctor', 'fullName')
      .sort({ consultationDate: -1 });

    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient history', error: error.message });
  }
});

module.exports = router;
