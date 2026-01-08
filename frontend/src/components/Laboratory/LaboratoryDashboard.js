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
    { name: 'All', count: labTests.length, color: '#0891b2' },
    { name: 'Pending', count: labTests.filter(t => t.status === 'Pending').length, color: '#f59e0b' },
    { name: 'In Progress', count: labTests.filter(t => t.status === 'In Progress').length, color: '#8b5cf6' },
    { name: 'Completed', count: labTests.filter(t => t.status === 'Completed').length, color: '#10b981' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#8b5cf6', marginBottom: '0.5rem' }}>
          🔬 Laboratory Tests
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          Manage and track all lab test orders
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '1rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            style={{
              padding: '0.75rem 1.5rem',
              border: activeTab === tab.name ? `3px solid ${tab.color}` : '2px solid #e2e8f0',
              borderRadius: '0.75rem',
              background: activeTab === tab.name ? `${tab.color}15` : 'white',
              color: activeTab === tab.name ? tab.color : '#64748b',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{tab.name}</span>
            <span style={{
              background: tab.color,
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
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

      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
        {filteredTests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#64748b' }}>
              No lab tests found
            </h3>
            <p>Lab tests will appear here when doctors order them from consultations</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Test Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Patient</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Ordered By</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Ordered Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Scheduled</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Result</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test, index) => (
                  <tr
                    key={test._id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: index % 2 === 0 ? '#f8fafc' : 'white',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#f8fafc' : 'white'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: '#8b5cf6' }}>
                        {test.testName}
                      </div>
                      {test.consultationId && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          From Consultation
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{test.patientName}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: '#64748b' }}>{test.orderedBy}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{formatDate(test.orderedDate)}</div>
                      {test.completedDate && (
                        <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>
                          Completed: {formatDate(test.completedDate)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {test.scheduledDate ? (
                        <div>
                          <div style={{ fontWeight: '600', color: '#8b5cf6' }}>
                            📅 {formatDate(test.scheduledDate)}
                          </div>
                          {test.scheduledTime && (
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                              ⏰ {formatTime(test.scheduledTime)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Not scheduled</div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {test.status === 'Pending' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            background: '#fef3c7',
                            border: '2px solid #fbbf24'
                          }}>
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => handleCheckComplete(test._id)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#92400e' }}>
                              Mark Complete
                            </span>
                          </label>
                        </div>
                      ) : (
                        <select
                          value={test.status}
                          onChange={(e) => handleStatusChange(test._id, e.target.value)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: 
                              test.status === 'Completed' ? '#d1fae5' :
                              test.status === 'In Progress' ? '#ddd6fe' : '#fef3c7',
                            color: 
                              test.status === 'Completed' ? '#065f46' :
                              test.status === 'In Progress' ? '#5b21b6' : '#92400e',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <input
                        type="text"
                        value={test.result || ''}
                        onChange={(e) => handleResultChange(test._id, e.target.value)}
                        placeholder="Enter result..."
                        style={{
                          width: '150px',
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '2px solid #e2e8f0',
                          fontSize: '0.85rem'
                        }}
                      />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(test._id)}
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
