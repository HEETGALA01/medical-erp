import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BillingList = () => {
  const [billings, setBillings] = useState([]);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBillings();
  }, []);

  useEffect(() => {
    filterBillings();
  }, [billings, activeTab, searchTerm]);

  const fetchBillings = () => {
    const stored = JSON.parse(localStorage.getItem('mockBillings') || '[]');
    setBillings(stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const filterBillings = () => {
    let filtered = [...billings];

    if (activeTab !== 'All') {
      filtered = filtered.filter(b => b.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.billNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBillings(filtered);
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      const updated = billings.filter(b => b._id !== id);
      localStorage.setItem('mockBillings', JSON.stringify(updated));
      setBillings(updated);
      toast.success('Bill deleted successfully');
    }
  };

  const handleStatusChange = (billId, newStatus) => {
    const updated = billings.map(b => 
      b._id === billId ? { ...b, status: newStatus, paymentMethod: newStatus === 'Paid' ? 'Cash' : '' } : b
    );
    localStorage.setItem('mockBillings', JSON.stringify(updated));
    setBillings(updated);
    toast.success(`Bill marked as ${newStatus}`);
  };

  const tabs = [
    { name: 'All', count: billings.length },
    { name: 'Pending', count: billings.filter(b => b.status === 'Pending').length },
    { name: 'Partially Paid', count: billings.filter(b => b.status === 'Partially Paid').length },
    { name: 'Paid', count: billings.filter(b => b.status === 'Paid').length }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Billing & Payments
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
          Manage bills and track payment status
        </p>
      </div>

      {/* Tabs - 4 in a row */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.75rem', 
        marginBottom: '2rem', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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

      {/* Action Bar */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.75rem', 
        marginBottom: '2rem', 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by patient name or bill number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '2px solid #e2e8f0',
            fontSize: '1rem'
          }}
        />

        <Link
          to="/billing/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#1f2937',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '0.9375rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => e.target.style.background = '#374151'}
          onMouseLeave={(e) => e.target.style.background = '#1f2937'}
        >
          + New Bill
        </Link>
      </div>

      {/* Bills Table */}
      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
        {filteredBillings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#64748b' }}>
              No bills found
            </h3>
            <p>Start by creating a new bill</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }} className="custom-scrollbar billing-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bill Number</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBillings.map((bill, index) => (
                  <tr
                    key={bill._id}
                    style={{
                      borderBottom: index < filteredBillings.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {bill.billNumber}
                      </div>
                      {bill.consultationId && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          From Consultation
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{bill.patientName}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ color: '#6b7280' }}>
                        {bill.items?.length || 0} items
                      </div>
                      {bill.items && bill.items.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                          {bill.items[0].description}
                          {bill.items.length > 1 && ` +${bill.items.length - 1} more`}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1f2937' }}>
                        {formatCurrency(bill.total)}
                      </div>
                      {bill.status === 'Partially Paid' && bill.balance > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem', fontWeight: '600' }}>
                          Balance: {formatCurrency(bill.balance)}
                        </div>
                      )}
                      {bill.status === 'Partially Paid' && bill.amountPaid > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>
                          Paid: {formatCurrency(bill.amountPaid)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <select
                        value={bill.status}
                        onChange={(e) => handleStatusChange(bill._id, e.target.value)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb',
                          background: bill.status === 'Paid' ? '#f0fdf4' : bill.status === 'Partially Paid' ? '#fef3c7' : '#fef3c7',
                          color: bill.status === 'Paid' ? '#166534' : bill.status === 'Partially Paid' ? '#c2410c' : '#92400e',
                          fontWeight: '600',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div>{formatDate(bill.createdAt)}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(bill._id)}
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

export default BillingList;
