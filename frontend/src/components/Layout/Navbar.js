import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="logo-icon">🏥</span>
          <h2>Medical Management</h2>
        </Link>
        
        <ul className="navbar-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/patients">Patients</Link></li>
          <li><Link to="/consultations">Patient Records</Link></li>
          {(user?.role === 'Admin' || user?.role === 'Receptionist') && (
            <li><Link to="/billing">Billing</Link></li>
          )}
          {(user?.role === 'Admin' || user?.role === 'Pharmacist') && (
            <li><Link to="/pharmacy">Pharmacy</Link></li>
          )}
          {(user?.role === 'Admin' || user?.role === 'Lab Technician') && (
            <li><Link to="/laboratory">Laboratory</Link></li>
          )}
        </ul>
        
        <div className="navbar-user">
          <div className="user-profile">
            <div className="user-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.fullName || user?.username || 'User'}</span>
              <span className="user-role">{user?.role || 'Admin'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
