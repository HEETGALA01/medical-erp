import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician']
    },
    {
      path: '/patients',
      label: 'Patients',
      roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician']
    },
    {
      path: '/consultations',
      label: 'Consultations',
      roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician']
    },
    {
      path: '/billing',
      label: 'Billing',
      roles: ['Admin', 'Receptionist']
    },
    {
      path: '/pharmacy',
      label: 'Pharmacy',
      roles: ['Admin', 'Pharmacist']
    },
    {
      path: '/laboratory',
      label: 'Laboratory',
      roles: ['Admin', 'Lab Technician']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '260px',
      height: '100vh',
      background: '#1f2937',
      borderRight: '1px solid rgba(255,255,255,0.04)',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
      zIndex: 900,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      overflowY: 'auto'
    }}>
      {/* Brand Section */}
      <div style={{
        padding: '0 1.5rem 1.5rem 1.5rem',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #374151 0%, #111827 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            🏥
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#f9fafb',
              margin: 0,
              lineHeight: '1',
              letterSpacing: '-0.5px'
            }}>
              Healium
            </h2>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: 0,
              marginTop: '0.25rem',
              fontWeight: '500'
            }}>
              Medical System
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0 1rem'
      }}>
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              position: 'relative',
              background: isActive(item.path) ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: isActive(item.path) ? 'white' : '#9ca3af',
              fontWeight: isActive(item.path) ? '600' : '500',
              fontSize: '0.9375rem',
              border: isActive(item.path) ? 'none' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
          >
            <span>{item.label}</span>
            {isActive(item.path) && (
              <div style={{
                position: 'absolute',
                right: '1rem',
                width: '6px',
                height: '6px',
                background: '#10b981',
                borderRadius: '50%'
              }} />
            )}
          </Link>
        ))}
      </div>

      {/* User Role Badge at Bottom */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{
          padding: '0.875rem 1rem',
          background: 'transparent',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid rgba(255,255,255,0.02)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.375rem',
            background: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'white'
          }}>
            {user?.role?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              Logged in as
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'white',
              fontWeight: '600',
              marginTop: '0.125rem'
            }}>
              {user?.role || 'User'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
