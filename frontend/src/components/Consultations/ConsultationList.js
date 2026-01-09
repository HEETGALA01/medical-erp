import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mockConsultations } from '../../data/mockData';

function ConsultationList() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = () => {
    setLoading(true);
    
    // Initialize with mock data if consultations don't exist
    let storedConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    if (storedConsultations.length === 0) {
      localStorage.setItem('consultations', JSON.stringify(mockConsultations));
      storedConsultations = mockConsultations;
    }
    
    setConsultations(storedConsultations);
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this consultation record?')) {
      const updatedConsultations = consultations.filter(con => con._id !== id);
      setConsultations(updatedConsultations);
      localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
      toast.success('Consultation deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Active': 'badge-blue',
      'Completed': 'badge-green',
      'Follow-up Required': 'badge-yellow'
    };
    return statusColors[status] || 'badge-blue';
  };

  const getBillStatusBadge = (status) => {
    const statusColors = {
      'Paid': 'badge-green',
      'Pending': 'badge-yellow',
      'Unpaid': 'badge-red'
    };
    return statusColors[status] || 'badge-yellow';
  };

  const filteredConsultations = consultations.filter(con => {
    const matchesStatus = filterStatus === 'All' ? true : con.status === filterStatus;
    const matchesSearch = searchTerm ? 
      con.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      con.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      con.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const tabs = [
    { name: 'All', count: consultations.length, color: '#1f2937' },
    { name: 'Active', count: consultations.filter(c => c.status === 'Active').length, color: '#6b7280' },
    { name: 'Completed', count: consultations.filter(c => c.status === 'Completed').length, color: '#4b5563' },
    { name: 'Follow-up Required', count: consultations.filter(c => c.status === 'Follow-up Required').length, color: '#374151' }
  ];

  if (loading) {
    return <div className="loading">Loading consultations...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ 
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
          }}>Patient Records & Consultations</h1>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            margin: 0
          }}>Manage patient consultation history and medical records</p>
        </div>
        <Link 
          to="/consultations/new" 
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
          New Patient
        </Link>
      </div>

      {/* 2x2 Grid Layout for Tabs - Outside the Box */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setFilterStatus(tab.name)}
            style={{
              padding: '1rem 1.5rem',
              background: filterStatus === tab.name ? '#1f2937' : '#fff',
              color: filterStatus === tab.name ? '#fff' : '#1f2937',
              border: `1px solid ${filterStatus === tab.name ? '#1f2937' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== tab.name) {
                e.currentTarget.style.background = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== tab.name) {
                e.currentTarget.style.background = '#fff';
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{tab.name}</span>
              <span style={{
                padding: '0.25rem 0.625rem',
                background: filterStatus === tab.name ? '#374151' : '#e5e7eb',
                color: filterStatus === tab.name ? '#fff' : '#1f2937',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {tab.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div style={{
        padding: '1rem',
        background: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.5rem'
      }}>
        <input
          type="text"
          placeholder="Search by patient, doctor, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {filteredConsultations.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            No consultation records found
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.875rem',
            marginBottom: '1.5rem'
          }}>
            Start by creating a new patient consultation
          </p>
          <Link 
            to="/consultations/new" 
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
            New Patient
          </Link>
        </div>
      ) : (
        <>
          <div style={{
            background: '#fff',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse'
            }}>
              <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Consultation ID
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Date
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Patient Name
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Doctor
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Chief Complaint
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'center', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#6b7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultations.map((consultation, index) => (
                    <tr 
                      key={consultation._id}
                      style={{ 
                        borderBottom: index < filteredConsultations.length - 1 ? '1px solid #f3f4f6' : 'none'
                      }}
                    >
                      <td style={{ 
                        padding: '0.625rem 0.75rem', 
                        fontSize: '0.8rem', 
                        color: '#1f2937',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {consultation.consultationId}
                      </td>
                      <td style={{ 
                        padding: '0.625rem 0.75rem', 
                        fontSize: '0.8rem', 
                        color: '#6b7280',
                        whiteSpace: 'nowrap'
                      }}>
                        {new Date(consultation.consultationDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                      <td style={{ 
                        padding: '0.625rem 0.75rem', 
                        fontSize: '0.8rem', 
                        color: '#1f2937',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {consultation.patientName}
                      </td>
                      <td style={{ 
                        padding: '0.625rem 0.75rem', 
                        fontSize: '0.8rem', 
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {consultation.doctorName}
                      </td>
                      <td style={{ 
                        padding: '0.625rem 0.75rem', 
                        fontSize: '0.8rem', 
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {consultation.chiefComplaint}
                      </td>
                      <td style={{ 
                        padding: '0.625rem 0.75rem', 
                        fontSize: '0.8rem'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.5rem',
                          background: '#f9fafb',
                          color: '#1f2937',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: '1px solid #e5e7eb'
                        }}>
                          {consultation.status}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '1rem 1.5rem'
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link
                            to={`/consultations/view/${consultation._id}`}
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
                            title="View"
                          >
                            View
                          </Link>
                          <Link
                            to={`/consultations/edit/${consultation._id}`}
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
                            title="Edit"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(consultation._id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#fee2e2',
                              color: '#991b1b',
                              border: '1px solid #fecaca',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dc2626';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                              e.currentTarget.style.color = '#991b1b';
                            }}
                            title="Delete"
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

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              background: '#fff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                marginRight: '0.5rem'
              }}>
                Total Records:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '700', 
                color: '#1f2937'
              }}>
                {filteredConsultations.length}
              </span>
            </div>
            <div style={{
              padding: '1rem 1.5rem',
              background: '#fff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                marginRight: '0.5rem'
              }}>
                Pending Bills:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '700', 
                color: '#1f2937'
              }}>
                {consultations.filter(c => c.billStatus === 'Pending').length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ConsultationList;
