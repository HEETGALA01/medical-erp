import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';
import './LaboratoryDashboard.css';

const LaboratoryDashboard = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    testId: '',
    testName: '',
    category: 'Blood Test',
    cost: 0,
    normalRange: '',
    turnaroundTime: '24 hours'
  });

  useEffect(() => {
    fetchLabTests();
  }, [searchTerm]);

  const fetchLabTests = () => {
    setLoading(true);
    const storedTests = JSON.parse(localStorage.getItem('mockLabTests') || '[]');
    const defaultTests = [
      { _id: '1', testId: 'LAB001', testName: 'Complete Blood Count (CBC)', category: 'Blood Test', cost: 500, normalRange: 'RBC: 4.5-5.5, WBC: 4-11', turnaroundTime: '24 hours' },
      { _id: '2', testId: 'LAB002', testName: 'Lipid Profile', category: 'Blood Test', cost: 800, normalRange: 'Total Cholesterol: <200 mg/dL', turnaroundTime: '24 hours' },
      { _id: '3', testId: 'LAB003', testName: 'Thyroid Function Test (TSH)', category: 'Hormone Test', cost: 600, normalRange: 'TSH: 0.4-4.0 mIU/L', turnaroundTime: '48 hours' },
      { _id: '4', testId: 'LAB004', testName: 'X-Ray Chest', category: 'Radiology', cost: 400, normalRange: 'N/A', turnaroundTime: '2 hours' }
    ];

    const allTests = storedTests.length > 0 ? storedTests : defaultTests;
    
    if (storedTests.length === 0) {
      localStorage.setItem('mockLabTests', JSON.stringify(defaultTests));
    }

    const filtered = allTests.filter(test => 
      !searchTerm || 
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setLabTests(filtered);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.testName || !formData.testId) {
      toast.error('Please fill all required fields');
      return;
    }

    const newTest = {
      _id: Date.now().toString(),
      ...formData,
      cost: parseFloat(formData.cost)
    };

    const storedTests = JSON.parse(localStorage.getItem('mockLabTests') || '[]');
    storedTests.push(newTest);
    localStorage.setItem('mockLabTests', JSON.stringify(storedTests));

    toast.success('Lab test added successfully!');
    setShowModal(false);
    setFormData({
      testId: '',
      testName: '',
      category: 'Blood Test',
      cost: 0,
      normalRange: '',
      turnaroundTime: '24 hours'
    });
    fetchLabTests();
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
          <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add Lab Test</button>
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
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add First Lab Test</button>
          </div>
        )}
      </div>

      {/* Add Lab Test Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔬 Add New Lab Test</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✖️</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Test ID *</label>
                  <input
                    type="text"
                    name="testId"
                    value={formData.testId}
                    onChange={handleChange}
                    placeholder="e.g., LAB005"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Test Name *</label>
                  <input
                    type="text"
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                    placeholder="e.g., Blood Sugar Fasting"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Blood Test">Blood Test</option>
                    <option value="Urine Test">Urine Test</option>
                    <option value="Hormone Test">Hormone Test</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Microbiology">Microbiology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cost (₹) *</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Normal Range</label>
                  <input
                    type="text"
                    name="normalRange"
                    value={formData.normalRange}
                    onChange={handleChange}
                    placeholder="e.g., 70-100 mg/dL"
                  />
                </div>
                <div className="form-group">
                  <label>Turnaround Time</label>
                  <select name="turnaroundTime" value={formData.turnaroundTime} onChange={handleChange}>
                    <option value="2 hours">2 hours</option>
                    <option value="6 hours">6 hours</option>
                    <option value="24 hours">24 hours</option>
                    <option value="48 hours">48 hours</option>
                    <option value="72 hours">72 hours</option>
                    <option value="1 week">1 week</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  ✅ Add Lab Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryDashboard;
