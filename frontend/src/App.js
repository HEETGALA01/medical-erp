import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import AppointmentList from './components/Appointments/AppointmentList';
import AppointmentForm from './components/Appointments/AppointmentForm';
import ConsultationForm from './components/Consultation/ConsultationForm';
import BillingList from './components/Billing/BillingList';
import BillingForm from './components/Billing/BillingForm';
import PharmacyDashboard from './components/Pharmacy/PharmacyDashboard';
import LaboratoryDashboard from './components/Laboratory/LaboratoryDashboard';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
            <Route path="/patients/new" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
            <Route path="/patients/edit/:id" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><AppointmentList /></PrivateRoute>} />
            <Route path="/appointments/new" element={<PrivateRoute><AppointmentForm /></PrivateRoute>} />
            <Route path="/consultation/:appointmentId" element={<PrivateRoute><ConsultationForm /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><BillingList /></PrivateRoute>} />
            <Route path="/billing/new" element={<PrivateRoute><BillingForm /></PrivateRoute>} />
            <Route path="/pharmacy" element={<PrivateRoute><PharmacyDashboard /></PrivateRoute>} />
            <Route path="/laboratory" element={<PrivateRoute><LaboratoryDashboard /></PrivateRoute>} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
