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
  }, []);

  const fetchDashboardData = async () => {
    // DEMO MODE - Use mock data
    setTimeout(() => {
      setStats(mockDashboardStats);
      setRecentAppointments(mockDashboardStats.recentAppointments || []);
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
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName || user?.username || 'User'}! 👋</h1>
        <p>Role: {user?.role || 'Admin'} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <h3>Today's Appointments</h3>
              <div className="stat-value">{stats.todayAppointments || 0}</div>
              <div className="stat-change positive">↗ +12% from yesterday</div>
            </div>
            <div className="stat-icon">📅</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-content">
              <h3>Total Patients</h3>
              <div className="stat-value">{stats.todayPatients || 0}</div>
              <div className="stat-change positive">↗ New registrations</div>
            </div>
            <div className="stat-icon">👥</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-content">
              <h3>Pending Bills</h3>
              <div className="stat-value">{stats.pendingBills || 0}</div>
              <div className="stat-change negative">↘ Needs attention</div>
            </div>
            <div className="stat-icon">💰</div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-content">
              <h3>Today's Revenue</h3>
              <div className="stat-value">{formatCurrency(stats.totalRevenue || 0)}</div>
              <div className="stat-change positive">↗ +8% from yesterday</div>
            </div>
            <div className="stat-icon">💵</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/patients/new" className="action-card">
            <div className="action-icon">👤</div>
            <h3>New Patient</h3>
            <p>Register a new patient</p>
          </Link>
          <Link to="/appointments/new" className="action-card">
            <div className="action-icon">📅</div>
            <h3>New Appointment</h3>
            <p>Schedule an appointment</p>
          </Link>
          {(user?.role === 'Admin' || user?.role === 'Receptionist') && (
            <Link to="/billing/new" className="action-card">
              <div className="action-icon">💳</div>
              <h3>New Bill</h3>
              <p>Create a new bill</p>
            </Link>
          )}
          <Link to="/patients" className="action-card">
            <div className="action-icon">📋</div>
            <h3>View Patients</h3>
            <p>Browse patient records</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Appointments</h2>
          <Link to="/appointments" className="btn btn-secondary">View All →</Link>
        </div>
        <div className="data-table-container">
          {recentAppointments && recentAppointments.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt._id || apt.appointmentId}>
                    <td>{apt.appointmentId}</td>
                    <td>{apt.patient?.firstName} {apt.patient?.lastName}</td>
                    <td>{apt.doctor?.fullName || 'N/A'}</td>
                    <td>{apt.timeSlot || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${apt.status === 'Completed' ? 'success' : apt.status === 'Scheduled' ? 'info' : 'warning'}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No Recent Appointments</h3>
              <p>There are no appointments scheduled for today.</p>
              <Link to="/appointments/new" className="btn btn-primary">Schedule Appointment</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
