import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function ConsultationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultation();
  }, [id]);

  const loadConsultation = () => {
    try {
      const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
      const found = consultations.find(c => c._id === id);
      
      if (found) {
        setConsultation(found);
      } else {
        toast.error('Consultation not found');
        navigate('/consultations');
      }
    } catch (error) {
      toast.error('Error loading consultation');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    return { 
      background: '#f9fafb', 
      color: '#1f2937', 
      padding: '0.375rem 0.75rem', 
      borderRadius: '0.375rem', 
      fontWeight: '600', 
      fontSize: '0.75rem',
      border: '1px solid #e5e7eb'
    };
  };

  const getBillStatusBadge = (status) => {
    const colors = {
      'Paid': { bg: '#f0fdf4', color: '#166534' },
      'Pending': { bg: '#fef3c7', color: '#92400e' },
      'Unpaid': { bg: '#fee2e2', color: '#991b1b' }
    };
    const style = colors[status] || { bg: '#f9fafb', color: '#1f2937' };
    return { 
      background: style.bg, 
      color: style.color, 
      padding: '0.375rem 0.75rem', 
      borderRadius: '0.375rem', 
      fontWeight: '600', 
      fontSize: '0.75rem'
    };
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.25rem' }}>⏳ Loading...</div>;
  }

  if (!consultation) {
    return <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.25rem' }}>❌ Consultation not found</div>;
  }

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' },
    actions: { display: 'flex', gap: '1rem' },
    card: { background: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', marginBottom: '2rem', border: '1px solid #e5e7eb' },
    section: { marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' },
    sectionTitle: { fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' },
    row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    label: { fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
    value: { fontSize: '0.875rem', color: '#1f2937' },
    medicineCard: { background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #e5e7eb' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
    th: { padding: '0.75rem', background: '#f9fafb', textAlign: 'left', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    td: { padding: '0.75rem', borderBottom: '1px solid #f3f4f6', color: '#1f2937', fontSize: '0.875rem' },
    noPrint: { display: 'flex', gap: '1rem', marginBottom: '2rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="no-print">
        <h1 style={styles.title}>Patient Consultation Record</h1>
        <div style={styles.actions}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{
            padding: '0.625rem 1.25rem',
            background: '#f9fafb',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>Print</button>
          <Link to={`/consultations/edit/${id}`} className="btn btn-primary" style={{
            padding: '0.625rem 1.25rem',
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-block'
          }}>Edit</Link>
          <button onClick={() => navigate('/consultations')} className="btn btn-secondary" style={{
            padding: '0.625rem 1.25rem',
            background: '#f9fafb',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>Back</button>
        </div>
      </div>

      <div style={styles.card}>
        {/* Header Info */}
        <div style={styles.section}>
          <div style={styles.row}>
            <div style={styles.field}>
              <span style={styles.label}>Consultation ID</span>
              <span style={styles.value}>{consultation.consultationId}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Date</span>
              <span style={styles.value}>{new Date(consultation.consultationDate).toLocaleDateString()}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Status</span>
              <span style={getStatusBadge(consultation.status)}>{consultation.status}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Bill Status</span>
              <span style={getBillStatusBadge(consultation.billStatus)}>{consultation.billStatus}</span>
            </div>
          </div>
        </div>

        {/* Patient & Doctor Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Patient & Doctor Information</h2>
          <div style={styles.row}>
            <div style={styles.field}>
              <span style={styles.label}>Patient Name</span>
              <span style={styles.value}>{consultation.patientName}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Doctor Name</span>
              <span style={styles.value}>{consultation.doctorName}</span>
            </div>
          </div>
        </div>

        {/* Chief Complaint & Vitals */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Chief Complaint & Vitals</h2>
          <div style={styles.field}>
            <span style={styles.label}>Chief Complaint</span>
            <span style={styles.value}>{consultation.chiefComplaint}</span>
          </div>
          {consultation.vitals && (
            <div style={styles.row}>
              {consultation.vitals.bloodPressure && (
                <div style={styles.field}>
                  <span style={styles.label}>Blood Pressure</span>
                  <span style={styles.value}>{consultation.vitals.bloodPressure}</span>
                </div>
              )}
              {consultation.vitals.temperature && (
                <div style={styles.field}>
                  <span style={styles.label}>Temperature</span>
                  <span style={styles.value}>{consultation.vitals.temperature} °F</span>
                </div>
              )}
              {consultation.vitals.pulse && (
                <div style={styles.field}>
                  <span style={styles.label}>Pulse</span>
                  <span style={styles.value}>{consultation.vitals.pulse} bpm</span>
                </div>
              )}
              {consultation.vitals.weight && (
                <div style={styles.field}>
                  <span style={styles.label}>Weight</span>
                  <span style={styles.value}>{consultation.vitals.weight} kg</span>
                </div>
              )}
              {consultation.vitals.height && (
                <div style={styles.field}>
                  <span style={styles.label}>Height</span>
                  <span style={styles.value}>{consultation.vitals.height} cm</span>
                </div>
              )}
              {consultation.vitals.spo2 && (
                <div style={styles.field}>
                  <span style={styles.label}>SPO2</span>
                  <span style={styles.value}>{consultation.vitals.spo2}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Diagnosis */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Diagnosis & Examination</h2>
          {consultation.symptoms && consultation.symptoms.length > 0 && (
            <div style={styles.field}>
              <span style={styles.label}>Symptoms</span>
              <span style={styles.value}>{consultation.symptoms.join(', ')}</span>
            </div>
          )}
          <div style={styles.field}>
            <span style={styles.label}>Diagnosis</span>
            <span style={styles.value}>{consultation.diagnosis}</span>
          </div>
          {consultation.examinationFindings && (
            <div style={styles.field}>
              <span style={styles.label}>Examination Findings</span>
              <span style={styles.value}>{consultation.examinationFindings}</span>
            </div>
          )}
        </div>

        {/* Medicines Given from Clinic */}
        {consultation.medicinesGiven && consultation.medicinesGiven.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Medicines Given from Clinic</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Medicine</th>
                  <th style={styles.th}>Dosage</th>
                  <th style={styles.th}>Frequency</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {consultation.medicinesGiven.map((med, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{med.medicineName}</td>
                    <td style={styles.td}>{med.dosage}</td>
                    <td style={styles.td}>{med.frequency}</td>
                    <td style={styles.td}>{med.duration}</td>
                    <td style={styles.td}>{med.quantity}</td>
                    <td style={styles.td}>{med.instructions || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Medicines Prescribed */}
        {consultation.medicinesPrescribed && consultation.medicinesPrescribed.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Medicines Prescribed (To Buy from Outside)</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Medicine</th>
                  <th style={styles.th}>Dosage</th>
                  <th style={styles.th}>Frequency</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {consultation.medicinesPrescribed.map((med, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{med.medicineName}</td>
                    <td style={styles.td}>{med.dosage}</td>
                    <td style={styles.td}>{med.frequency}</td>
                    <td style={styles.td}>{med.duration}</td>
                    <td style={styles.td}>{med.instructions || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Lab Tests */}
        {consultation.labTestsRecommended && consultation.labTestsRecommended.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Lab Tests Recommended</h2>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {consultation.labTestsRecommended.map((test, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{test}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up */}
        {(consultation.followUpDate || consultation.followUpNotes) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Follow-up</h2>
            <div style={styles.row}>
              {consultation.followUpDate && (
                <div style={styles.field}>
                  <span style={styles.label}>Follow-up Date</span>
                  <span style={styles.value}>{new Date(consultation.followUpDate).toLocaleDateString()}</span>
                </div>
              )}
              {consultation.followUpNotes && (
                <div style={styles.field}>
                  <span style={styles.label}>Follow-up Notes</span>
                  <span style={styles.value}>{consultation.followUpNotes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Billing Information</h2>
          <div style={styles.row}>
            <div style={styles.field}>
              <span style={styles.label}>Consultation Fee</span>
              <span style={styles.value}>₹{consultation.consultationFee || 0}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Bill Status</span>
              <span style={getBillStatusBadge(consultation.billStatus)}>{consultation.billStatus}</span>
            </div>
            {consultation.billId && (
              <div style={styles.field}>
                <span style={styles.label}>Bill ID</span>
                <span style={styles.value}>{consultation.billId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Doctor's Notes */}
        {consultation.doctorNotes && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Doctor's Notes</h2>
            <div style={styles.field}>
              <span style={styles.value}>{consultation.doctorNotes}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>
          <p>Created: {new Date(consultation.createdAt).toLocaleString()}</p>
          {consultation.updatedAt && <p>Last Updated: {new Date(consultation.updatedAt).toLocaleString()}</p>}
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}

export default ConsultationView;
