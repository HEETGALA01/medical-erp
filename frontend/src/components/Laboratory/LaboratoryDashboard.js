import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const LaboratoryDashboard = () => {
  const [labTests, setLabTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLabTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [labTests, activeTab, searchTerm]);

  const fetchLabTests = () => {
    const stored = JSON.parse(localStorage.getItem('labTests') || '[]');
    setLabTests(stored.sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate)));
  };

  const filterTests = () => {
    let filtered = [...labTests];

    if (activeTab !== 'All') {
      filtered = filtered.filter(t => t.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.orderedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTests(filtered);
  };

  const handleStatusChange = (testId, newStatus) => {
    const updated = labTests.map(t => 
      t._id === testId ? { 
        ...t, 
        status: newStatus,
        completedDate: newStatus === 'Completed' ? new Date().toISOString() : t.completedDate
      } : t
    );
    localStorage.setItem('labTests', JSON.stringify(updated));
    setLabTests(updated);
    toast.success(`Test status updated to ${newStatus}`);
  };

  const handleCheckComplete = (testId) => {
    const test = labTests.find(t => t._id === testId);
    if (test && test.status === 'Pending') {
      handleStatusChange(testId, 'Completed');
    }
  };

  const handleResultChange = (testId, result) => {
    const updated = labTests.map(t => 
      t._id === testId ? { ...t, result } : t
    );
    localStorage.setItem('labTests', JSON.stringify(updated));
    setLabTests(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lab test record?')) {
      const updated = labTests.filter(t => t._id !== id);
      localStorage.setItem('labTests', JSON.stringify(updated));
      setLabTests(updated);
      toast.success('Lab test deleted successfully');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const tabs = [
    { name: 'All', count: labTests.length, color: '#1f2937' },
    { name: 'Pending', count: labTests.filter(t => t.status === 'Pending').length, color: '#6b7280' },
    { name: 'In Progress', count: labTests.filter(t => t.status === 'In Progress').length, color: '#4b5563' },
    { name: 'Completed', count: labTests.filter(t => t.status === 'Completed').length, color: '#374151' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Laboratory Tests
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
          Manage and track all lab test orders
        </p>
      </div>

      {/* 2x2 Grid Layout for Tabs */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.75rem', 
        marginBottom: '2rem', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            style={{
              padding: '1rem 1.5rem',
              border: activeTab === tab.name ? '2px solid #1f2937' : '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              background: activeTab === tab.name ? '#1f2937' : 'white',
              color: activeTab === tab.name ? '#ffffff' : '#4b5563',
              fontWeight: activeTab === tab.name ? '700' : '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.name) {
                e.currentTarget.style.borderColor = '#1f2937';
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.name) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            <span>{tab.name}</span>
            <span style={{
              background: activeTab === tab.name ? '#ffffff' : '#1f2937',
              color: activeTab === tab.name ? '#1f2937' : '#ffffff',
              padding: '0.25rem 0.625rem',
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: '700'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.75rem', 
        marginBottom: '2rem', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <input
          type="text"
          placeholder="Search by patient, test name, or doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '2px solid #e2e8f0',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', overflow: 'auto' }}>
        {filteredTests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
              No lab tests found
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Lab tests will appear here when doctors order them from consultations</p>
          </div>
        ) : (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Name</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doctor</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ordered Date</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test, index) => (
                  <tr
                    key={test._id}
                    style={{
                      borderBottom: index < filteredTests.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {test.testName}
                      </div>
                      {test.consultationId && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          From Consultation
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{test.patientName}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ color: '#6b7280' }}>{test.doctorName || test.orderedBy || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ color: '#6b7280' }}>{formatDate(test.orderedDate)}</div>
                      {test.completedDate && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>
                          Completed: {formatDate(test.completedDate)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      {test.scheduledDate ? (
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>
                            {formatDate(test.scheduledDate)}
                          </div>
                          {test.scheduledTime && (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                              {formatTime(test.scheduledTime)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Not scheduled</div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      {test.status === 'Pending' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            cursor: 'pointer',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '0.375rem',
                            background: '#fef3c7',
                            border: '1px solid #fbbf24'
                          }}>
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => handleCheckComplete(test._id)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <span style={{ fontWeight: '600', fontSize: '0.75rem', color: '#92400e' }}>
                              Mark Complete
                            </span>
                          </label>
                        </div>
                      ) : (
                        <select
                          value={test.status}
                          onChange={(e) => handleStatusChange(test._id, e.target.value)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e5e7eb',
                            background: 
                              test.status === 'Completed' ? '#f0fdf4' :
                              test.status === 'In Progress' ? '#f9fafb' : '#fef3c7',
                            color: 
                              test.status === 'Completed' ? '#166534' :
                              test.status === 'In Progress' ? '#1f2937' : '#92400e',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(test._id)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#dc2626';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fee2e2';
                          e.target.style.color = '#dc2626';
                        }}
                      >
                        Delete
                      </button>
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
};

export default LaboratoryDashboard;
