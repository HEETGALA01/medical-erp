import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
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
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [patientsRes, appointmentsRes, todayApptRes] = await Promise.all([
        axios.get('/api/patients'),
        axios.get('/api/appointments'),
        axios.get(`/api/appointments?date=${today}`)
      ]);

      setStats({
        patients: patientsRes.data.patients.length,
        appointments: appointmentsRes.data.appointments.length,
        todayAppointments: todayApptRes.data.appointments.length,
        revenue: 0
      });

      setRecentAppointments(todayApptRes.data.appointments.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user?.fullName}!</h1>
      <p className="dashboard-subtitle">Role: {user?.role}</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.appointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕐</div>
          <div className="stat-info">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹0</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/patients/new" className="btn btn-primary">
            ➕ New Patient
          </Link>
          <Link to="/appointments/new" className="btn btn-success">
            📅 New Appointment
          </Link>
          {(user?.role === 'Admin' || user?.role === 'Receptionist') && (
            <Link to="/billing/new" className="btn btn-primary">
              💳 New Bill
            </Link>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Today's Appointments</h2>
        {recentAppointments.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td>{apt.appointmentTime}</td>
                  <td>{apt.patient?.fullName}</td>
                  <td>{apt.doctor?.fullName}</td>
                  <td>
                    <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments scheduled for today.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
