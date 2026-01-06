const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authenticate, authorize } = require('../middleware/auth');

// Get all appointments
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, date, doctor, patient } = req.query;
    let query = {};

    if (status) query.status = status;
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'fullName patientId phoneNumber')
      .populate('doctor', 'fullName')
      .populate('scheduledBy', 'fullName')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Get single appointment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor', 'fullName')
      .populate('consultation');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
});

// Create new appointment
router.post('/', authenticate, authorize('Admin', 'Receptionist', 'Doctor'), async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      scheduledBy: req.user._id
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'fullName patientId')
      .populate('doctor', 'fullName');

    res.status(201).json({ 
      message: 'Appointment scheduled successfully', 
      appointment: populatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

// Update appointment
router.put('/:id', authenticate, authorize('Admin', 'Receptionist', 'Doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('patient', 'fullName patientId')
     .populate('doctor', 'fullName');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
});

// Cancel appointment
router.delete('/:id', authenticate, authorize('Admin', 'Receptionist', 'Doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled', updatedAt: Date.now() },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

module.exports = router;
