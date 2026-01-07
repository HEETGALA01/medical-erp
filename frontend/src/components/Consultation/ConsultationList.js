import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function ConsultationList() {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [consultations, searchTerm, filterStatus]);

  const loadConsultations = () => {
    const stored = JSON.parse(localStorage.getItem('consultations') || '[]');
    setConsultations(stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const filterConsultations = () => {
    let filtered = [...consultations];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(c => c.billStatus === filterStatus);
    }

    setFilteredConsultations(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this consultation record?')) {
      const updated = consultations.filter(c => c._id !== id);
      localStorage.setItem('consultations', JSON.stringify(updated));
      setConsultations(updated);
      toast.success('Consultation deleted successfully');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0891b2', marginBottom: '0.5rem' }}>
          📝 Patient Records
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          View and manage all patient consultation records
        </p>
      </div>

      {/* Action Bar */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search by patient, doctor, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '2px solid #e2e8f0',
            fontSize: '1rem'
          }}
        />
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '2px solid #e2e8f0',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending Bills</option>
          <option value="Paid">Paid Bills</option>
        </select>

        <Link
          to="/consultations/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          + New Record
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', padding: '1.5rem', borderRadius: '1rem', color: 'white', boxShadow: '0 10px 20px rgba(8, 145, 178, 0.3)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {consultations.length}
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total Records</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', padding: '1.5rem', borderRadius: '1rem', color: 'white', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {consultations.filter(c => c.billStatus === 'Pending').length}
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>Pending Bills</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', padding: '1.5rem', borderRadius: '1rem', color: 'white', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {consultations.filter(c => c.billStatus === 'Paid').length}
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>Paid Bills</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', padding: '1.5rem', borderRadius: '1rem', color: 'white', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {consultations.filter(c => c.labTestsRequired).length}
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>With Lab Tests</div>
        </div>
      </div>

      {/* Consultations Table */}
      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
        {filteredConsultations.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#64748b' }}>
              No consultation records found
            </h3>
            <p>Start by creating a new patient record</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Patient</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Doctor</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Diagnosis</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Lab Tests</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Bill Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((consultation, index) => (
                  <tr
                    key={consultation._id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: index % 2 === 0 ? '#f8fafc' : 'white',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#f8fafc' : 'white'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{formatDate(consultation.createdAt)}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {consultation.consultationId}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', color: '#0891b2' }}>
                        {consultation.patientName}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: '#64748b' }}>{consultation.doctorName}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        color: '#475569'
                      }}>
                        {consultation.diagnosis}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {consultation.labTestsRequired ? (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.5rem',
                          background: '#ddd6fe',
                          color: '#7c3aed',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {consultation.labTests?.length || 0} Tests
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        background: consultation.billStatus === 'Paid' ? '#d1fae5' : '#fef3c7',
                        color: consultation.billStatus === 'Paid' ? '#065f46' : '#92400e',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {consultation.billStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#0891b2' }}>
                      ₹{consultation.billAmount || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <Link
                          to={`/consultations/edit/${consultation._id}`}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#0891b2',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#06b6d4'}
                          onMouseLeave={(e) => e.target.style.background = '#0891b2'}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(consultation._id)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationList;
