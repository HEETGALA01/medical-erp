import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';
import { mockLabTests } from '../../data/mockData';

const LaboratoryDashboard = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLabTests();
  }, [searchTerm]);

  const fetchLabTests = async () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockLabTests.filter(test => 
        !searchTerm || 
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setLabTests(filtered);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading laboratory tests...</p>
      </div>
    );
  }

  return (
    <div className="container list-page-container">
      <div className="page-header">
        <div className="page-title">
          <span className="title-icon">🔬</span>
          <h1>Laboratory Tests</h1>
        </div>
        <div className="page-actions">
          <button className="btn btn-success">➕ Add Lab Test</button>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-group">
          <div className="search-input">
            <input
              type="text"
              placeholder="🔍 Search lab tests by name, category, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="data-table-container">
        {labTests.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Test Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Normal Range</th>
                <th>Turnaround Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labTests.map((test) => (
                <tr key={test._id}>
                  <td><strong>{test.testId}</strong></td>
                  <td>{test.testName}</td>
                  <td><span className="badge badge-primary">{test.category}</span></td>
                  <td><strong>{formatCurrency(test.cost)}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{test.normalRange}</td>
                  <td><span className="badge badge-info">{test.turnaroundTime}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon btn-view" title="View">👁️</button>
                      <button className="btn-icon btn-edit" title="Edit">✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔬</div>
            <h3>No Lab Tests Found</h3>
            <p>No lab tests match your search criteria.</p>
            <button className="btn btn-primary">➕ Add First Lab Test</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaboratoryDashboard;
