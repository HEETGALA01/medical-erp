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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', margin: 0 }}>
            Pharmacy Inventory
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem', margin: 0 }}>
            Manage medicines and track inventory
          </p>
        </div>
        <button 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1f2937';
          }}
        >
          Add Medicine
        </button>
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
          placeholder="Search medicines by name, generic name, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem 1.25rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.9375rem'
          }}
        />
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '0.75rem', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        {medicines.length > 0 ? (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Medicine ID
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Medicine Name
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Generic Name
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Manufacturer
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Category
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Stock
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Unit Price
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, index) => (
                  <tr key={med._id} style={{ borderBottom: index < medicines.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#1f2937', fontWeight: '600' }}>
                      {med.medicineId}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#1f2937' }}>
                      {med.name}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {med.genericName}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {med.manufacturer}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.625rem', 
                        background: '#f3f4f6', 
                        color: '#1f2937', 
                        borderRadius: '0.375rem', 
                        fontSize: '0.8125rem',
                        fontWeight: '600'
                      }}>
                        {med.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        padding: '0.25rem 0.625rem', 
                        background: med.stockQuantity < med.reorderLevel ? '#fee2e2' : '#e5e7eb', 
                        color: med.stockQuantity < med.reorderLevel ? '#dc2626' : '#1f2937', 
                        borderRadius: '0.375rem', 
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {med.stockQuantity} units
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#1f2937', fontWeight: '600' }}>
                      {formatCurrency(med.unitPrice)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(med.expiryDate).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: '0.3' }}>💊</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
              No Medicines Found
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              No medicines match your search criteria.
            </p>
            <button 
              style={{
                padding: '0.75rem 1.5rem',
                background: '#1f2937',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => setShowModal(true)}
            >
              Add First Medicine
            </button>
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
