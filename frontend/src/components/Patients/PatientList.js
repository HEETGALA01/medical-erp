import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { exportToCSV, formatDate, calculateAge } from '../../utils/helpers';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`/api/patients?search=${search}`);
      setPatients(response.data.patients);
    } catch (error) {
      toast.error('Error fetching patients');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = patients.map(p => ({
      'Patient ID': p.patientId,
      'Name': p.fullName,
      'Age': calculateAge(p.dateOfBirth),
      'Gender': p.gender,
      'Phone': p.phoneNumber,
      'Email': p.email || '',
      'Blood Group': p.bloodGroup || '',
      'Registered': formatDate(p.createdAt)
    }));
    exportToCSV(exportData, 'patients');
  };

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Patients</h1>
        <div className="header-actions">
          <button onClick={handleExport} className="btn btn-secondary">
            📥 Export CSV
          </button>
          <Link to="/patients/new" className="btn btn-primary">
            ➕ Add Patient
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age/Gender</th>
              <th>Phone</th>
              <th>Blood Group</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.patientId}</td>
                  <td>{patient.fullName}</td>
                  <td>{calculateAge(patient.dateOfBirth)} / {patient.gender}</td>
                  <td>{patient.phoneNumber}</td>
                  <td>{patient.bloodGroup || '-'}</td>
                  <td>{formatDate(patient.createdAt)}</td>
                  <td>
                    <Link to={`/patients/edit/${patient._id}`} className="btn btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
