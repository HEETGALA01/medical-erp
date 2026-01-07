import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    
    // Get from localStorage
    const storedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
    const defaultAppointments = [
      {
        _id: 'APT001',
        appointmentId: 'APT000001',
        patientId: 'P001',
        patientName: 'Rajesh Kumar',
        doctorName: 'Dr. Sharma',
        department: 'Cardiology',
        appointmentDate: '2024-01-20',
        appointmentTime: '10:00',
        status: 'Scheduled',
        reason: 'Regular checkup',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        _id: 'APT002',
        appointmentId: 'APT000002',
        patientId: 'P002',
        patientName: 'Priya Sharma',
        doctorName: 'Dr. Patel',
        department: 'Pediatrics',
        appointmentDate: '2024-01-21',
        appointmentTime: '11:30',
        status: 'Confirmed',
        reason: 'Child vaccination',
        createdAt: '2024-01-15T11:00:00Z'
      }
    ];

    const allAppointments = storedAppointments.length > 0 ? storedAppointments : defaultAppointments;
    setAppointments(allAppointments);
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = appointments.filter(apt => apt._id !== id);
      setAppointments(updatedAppointments);
      localStorage.setItem('mockAppointments', JSON.stringify(updatedAppointments));
      toast.success('Appointment deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Scheduled': 'badge-blue',
      'Confirmed': 'badge-green',
      'Completed': 'badge-gray',
      'Cancelled': 'badge-red',
      'Pending': 'badge-yellow'
    };
    return statusColors[status] || 'badge-blue';
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus ? apt.status === filterStatus : true;
    const matchesSearch = searchTerm ? 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="list-page-container">
      <div className="page-header">
        <div>
          <h1>📅 Appointments</h1>
          <p>Manage patient appointments and schedules</p>
        </div>
        <Link to="/appointments/new" className="btn btn-primary">
          ➕ Book New Appointment
        </Link>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by patient, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No appointments found</h3>
          <p>Start by booking a new appointment</p>
          <Link to="/appointments/new" className="btn btn-primary">
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                <tr key={appointment._id}>
                  <td>
                    <span className="id-badge">{appointment.appointmentId}</span>
                  </td>
                  <td>
                    <strong>{appointment.patientName}</strong>
                  </td>
                  <td>{appointment.doctorName}</td>
                  <td>
                    <span className="department-badge">{appointment.department}</span>
                  </td>
                  <td>
                    <div className="date-time">
                      <div>📅 {new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-sm">🕐 {appointment.appointmentTime}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>{appointment.reason || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/consultation/${appointment._id}`}
                        className="btn-icon"
                        title="Start Consultation"
                      >
                        🩺
                      </Link>
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="btn-icon btn-danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="stats-footer">
        <div className="stat-item">
          <span className="stat-label">Total Appointments:</span>
          <span className="stat-value">{filteredAppointments.length}</span>
        </div>
      </div>
    </div>
  );
}

export default AppointmentList;
