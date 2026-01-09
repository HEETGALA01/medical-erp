import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPatients } from '../../data/mockData';
import './BillingForm.css';

const BillingForm = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    discount: 0,
    notes: '',
    amountPaid: 0
  });

  useEffect(() => {
    const allPatients = getAllPatients();
    setPatients(allPatients);
  }, []);

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p._id === patientId);
    setFormData({
      ...formData,
      patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * formData.discount) / 100;
    return subtotal - discountAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      toast.error('Please select a patient');
      return;
    }

    if (formData.items.some(item => !item.description || item.rate <= 0)) {
      toast.error('Please fill all item details');
      return;
    }

    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    
    // Calculate balance for partial payment
    const amountPaid = formData.paymentStatus === 'Partially Paid' ? parseFloat(formData.amountPaid) || 0 : (formData.paymentStatus === 'Paid' ? total : 0);
    const balance = total - amountPaid;

    const newBill = {
      _id: `B${Date.now()}`,
      billNumber: `BILL${Date.now()}`,
      patientId: formData.patientId,
      patientName: formData.patientName,
      items: formData.items.map(item => ({
        ...item,
        amount: item.quantity * item.rate
      })),
      subtotal,
      discount: formData.discount,
      tax: 0,
      total,
      amountPaid,
      balance,
      paymentMethod: formData.paymentMethod,
      status: formData.paymentStatus,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingBillings = JSON.parse(localStorage.getItem('mockBillings') || '[]');
    existingBillings.push(newBill);
    localStorage.setItem('mockBillings', JSON.stringify(existingBillings));

    toast.success('Bill created successfully!');
    navigate('/billing');
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1>💳 Create New Bill</h1>
          <p>Generate invoice for patient services</p>
        </div>

        <form onSubmit={handleSubmit} className="billing-form">
          {/* Patient Selection */}
          <div className="form-section">
            <h2>🏥 Patient Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Select Patient *</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.firstName} {patient.lastName} - {patient.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Billing Items */}
          <div className="form-section">
            <div className="section-header-inline">
              <h2>📋 Billing Items</h2>
              <button type="button" className="btn btn-secondary" onClick={addItem}>
                ➕ Add Item
              </button>
            </div>
            
            <div className="items-list">
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="form-group flex-2">
                    <label>Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g., Consultation Fee, X-Ray, Medicine"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rate (₹)</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="text"
                      value={`₹${(item.quantity * item.rate).toFixed(2)}`}
                      disabled
                      className="calculated-field"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeItem(index)}
                      title="Remove Item"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="form-section">
            <h2>💰 Payment Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>
            </div>

            {/* Show amount paid field when Partially Paid is selected */}
            {formData.paymentStatus === 'Partially Paid' && (
              <div className="form-row" style={{ 
                background: '#fef3c7', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                border: '2px solid #fbbf24',
                marginTop: '1rem'
              }}>
                <div className="form-group">
                  <label style={{ fontWeight: '700', color: '#92400e' }}>Amount Paid (₹) *</label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    min="0"
                    max={calculateTotal()}
                    step="0.01"
                    placeholder="Enter amount paid"
                    required
                    style={{
                      border: '2px solid #fbbf24',
                      background: '#ffffff'
                    }}
                  />
                  <small style={{ color: '#92400e', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    Total Bill: ₹{calculateTotal().toFixed(2)} | Balance Due: ₹{(calculateTotal() - (parseFloat(formData.amountPaid) || 0)).toFixed(2)}
                  </small>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional notes or comments"
              />
            </div>
          </div>

          {/* Bill Summary */}
          <div className="form-section bill-summary">
            <h2>📊 Bill Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Discount ({formData.discount}%):</span>
              <span>- ₹{((calculateSubtotal() * formData.discount) / 100).toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            
            {/* Show payment details for Partially Paid */}
            {formData.paymentStatus === 'Partially Paid' && formData.amountPaid > 0 && (
              <>
                <div className="summary-row" style={{ color: '#10b981', fontWeight: '600' }}>
                  <span>Amount Paid:</span>
                  <span>₹{parseFloat(formData.amountPaid).toFixed(2)}</span>
                </div>
                <div className="summary-row" style={{ color: '#dc2626', fontWeight: '700', fontSize: '1.1rem' }}>
                  <span>Balance Due:</span>
                  <span>₹{(calculateTotal() - parseFloat(formData.amountPaid)).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/billing')}>
              ❌ Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Create Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
