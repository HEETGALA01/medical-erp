import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { exportToCSV, formatDate, calculateAge } from '../../utils/helpers';
import { getAllPatients } from '../../data/mockData';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    // DEMO MODE - Get patients from localStorage with search filter
    setLoading(true);
    setTimeout(() => {
      const allPatients = getAllPatients();
      const filtered = allPatients.filter(p => 
        !search || 
        (p.firstName && p.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (p.lastName && p.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (p.patientId && p.patientId.toLowerCase().includes(search.toLowerCase()))
      );
      setPatients(filtered);
      setLoading(false);
    }, 300);
  };

  const handleExport = () => {
    const exportData = patients.map(p => ({
      'Patient ID': p.patientId,
      'Name': `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      'Age': calculateAge(p.dateOfBirth),
      'Gender': p.gender,
      'Phone': p.phoneNumber,
      'Email': p.email || '',
      'Blood Group': p.bloodGroup || '',
      'Registered': formatDate(p.createdAt)
    }));
    exportToCSV(exportData, 'patients');
    toast.success('Exported successfully!');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="container list-page-container">
      <div className="page-header">
        <div className="page-title">
          <span className="title-icon">👥</span>
          <h1>Patient Records</h1>
        </div>
        <div className="page-actions">
          <button onClick={handleExport} className="btn btn-secondary">
            📥 Export CSV
          </button>
          <Link to="/patients/new" className="btn btn-primary">
            ➕ Add New Patient
          </Link>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-group">
          <div className="search-input">
            <input
              type="text"
              placeholder="🔍 Search by name, ID, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="data-table-container">
        {patients.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Age / Gender</th>
                <th>Phone Number</th>
                <th>Blood Group</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td><strong>{patient.patientId}</strong></td>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{calculateAge(patient.dateOfBirth)} years / {patient.gender}</td>
                  <td>{patient.phoneNumber}</td>
                  <td>
                    <span className="badge badge-primary">{patient.bloodGroup || 'N/A'}</span>
                  </td>
                  <td>{formatDate(patient.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/patients/edit/${patient._id}`} className="btn-icon btn-view" title="View Details">
                        👁️
                      </Link>
                      <Link to={`/patients/edit/${patient._id}`} className="btn-icon btn-edit" title="Edit">
                        ✏️
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No Patients Found</h3>
            <p>No patients match your search criteria. Try adjusting your search or add a new patient.</p>
            <Link to="/patients/new" className="btn btn-primary">
              ➕ Add First Patient
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
