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
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      {/* Left: Brand */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: '#1f2937',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          🏥
        </div>
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            lineHeight: '1'
          }}>
            MediCare Pro
          </h2>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0,
            marginTop: '0.125rem'
          }}>
            Healthcare Management
          </p>
        </div>
      </Link>
      
      {/* Right: User Info & Logout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.375rem',
            background: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.875rem'
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1f2937',
              lineHeight: '1'
            }}>
              {user?.fullName || user?.username || 'User'}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.125rem'
            }}>
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.625rem 1.25rem',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            color: '#4b5563',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1f2937';
            e.currentTarget.style.borderColor = '#1f2937';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
