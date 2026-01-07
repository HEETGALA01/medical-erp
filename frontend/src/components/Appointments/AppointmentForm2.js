import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPatients } from '../../data/mockData';
import './AppointmentForm2.css';

function AppointmentForm() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    department: 'General Medicine',
    reason: '',
    status: 'Scheduled',
    notes: ''
  });

  useEffect(() => {
    const allPatients = getAllPatients();
    setPatients(allPatients);
  }, []);

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p._id === patientId);
    setFormData({
      ...formData,
      patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.doctorName || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill all required fields');
      return;
    }

    const newAppointment = {
      _id: Date.now().toString(),
      appointmentId: `APT${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
    existingAppointments.push(newAppointment);
    localStorage.setItem('mockAppointments', JSON.stringify(existingAppointments));

    toast.success('Appointment created successfully!');
    navigate('/appointments');
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1>📅 Book New Appointment</h1>
          <p>Schedule a patient appointment with a doctor</p>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Patient Selection */}
          <div className="form-section">
            <h2>👤 Patient Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Select Patient *</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.firstName} {patient.lastName} - {patient.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="form-section">
            <h2>🏥 Appointment Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Doctor Name *</label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Rajesh Kumar"
                  required
                />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Dentistry">Dentistry</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Appointment Time *</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Visit</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the reason for visit"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional notes or special requirements"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/appointments')}>
              ❌ Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              ✅ Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;
