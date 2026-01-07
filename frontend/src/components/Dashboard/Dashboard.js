import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { mockDashboardStats } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    todayAppointments: 0,
    revenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh stats when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchDashboardData = async () => {
    // Get real data from localStorage
    setTimeout(() => {
      // Get total patients
      const patients = JSON.parse(localStorage.getItem('mockPatients') || '[]');
      const totalPatients = patients.length;

      // Get pending bills
      const billings = JSON.parse(localStorage.getItem('mockBillings') || '[]');
      const pendingBills = billings.filter(b => b.status === 'Pending').length;

      // Calculate today's revenue (paid bills)
      const today = new Date().toDateString();
      const todayRevenue = billings
        .filter(b => b.status === 'Paid' && new Date(b.createdAt).toDateString() === today)
        .reduce((sum, bill) => sum + (bill.total || 0), 0);

      setStats({
        todayPatients: totalPatients,
        pendingBills: pendingBills,
        totalRevenue: todayRevenue
      });
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
        <h1>Welcome, {user?.fullName || user?.username || 'User'}! 👋</h1>
        <p>Role: {user?.role || 'Admin'} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats as Clickable Tabs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem', 
        marginBottom: '2.5rem' 
      }}>
        <Link 
          to="/patients" 
          style={{ 
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            padding: '2rem',
            borderRadius: '1.25rem',
            color: 'white',
            boxShadow: '0 10px 30px rgba(8, 145, 178, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            display: 'block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(8, 145, 178, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(8, 145, 178, 0.3)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Patients</div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }}>{stats.todayPatients || 0}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.75rem' }}>👥 Click to view all</div>
            </div>
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>👥</div>
          </div>
        </Link>

        <Link 
          to="/billing" 
          style={{ 
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            padding: '2rem',
            borderRadius: '1.25rem',
            color: 'white',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            display: 'block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.3)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>Pending Bills</div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }}>{stats.pendingBills || 0}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.75rem' }}>💰 Needs attention</div>
            </div>
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>💰</div>
          </div>
        </Link>

        <div
          style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            padding: '2rem',
            borderRadius: '1.25rem',
            color: 'white',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
            cursor: 'default'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.5rem' }}>Today's Revenue</div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }}>{formatCurrency(stats.totalRevenue || 0)}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.75rem' }}>💵 +8% from yesterday</div>
            </div>
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>💵</div>
          </div>
        </div>
      </div>

      {/* Quick Actions as Clickable Tabs */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem',
          color: '#1e293b'
        }}>
          Quick Actions
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem' 
        }}>
          <Link 
            to="/patients/new" 
            style={{ 
              textDecoration: 'none',
              background: 'white',
              padding: '2rem',
              borderRadius: '1.25rem',
              border: '2px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#0891b2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                color: '#0891b2'
              }}>
                New Patient
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Register a new patient
              </p>
            </div>
          </Link>

          <Link 
            to="/billing/new" 
            style={{ 
              textDecoration: 'none',
              background: 'white',
              padding: '2rem',
              borderRadius: '1.25rem',
              border: '2px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                color: '#f59e0b'
              }}>
                New Bill
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Create a new bill
              </p>
            </div>
          </Link>

          <Link 
            to="/patients" 
            style={{ 
              textDecoration: 'none',
              background: 'white',
              padding: '2rem',
              borderRadius: '1.25rem',
              border: '2px solid #e2e8f0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                color: '#10b981'
              }}>
                View Patients
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Browse patient records
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
