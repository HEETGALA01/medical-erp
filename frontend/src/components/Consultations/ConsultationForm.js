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
    chiefComplaint: '',
    
    // Vitals
    bloodPressure: '',
    temperature: '',
    pulse: '',
    weight: '',
    height: '',
    spo2: '',
    
    // Diagnosis
    symptoms: '',
    diagnosis: '',
    examinationFindings: '',
    
    // Medicines Given from Clinic
    medicinesGiven: [],
    
    // Medicines Prescribed (to buy outside)
    medicinesPrescribed: [],
    
    // Lab Tests
    labTestsRecommended: '',
    
    // Follow-up
    followUpDate: '',
    followUpNotes: '',
    
    // Additional
    doctorNotes: '',
    
    // Billing
    consultationFee: 500,
    billStatus: 'Pending',
    
    status: 'Active'
  });

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
        labTestsRecommended: consultation.labTestsRecommended?.join(', ') || '',
        bloodPressure: consultation.vitals?.bloodPressure || '',
        temperature: consultation.vitals?.temperature || '',
        pulse: consultation.vitals?.pulse || '',
        weight: consultation.vitals?.weight || '',
        height: consultation.vitals?.height || '',
        spo2: consultation.vitals?.spo2 || ''
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.doctorName || !formData.chiefComplaint || !formData.diagnosis) {
      toast.error('Please fill all required fields');
      return;
    }

    const consultationData = {
      _id: isEdit ? id : Date.now().toString(),
      consultationId: isEdit ? formData.consultationId : `CON${Date.now()}`,
      ...formData,
      vitals: {
        bloodPressure: formData.bloodPressure,
        temperature: formData.temperature,
        pulse: formData.pulse,
        weight: formData.weight,
        height: formData.height,
        spo2: formData.spo2
      },
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(s => s),
      labTestsRecommended: formData.labTestsRecommended.split(',').map(s => s.trim()).filter(s => s),
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
    
    // Update billing if status changed
    if (formData.billStatus) {
      updateBillingStatus(consultationData);
    }
    
    navigate('/consultations');
  };

  const updateBillingStatus = (consultation) => {
    // This will be used to sync with billing module
    const bills = JSON.parse(localStorage.getItem('mockBillings') || '[]');
    const billIndex = bills.findIndex(b => b.consultationId === consultation.consultationId);
    
    if (billIndex >= 0) {
      bills[billIndex].status = consultation.billStatus;
      localStorage.setItem('mockBillings', JSON.stringify(bills));
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    title: { fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    form: { background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' },
    section: { marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0891b2' },
    formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' },
    input: { padding: '0.875rem 1.25rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', background: '#f8fafc' },
    textarea: { padding: '0.875rem 1.25rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', background: '#f8fafc', minHeight: '100px' },
    medicineCard: { background: '#f0f9ff', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '2px solid #bae6fd' },
    addButton: { padding: '0.75rem 1.5rem', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '600' },
    removeButton: { padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #e2e8f0' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 {isEdit ? 'Edit' : 'New'} Patient Consultation</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Patient Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👤 Patient Information</h2>
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

        {/* Chief Complaint */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🩺 Chief Complaint & Vitals</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Chief Complaint *</label>
            <textarea name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} style={styles.textarea} placeholder="What brought the patient to the clinic?" required />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Blood Pressure</label>
              <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} style={styles.input} placeholder="e.g., 120/80" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Temperature (°F)</label>
              <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} style={styles.input} placeholder="e.g., 98.6" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pulse (bpm)</label>
              <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} style={styles.input} placeholder="e.g., 72" />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight (kg)</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} style={styles.input} placeholder="e.g., 70" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Height (cm)</label>
              <input type="text" name="height" value={formData.height} onChange={handleChange} style={styles.input} placeholder="e.g., 170" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>SPO2 (%)</label>
              <input type="text" name="spo2" value={formData.spo2} onChange={handleChange} style={styles.input} placeholder="e.g., 98" />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔬 Diagnosis & Examination</h2>
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
          <h2 style={styles.sectionTitle}>💊 Medicines Given from Clinic</h2>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>Medicines provided directly from clinic pharmacy</p>
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
          <button type="button" onClick={addMedicineGiven} style={styles.addButton}>+ Add Medicine Given</button>
        </div>

        {/* Medicines Prescribed (To Buy Outside) */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📝 Medicines Prescribed (To Buy from Outside)</h2>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>Medicines patient needs to purchase from external pharmacy</p>
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
          <button type="button" onClick={addMedicinePrescribed} style={styles.addButton}>+ Add Prescribed Medicine</button>
        </div>

        {/* Lab Tests & Follow-up */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔬 Lab Tests & Follow-up</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Lab Tests Recommended (comma separated)</label>
            <input type="text" name="labTestsRecommended" value={formData.labTestsRecommended} onChange={handleChange} style={styles.input} placeholder="e.g., CBC, Blood Sugar, X-Ray" />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Follow-up Date</label>
              <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Follow-up Notes</label>
              <input type="text" name="followUpNotes" value={formData.followUpNotes} onChange={handleChange} style={styles.input} placeholder="Notes for next visit" />
            </div>
          </div>
        </div>

        {/* Billing & Notes */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Billing & Additional Notes</h2>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Consultation Fee (₹)</label>
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} style={styles.input} placeholder="500" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Bill Status</label>
              <select name="billStatus" value={formData.billStatus} onChange={handleChange} style={styles.input}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Consultation Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Follow-up Required">Follow-up Required</option>
              </select>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Doctor's Notes</label>
            <textarea name="doctorNotes" value={formData.doctorNotes} onChange={handleChange} style={styles.textarea} placeholder="Additional notes or observations" />
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/consultations')}>
            ❌ Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            ✅ {isEdit ? 'Update' : 'Save'} Consultation
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationForm;
