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
import PharmacyDashboard from './components/Pharmacy/PharmacyDashboard';
import LaboratoryDashboard from './components/Laboratory/LaboratoryDashboard';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';

// Layout wrapper to conditionally show Navbar
function AppLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Don't show Navbar on login page
  const showNavbar = isAuthenticated && location.pathname !== '/login';
  
  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "main-content" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
          <Route path="/patients/new" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
          <Route path="/patients/edit/:id" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
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
