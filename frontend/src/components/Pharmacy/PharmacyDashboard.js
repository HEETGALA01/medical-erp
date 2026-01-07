import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';
import { mockMedicines } from '../../data/mockData';

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, [searchTerm]);

  const fetchMedicines = async () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockMedicines.filter(med => 
        !searchTerm || 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.medicineId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMedicines(filtered);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading pharmacy inventory...</p>
      </div>
    );
  }

  return (
    <div className="container list-page-container">
      <div className="page-header">
        <div className="page-title">
          <span className="title-icon">💊</span>
          <h1>Pharmacy Inventory</h1>
        </div>
        <div className="page-actions">
          <button className="btn btn-success">➕ Add Medicine</button>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-group">
          <div className="search-input">
            <input
              type="text"
              placeholder="🔍 Search medicines by name, generic name, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="data-table-container">
        {medicines.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicine ID</th>
                <th>Medicine Name</th>
                <th>Generic Name</th>
                <th>Manufacturer</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit Price</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id}>
                  <td><strong>{med.medicineId}</strong></td>
                  <td>{med.name}</td>
                  <td>{med.genericName}</td>
                  <td>{med.manufacturer}</td>
                  <td><span className="badge badge-info">{med.category}</span></td>
                  <td>
                    <span className={`badge badge-${med.stockQuantity < med.reorderLevel ? 'danger' : 'success'}`}>
                      {med.stockQuantity} units
                    </span>
                  </td>
                  <td><strong>{formatCurrency(med.unitPrice)}</strong></td>
                  <td>{new Date(med.expiryDate).toLocaleDateString('en-IN')}</td>
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
            <div className="no-results-icon">💊</div>
            <h3>No Medicines Found</h3>
            <p>No medicines match your search criteria.</p>
            <button className="btn btn-primary">➕ Add First Medicine</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;
