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
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h3>🏥 Medical Management</h3>
        </Link>
        
        <ul className="navbar-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/patients">Patients</Link></li>
          <li><Link to="/appointments">Appointments</Link></li>
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
          <span className="user-info">
            {user?.fullName} ({user?.role})
          </span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
