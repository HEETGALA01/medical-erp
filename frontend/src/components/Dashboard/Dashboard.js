import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { mockDashboardStats, getAllPatients } from '../../data/mockData';
import { formatCurrency, formatDate, calculateAge } from '../../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    todayAppointments: 0,
    revenue: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchDashboardData();
    loadNotes();
    
    // Refresh stats when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    setNotes(savedNotes);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      text: newNote,
      createdAt: new Date().toISOString(),
      createdBy: user?.fullName || user?.username || 'User'
    };
    
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('quickNotes', JSON.stringify(updatedNotes));
  };

  const fetchDashboardData = async () => {
    // Get real data from localStorage
    setTimeout(() => {
      // Get total patients
      const patients = getAllPatients();
      const totalPatients = patients.length;

      // Get pending bills
      const billings = JSON.parse(localStorage.getItem('mockBillings') || '[]');
      const pendingBills = billings.filter(b => b.status === 'Pending').length;

      // Calculate today's revenue (paid bills)
      const today = new Date().toDateString();
      const todayRevenue = billings
        .filter(b => b.status === 'Paid' && new Date(b.createdAt).toDateString() === today)
        .reduce((sum, bill) => sum + (bill.total || 0), 0);

      // Get recent patients (last 5)
      const sortedPatients = [...patients].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);

      setStats({
        todayPatients: totalPatients,
        pendingBills: pendingBills,
        totalRevenue: todayRevenue
      });
      setRecentPatients(sortedPatients);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Welcome, {user?.fullName || user?.username || 'User'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
          {user?.role || 'Admin'} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Main Grid - Tangram Square Layout */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'auto auto auto',
        gap: '1rem'
      }}>
        
        {/* Row 1, Col 1-2: Patients */}
        <div style={{ gridColumn: 'span 2' }}>
          <Link 
            to="/patients" 
            style={{ 
              textDecoration: 'none',
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'block',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Patients
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1', color: '#1f2937' }}>
              {stats.todayPatients || 0}
            </div>
          </Link>
        </div>

        {/* Row 1, Col 3-4: Pending Bills */}
        <div style={{ gridColumn: 'span 2' }}>
          <Link 
            to="/billing" 
            style={{ 
              textDecoration: 'none',
              background: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              color: '#fff',
              border: '1px solid #1f2937',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'block',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Bills
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1', color: '#fff' }}>
              {stats.pendingBills || 0}
            </div>
          </Link>
        </div>

        {/* Row 1-2, Col 5-6: Quick Notes (spans 2 rows) */}
        <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '1rem 1.25rem', 
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Quick Notes
              </h3>
            </div>
            
            <div style={{ padding: '1rem', flexShrink: 0 }}>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a quick note..."
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  resize: 'none',
                  fontFamily: 'inherit',
                  marginBottom: '0.75rem'
                }}
                className="custom-scrollbar"
              />
              <button
                onClick={handleAddNote}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  background: '#1f2937',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1f2937';
                }}
              >
                Add Note
              </button>
            </div>

            <div 
              style={{ 
                overflowY: 'auto', 
                padding: '0 1rem 1rem',
                minHeight: '120px',
                maxHeight: '200px'
              }}
              className="custom-scrollbar"
            >
              {notes.length > 0 ? (
                notes.map(note => (
                  <div key={note.id} style={{ 
                    background: '#f9fafb',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #e5e7eb',
                    position: 'relative'
                  }}>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '0.25rem'
                      }}
                    >
                      ×
                    </button>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#1f2937', 
                      margin: '0 0 0.5rem 0',
                      paddingRight: '1.5rem'
                    }}>
                      {note.text}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(note.createdAt).toLocaleString('en-IN', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', margin: '1rem 0' }}>
                  No notes yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Row 2, Col 1-4: Revenue */}
        <div style={{ gridColumn: 'span 4' }}>
          <div
            style={{ 
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              height: '100%'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today's Revenue
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1', color: '#1f2937' }}>
              {formatCurrency(stats.totalRevenue || 0)}
            </div>
          </div>
        </div>

        {/* Row 3, Col 1-4: Recent Patients */}
        <div style={{ gridColumn: 'span 4' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <div style={{ 
              padding: '1rem 1.5rem', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f9fafb',
              flexShrink: 0
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Recent Patients
              </h2>
              <Link 
                to="/patients" 
                style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                View All →
              </Link>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
              {recentPatients.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Patient ID
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Name
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Age
                      </th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((patient, index) => (
                      <tr 
                        key={patient._id} 
                        style={{ 
                          borderBottom: index < recentPatients.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}
                      >
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#1f2937', fontWeight: '600' }}>
                          {patient.patientId}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          {calculateAge(patient.dateOfBirth)} years
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          {formatDate(patient.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: '0.3' }}>📋</div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No patients registered yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3, Col 5-6: Quick Actions & Today's Summary */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            padding: '1.5rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link 
                  to="/patients/new" 
                  style={{ 
                    textDecoration: 'none',
                    padding: '0.75rem 1rem',
                    background: '#1f2937',
                    color: '#fff',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    transition: 'all 0.2s'
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
                <Link 
                  to="/billing/new" 
                  style={{ 
                    textDecoration: 'none',
                    padding: '0.75rem 1rem',
                    background: '#fff',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  New Bill
                </Link>
              </div>
            </div>

            <div style={{ 
              background: '#f9fafb', 
              borderRadius: '0.375rem', 
              border: '1px solid #e5e7eb',
              padding: '1rem'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.75rem' }}>
                Today's Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Consultations</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1f2937' }}>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Lab Tests</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1f2937' }}>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Prescriptions</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1f2937' }}>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
