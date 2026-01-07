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
    { name: 'All', count: billings.length, color: '#0891b2' },
    { name: 'Pending', count: billings.filter(b => b.status === 'Pending').length, color: '#f59e0b' },
    { name: 'Paid', count: billings.filter(b => b.status === 'Paid').length, color: '#10b981' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0891b2', marginBottom: '0.5rem' }}>
          💰 Billing & Payments
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          Manage bills and track payment status
        </p>
      </div>

      {/* Tabs */}
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

      {/* Action Bar */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
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
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Bill Number</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Patient</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Items</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBillings.map((bill, index) => (
                  <tr
                    key={bill._id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: index % 2 === 0 ? '#f8fafc' : 'white',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#f8fafc' : 'white'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: '#0891b2' }}>
                        {bill.billNumber}
                      </div>
                      {bill.consultationId && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          From Consultation
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{bill.patientName}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        {bill.items?.length || 0} items
                      </div>
                      {bill.items && bill.items.length > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          {bill.items[0].description}
                          {bill.items.length > 1 && ` +${bill.items.length - 1} more`}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0891b2' }}>
                        {formatCurrency(bill.total)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <select
                        value={bill.status}
                        onChange={(e) => handleStatusChange(bill._id, e.target.value)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          background: bill.status === 'Paid' ? '#d1fae5' : '#fef3c7',
                          color: bill.status === 'Paid' ? '#065f46' : '#92400e',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{formatDate(bill.createdAt)}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(bill._id)}
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

export default BillingList;
