import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { mockBillings } from '../../data/mockData';

const BillingList = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBillings();
  }, [filterStatus]);

  const fetchBillings = async () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockBillings.filter(bill => 
        !filterStatus || bill.paymentStatus === filterStatus
      );
      setBillings(filtered);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading billings...</p>
      </div>
    );
  }

  return (
    <div className="container list-page-container">
      <div className="page-header">
        <div className="page-title">
          <span className="title-icon">💰</span>
          <h1>Billing & Payments</h1>
        </div>
        <div className="page-actions">
          <Link to="/billing/new" className="btn btn-primary">
            ➕ Create New Bill
          </Link>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-group">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {billings.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Patient Name</th>
                <th>Services</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((bill) => (
                <tr key={bill._id}>
                  <td><strong>{bill.billNumber}</strong></td>
                  <td>{bill.patient?.firstName} {bill.patient?.lastName}</td>
                  <td>{bill.items?.length || 0} items</td>
                  <td><strong>{formatCurrency(bill.totalAmount)}</strong></td>
                  <td><span className="badge badge-info">{bill.paymentMethod}</span></td>
                  <td>
                    <span className={`badge badge-${bill.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>{formatDate(bill.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon btn-view" title="View">👁️</button>
                      <button className="btn-icon btn-edit" title="Print">🖨️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">💰</div>
            <h3>No Bills Found</h3>
            <p>No billing records match your criteria.</p>
            <Link to="/billing/new" className="btn btn-primary">
              ➕ Create First Bill
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingList;
