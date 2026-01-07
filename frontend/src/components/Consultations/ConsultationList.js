import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mockConsultations } from '../../data/mockData';

function ConsultationList() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = () => {
    setLoading(true);
    
    // Initialize with mock data if consultations don't exist
    let storedConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    if (storedConsultations.length === 0) {
      localStorage.setItem('consultations', JSON.stringify(mockConsultations));
      storedConsultations = mockConsultations;
    }
    
    setConsultations(storedConsultations);
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this consultation record?')) {
      const updatedConsultations = consultations.filter(con => con._id !== id);
      setConsultations(updatedConsultations);
      localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
      toast.success('Consultation deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Active': 'badge-blue',
      'Completed': 'badge-green',
      'Follow-up Required': 'badge-yellow'
    };
    return statusColors[status] || 'badge-blue';
  };

  const getBillStatusBadge = (status) => {
    const statusColors = {
      'Paid': 'badge-green',
      'Pending': 'badge-yellow',
      'Unpaid': 'badge-red'
    };
    return statusColors[status] || 'badge-yellow';
  };

  const filteredConsultations = consultations.filter(con => {
    const matchesStatus = filterStatus ? con.status === filterStatus : true;
    const matchesSearch = searchTerm ? 
      con.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      con.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      con.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading consultations...</div>;
  }

  return (
    <div className="list-page-container">
      <div className="page-header">
        <div>
          <h1>📋 Patient Records & Consultations</h1>
          <p>Manage patient consultation history and medical records</p>
        </div>
        <Link to="/consultations/new" className="btn btn-primary">
          ➕ New Consultation
        </Link>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by patient, doctor, or diagnosis..."
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
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Follow-up Required">Follow-up Required</option>
        </select>
      </div>

      {filteredConsultations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No consultation records found</h3>
          <p>Start by creating a new patient consultation</p>
          <Link to="/consultations/new" className="btn btn-primary">
            New Consultation
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Consultation ID</th>
                <th>Date</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Chief Complaint</th>
                <th>Diagnosis</th>
                <th>Bill Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultations.map(consultation => (
                <tr key={consultation._id}>
                  <td>
                    <span className="id-badge">{consultation.consultationId}</span>
                  </td>
                  <td>{new Date(consultation.consultationDate).toLocaleDateString()}</td>
                  <td>
                    <strong>{consultation.patientName}</strong>
                  </td>
                  <td>{consultation.doctorName}</td>
                  <td>{consultation.chiefComplaint}</td>
                  <td>
                    <span className="diagnosis-badge">{consultation.diagnosis}</span>
                  </td>
                  <td>
                    <span className={`badge ${getBillStatusBadge(consultation.billStatus)}`}>
                      {consultation.billStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/consultations/view/${consultation._id}`}
                        className="btn-icon"
                        title="View Details"
                      >
                        👁️
                      </Link>
                      <Link
                        to={`/consultations/edit/${consultation._id}`}
                        className="btn-icon"
                        title="Edit"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(consultation._id)}
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
          <span className="stat-label">Total Records:</span>
          <span className="stat-value">{filteredConsultations.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending Bills:</span>
          <span className="stat-value">
            {consultations.filter(c => c.billStatus === 'Pending').length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ConsultationList;
