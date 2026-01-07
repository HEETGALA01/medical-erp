import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';
import './PharmacyDashboard.css';

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    medicineId: '',
    name: '',
    genericName: '',
    manufacturer: '',
    category: 'Tablet',
    unitPrice: 0,
    stockQuantity: 0,
    reorderLevel: 10,
    expiryDate: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, [searchTerm]);

  const fetchMedicines = () => {
    setLoading(true);
    // Get from localStorage
    const storedMedicines = JSON.parse(localStorage.getItem('mockMedicines') || '[]');
    const defaultMedicines = [
      { _id: '1', medicineId: 'MED001', name: 'Paracetamol', genericName: 'Acetaminophen', manufacturer: 'Sun Pharma', category: 'Tablet', unitPrice: 5, stockQuantity: 500, reorderLevel: 100, expiryDate: '2025-12-31' },
      { _id: '2', medicineId: 'MED002', name: 'Amoxicillin', genericName: 'Amoxicillin', manufacturer: 'Cipla', category: 'Capsule', unitPrice: 15, stockQuantity: 200, reorderLevel: 50, expiryDate: '2025-10-31' },
      { _id: '3', medicineId: 'MED003', name: 'Ibuprofen', genericName: 'Ibuprofen', manufacturer: 'Dr. Reddy\'s', category: 'Tablet', unitPrice: 8, stockQuantity: 150, reorderLevel: 50, expiryDate: '2026-03-31' },
      { _id: '4', medicineId: 'MED004', name: 'Cough Syrup', genericName: 'Dextromethorphan', manufacturer: 'Himalaya', category: 'Syrup', unitPrice: 120, stockQuantity: 30, reorderLevel: 20, expiryDate: '2025-08-31' }
    ];

    const allMedicines = storedMedicines.length > 0 ? storedMedicines : defaultMedicines;
    
    if (storedMedicines.length === 0) {
      localStorage.setItem('mockMedicines', JSON.stringify(defaultMedicines));
    }

    const filtered = allMedicines.filter(med => 
      !searchTerm || 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medicineId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setMedicines(filtered);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.medicineId || !formData.genericName) {
      toast.error('Please fill all required fields');
      return;
    }

    const newMedicine = {
      _id: Date.now().toString(),
      ...formData,
      unitPrice: parseFloat(formData.unitPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      reorderLevel: parseInt(formData.reorderLevel)
    };

    const storedMedicines = JSON.parse(localStorage.getItem('mockMedicines') || '[]');
    storedMedicines.push(newMedicine);
    localStorage.setItem('mockMedicines', JSON.stringify(storedMedicines));

    toast.success('Medicine added successfully!');
    setShowModal(false);
    setFormData({
      medicineId: '',
      name: '',
      genericName: '',
      manufacturer: '',
      category: 'Tablet',
      unitPrice: 0,
      stockQuantity: 0,
      reorderLevel: 10,
      expiryDate: ''
    });
    fetchMedicines();
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
          <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add Medicine</button>
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
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add First Medicine</button>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💊 Add New Medicine</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✖️</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Medicine ID *</label>
                  <input
                    type="text"
                    name="medicineId"
                    value={formData.medicineId}
                    onChange={handleChange}
                    placeholder="e.g., MED005"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Medicine Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Azithromycin"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Generic Name *</label>
                  <input
                    type="text"
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleChange}
                    placeholder="e.g., Azithromycin"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g., Sun Pharma"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream</option>
                    <option value="Drops">Drops</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit Price (₹) *</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  ✅ Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
