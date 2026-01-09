import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { exportToCSV, formatDate, calculateAge } from '../../utils/helpers';
import { getAllPatients } from '../../data/mockData';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    // DEMO MODE - Get patients from localStorage with search filter
    setLoading(true);
    setTimeout(() => {
      const allPatients = getAllPatients();
      const filtered = allPatients.filter(p => 
        !search || 
        (p.firstName && p.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (p.lastName && p.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (p.patientId && p.patientId.toLowerCase().includes(search.toLowerCase()))
      );
      setPatients(filtered);
      setLoading(false);
    }, 300);
  };

  const handleExport = () => {
    const exportData = patients.map(p => ({
      'Patient ID': p.patientId,
      'Name': `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      'Age': calculateAge(p.dateOfBirth),
      'Gender': p.gender,
      'Phone': p.phoneNumber,
      'Email': p.email || '',
      'Blood Group': p.bloodGroup || '',
      'Registered': formatDate(p.createdAt)
    }));
    exportToCSV(exportData, 'patients');
    toast.success('Exported successfully!');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="container list-page-container">
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        padding: '1.5rem',
        background: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#1f2937',
            margin: 0,
            marginBottom: '0.25rem'
          }}>Patient Records</h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            margin: 0
          }}>Manage patient information and records</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExport} 
            style={{
              padding: '0.625rem 1.25rem',
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Export CSV
          </button>
          <Link 
            to="/patients/new" 
            style={{
              textDecoration: 'none',
              padding: '0.625rem 1.25rem',
              background: '#1f2937',
              color: '#fff',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1f2937';
            }}
          >
            Add New Patient
          </Link>
        </div>
      </div>

      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <input
          type="text"
          placeholder="Search by name, ID, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#1f2937';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
          }}
        />
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        {patients.length > 0 ? (
          <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '900px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Patient ID
                  </th>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Full Name
                  </th>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Age / Gender
                  </th>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Phone Number
                  </th>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Blood Group
                  </th>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Registered Date
                  </th>
                  <th style={{ 
                    padding: '0.875rem 1.5rem', 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    color: '#6b7280', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr 
                    key={patient._id}
                    style={{ 
                      borderBottom: index < patients.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      fontSize: '0.875rem', 
                      color: '#1f2937',
                      fontWeight: '600'
                    }}>
                      {patient.patientId}
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      fontSize: '0.875rem', 
                      color: '#1f2937'
                    }}>
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      fontSize: '0.875rem', 
                      color: '#6b7280'
                    }}>
                      {calculateAge(patient.dateOfBirth)} years / {patient.gender}
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      fontSize: '0.875rem', 
                      color: '#6b7280'
                    }}>
                      {patient.phoneNumber}
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      fontSize: '0.875rem'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: '#f9fafb',
                        color: '#1f2937',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '1px solid #e5e7eb'
                      }}>
                        {patient.bloodGroup || 'N/A'}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      fontSize: '0.875rem', 
                      color: '#6b7280'
                    }}>
                      {formatDate(patient.createdAt)}
                    </td>
                    <td style={{ 
                      padding: '1rem 1.5rem'
                    }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          to={`/patients/edit/${patient._id}`} 
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: '#f9fafb',
                            color: '#1f2937',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1f2937';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.color = '#1f2937';
                          }}
                          title="View/Edit"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center' 
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              No Patients Found
            </h3>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}>
              No patients match your search criteria. Try adjusting your search or add a new patient.
            </p>
            <Link 
              to="/patients/new" 
              style={{
                textDecoration: 'none',
                padding: '0.625rem 1.25rem',
                background: '#1f2937',
                color: '#fff',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1f2937';
              }}
            >
              Add First Patient
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
