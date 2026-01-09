import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPatients } from '../../data/mockData';

function ConsultationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorName: '',
    consultationDate: new Date().toISOString().split('T')[0],
    
    // Diagnosis
    symptoms: '',
    diagnosis: '',
    examinationFindings: '',
    
    // Medicines Given from Clinic
    medicinesGiven: [],
    
    // Medicines Prescribed (to buy outside)
    medicinesPrescribed: [],
    
    // Lab Tests with scheduling
    labTests: [],
    
    // Follow-up
    followUpDate: '',
    followUpTime: '',
    followUpNotes: '',
    
    status: 'Active'
  });

  const [multipleMedicineInput, setMultipleMedicineInput] = useState({
    given: '',
    prescribed: ''
  });

  const availableLabTests = [
    'CBC (Complete Blood Count)',
    'Blood Sugar (Fasting)',
    'Blood Sugar (Random)',
    'HbA1c',
    'Lipid Profile',
    'Liver Function Test (LFT)',
    'Kidney Function Test (KFT)',
    'Thyroid Profile (T3, T4, TSH)',
    'Urine Routine',
    'X-Ray Chest',
    'X-Ray Other',
    'ECG',
    'Ultrasound',
    'CT Scan',
    'MRI',
    'Other'
  ];

  useEffect(() => {
    const allPatients = getAllPatients();
    setPatients(allPatients);
    
    if (isEdit) {
      loadConsultation();
    }
  }, [id]);

  const loadConsultation = () => {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    const consultation = consultations.find(c => c._id === id);
    
    if (consultation) {
      setFormData({
        ...consultation,
        symptoms: consultation.symptoms?.join(', ') || '',
        labTests: consultation.labTests || [],
        medicinesGiven: consultation.medicinesGiven || [],
        medicinesPrescribed: consultation.medicinesPrescribed || []
      });
    }
  };

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

  // Medicine Management
  const addMedicineGiven = () => {
    setFormData({
      ...formData,
      medicinesGiven: [
        ...formData.medicinesGiven,
        { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', givenFromClinic: true, quantity: 1 }
      ]
    });
  };

  const addMedicinePrescribed = () => {
    setFormData({
      ...formData,
      medicinesPrescribed: [
        ...formData.medicinesPrescribed,
        { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', givenFromClinic: false, quantity: 0 }
      ]
    });
  };

  const updateMedicineGiven = (index, field, value) => {
    const updated = [...formData.medicinesGiven];
    updated[index][field] = value;
    setFormData({ ...formData, medicinesGiven: updated });
  };

  const updateMedicinePrescribed = (index, field, value) => {
    const updated = [...formData.medicinesPrescribed];
    updated[index][field] = value;
    setFormData({ ...formData, medicinesPrescribed: updated });
  };

  const removeMedicineGiven = (index) => {
    const updated = formData.medicinesGiven.filter((_, i) => i !== index);
    setFormData({ ...formData, medicinesGiven: updated });
  };

  const removeMedicinePrescribed = (index) => {
    const updated = formData.medicinesPrescribed.filter((_, i) => i !== index);
    setFormData({ ...formData, medicinesPrescribed: updated });
  };

  // Add multiple medicines at once
  const addMultipleMedicinesGiven = () => {
    if (!multipleMedicineInput.given.trim()) return;
    
    const medicineNames = multipleMedicineInput.given.split(',').map(name => name.trim()).filter(name => name);
    const newMedicines = medicineNames.map(name => ({
      medicineName: name,
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      givenFromClinic: true,
      quantity: 1
    }));
    
    setFormData({
      ...formData,
      medicinesGiven: [...formData.medicinesGiven, ...newMedicines]
    });
    
    setMultipleMedicineInput({ ...multipleMedicineInput, given: '' });
    toast.success(`${medicineNames.length} medicine(s) added!`);
  };

  const addMultipleMedicinesPrescribed = () => {
    if (!multipleMedicineInput.prescribed.trim()) return;
    
    const medicineNames = multipleMedicineInput.prescribed.split(',').map(name => name.trim()).filter(name => name);
    const newMedicines = medicineNames.map(name => ({
      medicineName: name,
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      givenFromClinic: false,
      quantity: 0
    }));
    
    setFormData({
      ...formData,
      medicinesPrescribed: [...formData.medicinesPrescribed, ...newMedicines]
    });
    
    setMultipleMedicineInput({ ...multipleMedicineInput, prescribed: '' });
    toast.success(`${medicineNames.length} medicine(s) added!`);
  };

  // Lab Test Management
  const addLabTest = () => {
    setFormData({
      ...formData,
      labTests: [
        ...formData.labTests,
        { 
          testName: '', 
          scheduledDate: '', 
          scheduledTime: '', 
          status: 'Pending',
          notes: ''
        }
      ]
    });
  };

  const updateLabTest = (index, field, value) => {
    const updated = [...formData.labTests];
    updated[index][field] = value;
    setFormData({ ...formData, labTests: updated });
  };

  const removeLabTest = (index) => {
    const updated = formData.labTests.filter((_, i) => i !== index);
    setFormData({ ...formData, labTests: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.doctorName || !formData.diagnosis) {
      toast.error('Please fill all required fields');
      return;
    }

    const consultationData = {
      _id: isEdit ? id : Date.now().toString(),
      consultationId: isEdit ? formData.consultationId : `CON${Date.now()}`,
      ...formData,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(s => s),
      createdAt: isEdit ? formData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    
    if (isEdit) {
      const index = consultations.findIndex(c => c._id === id);
      consultations[index] = consultationData;
      toast.success('Consultation updated successfully!');
    } else {
      consultations.push(consultationData);
      toast.success('Consultation saved successfully!');
    }
    
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    // Save lab tests to laboratory module
    if (consultationData.labTests && consultationData.labTests.length > 0) {
      saveLabTestsToLaboratory(consultationData);
    }
    
    navigate('/consultations');
  };

  const saveLabTestsToLaboratory = (consultation) => {
    const labTests = JSON.parse(localStorage.getItem('labTests') || '[]');
    
    consultation.labTests.forEach(test => {
      if (test.testName && test.scheduledDate) {
        const labTest = {
          _id: `LAB${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          patientId: consultation.patientId,
          patientName: consultation.patientName,
          testName: test.testName,
          consultationId: consultation.consultationId,
          scheduledDate: test.scheduledDate,
          scheduledTime: test.scheduledTime || '09:00',
          status: test.status || 'Pending',
          notes: test.notes || '',
          doctorName: consultation.doctorName,
          createdAt: new Date().toISOString()
        };
        
        // Check if test already exists (for edit mode)
        const existingIndex = labTests.findIndex(
          lt => lt.consultationId === consultation.consultationId && lt.testName === test.testName
        );
        
        if (existingIndex >= 0) {
          labTests[existingIndex] = { ...labTests[existingIndex], ...labTest };
        } else {
          labTests.push(labTest);
        }
      }
    });
    
    localStorage.setItem('labTests', JSON.stringify(labTests));
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.5rem', color: '#1f2937' },
    form: { background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb' },
    section: { marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' },
    sectionTitle: { fontSize: '1.125rem', fontWeight: '700', marginBottom: '1.25rem', color: '#1f2937' },
    formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontWeight: '600', fontSize: '0.875rem', color: '#1f2937' },
    input: { padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', background: '#ffffff' },
    textarea: { padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', background: '#ffffff', minHeight: '100px' },
    medicineCard: { background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #e5e7eb' },
    addButton: { padding: '0.625rem 1.25rem', background: '#1f2937', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' },
    removeButton: { padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{isEdit ? 'Edit' : 'New'} Patient Consultation</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Patient Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Patient Information</h2>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Patient *</label>
              <select name="patientId" value={formData.patientId} onChange={handlePatientChange} style={styles.input} required disabled={isEdit}>
                <option value="">-- Select Patient --</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName} - {patient.phoneNumber}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Doctor Name *</label>
              <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} style={styles.input} placeholder="e.g., Dr. Sharma" required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Consultation Date *</label>
              <input type="date" name="consultationDate" value={formData.consultationDate} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Diagnosis & Examination</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Symptoms (comma separated)</label>
            <input type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} style={styles.input} placeholder="e.g., Fever, Cough, Headache" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Diagnosis *</label>
            <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} style={styles.textarea} placeholder="Enter the diagnosis" required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Examination Findings</label>
            <textarea name="examinationFindings" value={formData.examinationFindings} onChange={handleChange} style={styles.textarea} placeholder="Physical examination findings" />
          </div>
        </div>

        {/* Medicines Given from Clinic */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Medicines Given from Clinic</h2>
          <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>Medicines provided directly from clinic pharmacy</p>
          
          {/* Add Multiple Medicines */}
          <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
            <label style={styles.label}>Add Multiple Medicines (comma separated)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                value={multipleMedicineInput.given}
                onChange={(e) => setMultipleMedicineInput({ ...multipleMedicineInput, given: e.target.value })}
                style={{ ...styles.input, flex: 1 }} 
                placeholder="e.g., Paracetamol, Amoxicillin, Cetirizine" 
              />
              <button type="button" onClick={addMultipleMedicinesGiven} style={{
                ...styles.addButton,
                background: '#3b82f6',
                whiteSpace: 'nowrap'
              }}>
                Add All
              </button>
            </div>
          </div>

          {formData.medicinesGiven.map((medicine, index) => (
            <div key={index} style={styles.medicineCard}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Medicine Name</label>
                  <input type="text" value={medicine.medicineName} onChange={(e) => updateMedicineGiven(index, 'medicineName', e.target.value)} style={styles.input} placeholder="Medicine name" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dosage</label>
                  <input type="text" value={medicine.dosage} onChange={(e) => updateMedicineGiven(index, 'dosage', e.target.value)} style={styles.input} placeholder="e.g., 500mg" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Frequency</label>
                  <input type="text" value={medicine.frequency} onChange={(e) => updateMedicineGiven(index, 'frequency', e.target.value)} style={styles.input} placeholder="e.g., 3 times daily" />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Duration</label>
                  <input type="text" value={medicine.duration} onChange={(e) => updateMedicineGiven(index, 'duration', e.target.value)} style={styles.input} placeholder="e.g., 5 days" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Quantity Given</label>
                  <input type="number" value={medicine.quantity} onChange={(e) => updateMedicineGiven(index, 'quantity', e.target.value)} style={styles.input} placeholder="Quantity" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Instructions</label>
                  <input type="text" value={medicine.instructions} onChange={(e) => updateMedicineGiven(index, 'instructions', e.target.value)} style={styles.input} placeholder="After meals, etc." />
                </div>
              </div>
              <button type="button" onClick={() => removeMedicineGiven(index)} style={styles.removeButton}>Remove Medicine</button>
            </div>
          ))}
          <button type="button" onClick={addMedicineGiven} style={styles.addButton}>+ Add Single Medicine</button>
        </div>

        {/* Medicines Prescribed (To Buy Outside) */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Medicines Prescribed (To Buy from Outside)</h2>
          <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>Medicines patient needs to purchase from external pharmacy</p>
          
          {/* Add Multiple Medicines */}
          <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fde68a' }}>
            <label style={styles.label}>Add Multiple Medicines (comma separated)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                value={multipleMedicineInput.prescribed}
                onChange={(e) => setMultipleMedicineInput({ ...multipleMedicineInput, prescribed: e.target.value })}
                style={{ ...styles.input, flex: 1 }} 
                placeholder="e.g., Paracetamol, Amoxicillin, Cetirizine" 
              />
              <button type="button" onClick={addMultipleMedicinesPrescribed} style={{
                ...styles.addButton,
                background: '#f59e0b',
                whiteSpace: 'nowrap'
              }}>
                Add All
              </button>
            </div>
          </div>

          {formData.medicinesPrescribed.map((medicine, index) => (
            <div key={index} style={styles.medicineCard}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Medicine Name</label>
                  <input type="text" value={medicine.medicineName} onChange={(e) => updateMedicinePrescribed(index, 'medicineName', e.target.value)} style={styles.input} placeholder="Medicine name" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dosage</label>
                  <input type="text" value={medicine.dosage} onChange={(e) => updateMedicinePrescribed(index, 'dosage', e.target.value)} style={styles.input} placeholder="e.g., 500mg" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Frequency</label>
                  <input type="text" value={medicine.frequency} onChange={(e) => updateMedicinePrescribed(index, 'frequency', e.target.value)} style={styles.input} placeholder="e.g., 3 times daily" />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Duration</label>
                  <input type="text" value={medicine.duration} onChange={(e) => updateMedicinePrescribed(index, 'duration', e.target.value)} style={styles.input} placeholder="e.g., 5 days" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Instructions</label>
                  <input type="text" value={medicine.instructions} onChange={(e) => updateMedicinePrescribed(index, 'instructions', e.target.value)} style={styles.input} placeholder="After meals, etc." />
                </div>
              </div>
              <button type="button" onClick={() => removeMedicinePrescribed(index)} style={styles.removeButton}>Remove Medicine</button>
            </div>
          ))}
          <button type="button" onClick={addMedicinePrescribed} style={styles.addButton}>+ Add Single Medicine</button>
        </div>

        {/* Lab Tests & Follow-up */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Lab Tests & Follow-up</h2>
          <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>Schedule lab tests with date and time - will appear in Laboratory module</p>
          
          {formData.labTests.map((test, index) => (
            <div key={index} style={styles.medicineCard}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Lab Test *</label>
                  <select 
                    value={test.testName} 
                    onChange={(e) => updateLabTest(index, 'testName', e.target.value)} 
                    style={styles.input}
                    required
                  >
                    <option value="">-- Select Test --</option>
                    {availableLabTests.map((testName, idx) => (
                      <option key={idx} value={testName}>{testName}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Scheduled Date *</label>
                  <input 
                    type="date" 
                    value={test.scheduledDate} 
                    onChange={(e) => updateLabTest(index, 'scheduledDate', e.target.value)} 
                    style={styles.input} 
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Scheduled Time</label>
                  <input 
                    type="time" 
                    value={test.scheduledTime} 
                    onChange={(e) => updateLabTest(index, 'scheduledTime', e.target.value)} 
                    style={styles.input} 
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select 
                    value={test.status} 
                    onChange={(e) => updateLabTest(index, 'status', e.target.value)} 
                    style={styles.input}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Notes</label>
                  <input 
                    type="text" 
                    value={test.notes} 
                    onChange={(e) => updateLabTest(index, 'notes', e.target.value)} 
                    style={styles.input} 
                    placeholder="Any special instructions"
                  />
                </div>
              </div>
              <button type="button" onClick={() => removeLabTest(index)} style={styles.removeButton}>Remove Test</button>
            </div>
          ))}
          <button type="button" onClick={addLabTest} style={styles.addButton}>+ Add Lab Test</button>
        </div>

        {/* Status */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Consultation Status</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Follow-up Required">Follow-up Required</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/consultations')} style={{
            padding: '0.625rem 1.25rem',
            background: '#f9fafb',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{
            padding: '0.625rem 1.25rem',
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            {isEdit ? 'Update' : 'Save'} Consultation
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationForm;
