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
    chiefComplaint: '',
    symptoms: '',
    diagnosis: '',
    prescribedMedicines: [],
    dispensedMedicines: [],
    vitals: {
      bloodPressure: '',
      temperature: '',
      pulse: '',
      weight: '',
      height: ''
    },
    labTestsRequired: false,
    labTests: [],
    notes: '',
    billAmount: 0,
    billStatus: 'Pending',
    followUpDate: '',
    status: 'Active'
  });

  const availableMedicines = [
    'Paracetamol 500mg', 'Ibuprofen 400mg', 'Amoxicillin 500mg',
    'Azithromycin 250mg', 'Cetirizine 10mg', 'Omeprazole 20mg',
    'Metformin 500mg', 'Amlodipine 5mg', 'Atorvastatin 10mg',
    'Pantoprazole 40mg', 'Cough Syrup', 'Vitamin D3'
  ];

  const availableLabTests = [
    'Complete Blood Count (CBC)',
    'Blood Sugar (Fasting)',
    'Blood Sugar (Random)',
    'HbA1c',
    'Lipid Profile',
    'Liver Function Test (LFT)',
    'Kidney Function Test (KFT)',
    'Thyroid Profile (T3, T4, TSH)',
    'Urine Routine',
    'X-Ray Chest',
    'ECG',
    'Ultrasound Abdomen'
  ];

  useEffect(() => {
    const allPatients = getAllPatients();
    setPatients(allPatients);

    if (isEdit) {
      const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
      const consultation = consultations.find(c => c._id === id);
      if (consultation) {
        setFormData(consultation);
      }
    }
  }, [isEdit, id]);

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
    const { name, value, type, checked } = e.target;
    if (name.startsWith('vitals.')) {
      const vitalKey = name.split('.')[1];
      setFormData({
        ...formData,
        vitals: { ...formData.vitals, [vitalKey]: value }
      });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addPrescribedMedicine = () => {
    setFormData({
      ...formData,
      prescribedMedicines: [...formData.prescribedMedicines, { name: '', dosage: '', duration: '', instructions: '', dispensed: false }]
    });
  };

  const removePrescribedMedicine = (index) => {
    const updated = formData.prescribedMedicines.filter((_, i) => i !== index);
    setFormData({ ...formData, prescribedMedicines: updated });
  };

  const updatePrescribedMedicine = (index, field, value) => {
    const updated = [...formData.prescribedMedicines];
    updated[index][field] = value;
    setFormData({ ...formData, prescribedMedicines: updated });
  };

  const addDispensedMedicine = () => {
    setFormData({
      ...formData,
      dispensedMedicines: [...formData.dispensedMedicines, { name: '', quantity: '', givenBy: 'Clinic' }]
    });
  };

  const removeDispensedMedicine = (index) => {
    const updated = formData.dispensedMedicines.filter((_, i) => i !== index);
    setFormData({ ...formData, dispensedMedicines: updated });
  };

  const updateDispensedMedicine = (index, field, value) => {
    const updated = [...formData.dispensedMedicines];
    updated[index][field] = value;
    setFormData({ ...formData, dispensedMedicines: updated });
  };

  const addLabTest = () => {
    setFormData({
      ...formData,
      labTests: [...formData.labTests, { testName: '', status: 'Pending', orderedDate: new Date().toISOString() }]
    });
  };

  const removeLabTest = (index) => {
    const updated = formData.labTests.filter((_, i) => i !== index);
    setFormData({ ...formData, labTests: updated });
  };

  const updateLabTest = (index, field, value) => {
    const updated = [...formData.labTests];
    updated[index][field] = value;
    setFormData({ ...formData, labTests: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.doctorName || !formData.diagnosis) {
      toast.error('Please fill all required fields');
      return;
    }

    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    
    if (isEdit) {
      const index = consultations.findIndex(c => c._id === id);
      if (index !== -1) {
        consultations[index] = { ...formData, updatedAt: new Date().toISOString() };
      }
      toast.success('Consultation updated successfully!');
    } else {
      const newConsultation = {
        _id: Date.now().toString(),
        consultationId: `CON${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      consultations.push(newConsultation);
      toast.success('Consultation saved successfully!');
    }

    localStorage.setItem('consultations', JSON.stringify(consultations));

    // Save billing record
    if (formData.billAmount > 0) {
      const billings = JSON.parse(localStorage.getItem('mockBillings') || '[]');
      const billExists = billings.find(b => b.consultationId === (isEdit ? id : Date.now().toString()));
      
      if (!billExists) {
        const newBill = {
          _id: `B${Date.now()}`,
          billNumber: `BILL${Date.now()}`,
          patientId: formData.patientId,
          patientName: formData.patientName,
          consultationId: isEdit ? id : Date.now().toString(),
          items: [
            { description: 'Consultation Fee', quantity: 1, rate: formData.billAmount, amount: formData.billAmount }
          ],
          subtotal: formData.billAmount,
          discount: 0,
          tax: 0,
          total: formData.billAmount,
          status: formData.billStatus,
          paymentMethod: formData.billStatus === 'Paid' ? 'Cash' : '',
          createdAt: new Date().toISOString()
        };
        billings.push(newBill);
        localStorage.setItem('mockBillings', JSON.stringify(billings));
      }
    }

    // Save lab test records
    if (formData.labTestsRequired && formData.labTests.length > 0) {
      const labTests = JSON.parse(localStorage.getItem('labTests') || '[]');
      
      formData.labTests.forEach(test => {
        const testExists = labTests.find(lt => 
          lt.patientId === formData.patientId && 
          lt.testName === test.testName &&
          lt.consultationId === (isEdit ? id : Date.now().toString())
        );
        
        if (!testExists) {
          labTests.push({
            _id: `LAB${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            patientId: formData.patientId,
            patientName: formData.patientName,
            consultationId: isEdit ? id : Date.now().toString(),
            testName: test.testName,
            status: test.status || 'Pending',
            orderedBy: formData.doctorName,
            orderedDate: test.orderedDate || new Date().toISOString(),
            result: '',
            remarks: ''
          });
        }
      });
      
      localStorage.setItem('labTests', JSON.stringify(labTests));
    }

    navigate('/consultations');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0891b2', marginBottom: '0.5rem' }}>
          {isEdit ? '📝 Edit Patient Record' : '📝 New Patient Record'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Record patient consultation, diagnosis, and treatment
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
        
        {/* Patient Information */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
            👤 Patient Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Select Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handlePatientChange}
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
                required
                disabled={isEdit}
              >
                <option value="">-- Select Patient --</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName} - {patient.phoneNumber}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Doctor Name *</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
                placeholder="e.g., Dr. Rajesh Kumar"
                required
              />
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
            🩺 Vitals
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>BP (mmHg)</label>
              <input
                type="text"
                name="vitals.bloodPressure"
                value={formData.vitals.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Temperature (°F)</label>
              <input
                type="text"
                name="vitals.temperature"
                value={formData.vitals.temperature}
                onChange={handleChange}
                placeholder="98.6"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Pulse (bpm)</label>
              <input
                type="text"
                name="vitals.pulse"
                value={formData.vitals.pulse}
                onChange={handleChange}
                placeholder="72"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Weight (kg)</label>
              <input
                type="text"
                name="vitals.weight"
                value={formData.vitals.weight}
                onChange={handleChange}
                placeholder="70"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Height (cm)</label>
              <input
                type="text"
                name="vitals.height"
                value={formData.vitals.height}
                onChange={handleChange}
                placeholder="170"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              />
            </div>
          </div>
        </div>

        {/* Chief Complaint & Diagnosis */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
            📋 Diagnosis
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Chief Complaint *</label>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleChange}
                rows="2"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc', fontFamily: 'inherit' }}
                placeholder="Patient's main concern..."
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Symptoms</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="2"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc', fontFamily: 'inherit' }}
                placeholder="List of symptoms observed..."
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Diagnosis *</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows="3"
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc', fontFamily: 'inherit' }}
                placeholder="Final diagnosis..."
                required
              />
            </div>
          </div>
        </div>

        {/* Prescribed Medicines (To Buy from Outside) */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
              💊 Prescribed Medicines (Patient to Buy)
            </h2>
            <button
              type="button"
              onClick={addPrescribedMedicine}
              style={{ padding: '0.5rem 1rem', background: '#0891b2', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
            >
              + Add Medicine
            </button>
          </div>
          {formData.prescribedMedicines.map((med, index) => (
            <div key={index} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Medicine Name</label>
                  <select
                    value={med.name}
                    onChange={(e) => updatePrescribedMedicine(index, 'name', e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #e2e8f0', background: 'white' }}
                  >
                    <option value="">Select...</option>
                    {availableMedicines.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Dosage</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updatePrescribedMedicine(index, 'dosage', e.target.value)}
                    placeholder="1-0-1"
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #e2e8f0', background: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Duration</label>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => updatePrescribedMedicine(index, 'duration', e.target.value)}
                    placeholder="5 days"
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #e2e8f0', background: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Instructions</label>
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={(e) => updatePrescribedMedicine(index, 'instructions', e.target.value)}
                    placeholder="After meals"
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #e2e8f0', background: 'white' }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePrescribedMedicine(index)}
                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Dispensed Medicines (Given at Clinic) */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
              🏥 Medicines Given at Clinic
            </h2>
            <button
              type="button"
              onClick={addDispensedMedicine}
              style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
            >
              + Add Medicine
            </button>
          </div>
          {formData.dispensedMedicines.map((med, index) => (
            <div key={index} style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Medicine Name</label>
                  <select
                    value={med.name}
                    onChange={(e) => updateDispensedMedicine(index, 'name', e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #bbf7d0', background: 'white' }}
                  >
                    <option value="">Select...</option>
                    {availableMedicines.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Quantity</label>
                  <input
                    type="text"
                    value={med.quantity}
                    onChange={(e) => updateDispensedMedicine(index, 'quantity', e.target.value)}
                    placeholder="10 tablets"
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #bbf7d0', background: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Given By</label>
                  <input
                    type="text"
                    value={med.givenBy}
                    onChange={(e) => updateDispensedMedicine(index, 'givenBy', e.target.value)}
                    placeholder="Clinic/Pharmacy"
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #bbf7d0', background: 'white' }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeDispensedMedicine(index)}
                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Lab Tests */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="labTestsRequired"
                checked={formData.labTestsRequired}
                onChange={handleChange}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                🔬 Lab Tests Required
              </span>
            </label>
            {formData.labTestsRequired && (
              <button
                type="button"
                onClick={addLabTest}
                style={{ padding: '0.5rem 1rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
              >
                + Add Test
              </button>
            )}
          </div>
          {formData.labTestsRequired && formData.labTests.map((test, index) => (
            <div key={index} style={{ background: '#faf5ff', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #e9d5ff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Test Name</label>
                  <select
                    value={test.testName}
                    onChange={(e) => updateLabTest(index, 'testName', e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #e9d5ff', background: 'white' }}
                  >
                    <option value="">Select Test...</option>
                    {availableLabTests.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Status</label>
                  <select
                    value={test.status}
                    onChange={(e) => updateLabTest(index, 'status', e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid #e9d5ff', background: 'white' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeLabTest(index)}
                style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Billing & Follow-up */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
            💰 Billing & Follow-up
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Bill Amount (₹)</label>
              <input
                type="number"
                name="billAmount"
                value={formData.billAmount}
                onChange={handleChange}
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
                placeholder="500"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Bill Status</label>
              <select
                name="billStatus"
                value={formData.billStatus}
                onChange={handleChange}
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              style={{ padding: '0.875rem', borderRadius: '0.75rem', border: '2px solid #e2e8f0', background: '#f8fafc', fontFamily: 'inherit' }}
              placeholder="Any additional notes or instructions..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/consultations')}
            style={{ padding: '0.875rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.875rem 1.5rem', borderRadius: '0.75rem', fontWeight: '600' }}
          >
            {isEdit ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationForm;
