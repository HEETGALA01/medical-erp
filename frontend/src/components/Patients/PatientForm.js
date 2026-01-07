import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addMockPatient } from '../../data/mockData';
import './PatientForm.css';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    phoneNumber: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    bloodGroup: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    }
  });

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    // DEMO MODE - Mock patient data for editing
    toast.info('Loading patient data... (Demo Mode)');
    setTimeout(() => {
      setFormData({
        fullName: 'Sample Patient',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        phoneNumber: '+91 98765 43210',
        email: 'patient@example.com',
        address: {
          street: '123 Sample Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        bloodGroup: 'O+',
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Spouse',
          phoneNumber: '+91 98765 43211'
        }
      });
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // DEMO MODE - Add patient to localStorage
    try {
      if (isEdit) {
        toast.success('✅ Patient updated successfully! (Demo Mode)', {
          position: 'top-center',
          autoClose: 2000
        });
      } else {
        // Split fullName into firstName and lastName
        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const patientData = {
          firstName,
          lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address.street + ', ' + formData.address.city + ', ' + formData.address.state + ' ' + formData.address.pincode,
          bloodGroup: formData.bloodGroup,
          emergencyContact: formData.emergencyContact,
          allergies: [],
          chronicConditions: []
        };
        
        const newPatient = addMockPatient(patientData);
        
        toast.success(`✅ Patient registered successfully! Patient ID: ${newPatient.patientId}`, {
          position: 'top-center',
          autoClose: 3000
        });
      }
      
      setTimeout(() => {
        navigate('/patients');
      }, 1000);
    } catch (error) {
      toast.error('Error saving patient: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>{isEdit ? 'Edit Patient' : 'Register New Patient'}</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth?.split('T')[0] || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <h3>Address</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3>Emergency Contact</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Relationship</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="emergencyContact.phoneNumber"
                value={formData.emergencyContact.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Patient' : 'Register Patient'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/patients')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
