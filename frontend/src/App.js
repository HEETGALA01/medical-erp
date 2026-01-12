import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import BillingList from './components/Billing/BillingList';
import BillingForm from './components/Billing/BillingForm';
import ConsultationList from './components/Consultations/ConsultationList';
import ConsultationForm from './components/Consultations/ConsultationForm';
import ConsultationView from './components/Consultations/ConsultationView';
import PharmacyDashboard from './components/Pharmacy/PharmacyDashboard';
import LaboratoryDashboard from './components/Laboratory/LaboratoryDashboard';
import Sidebar from './components/Layout/Sidebar';
import PrivateRoute from './components/Auth/PrivateRoute';

// Layout wrapper to conditionally show Navbar and Sidebar
function AppLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Don't show Navbar and Sidebar on login page
  const showLayout = isAuthenticated && location.pathname !== '/login';
  
  return (
    <>
      {showLayout && <Sidebar />}
      <div style={{
        marginTop: 0,
        marginLeft: showLayout ? '260px' : '0',
        minHeight: '100vh',
        background: '#f8fafc',
        padding: showLayout ? '2rem' : '0'
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
          <Route path="/patients/new" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
          <Route path="/patients/edit/:id" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
          <Route path="/consultations" element={<PrivateRoute><ConsultationList /></PrivateRoute>} />
          <Route path="/consultations/new" element={<PrivateRoute><ConsultationForm /></PrivateRoute>} />
          <Route path="/consultations/edit/:id" element={<PrivateRoute><ConsultationForm /></PrivateRoute>} />
          <Route path="/consultations/view/:id" element={<PrivateRoute><ConsultationView /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><BillingList /></PrivateRoute>} />
          <Route path="/billing/new" element={<PrivateRoute><BillingForm /></PrivateRoute>} />
          <Route path="/pharmacy" element={<PrivateRoute><PharmacyDashboard /></PrivateRoute>} />
          <Route path="/laboratory" element={<PrivateRoute><LaboratoryDashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppLayout />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
