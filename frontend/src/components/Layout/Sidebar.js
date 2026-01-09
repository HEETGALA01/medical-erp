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
      top: '70px',
      left: 0,
      width: '260px',
      height: 'calc(100vh - 70px)',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.03)',
      zIndex: 900,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      overflowY: 'auto'
    }}>
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
              background: isActive(item.path) 
                ? '#1f2937'
                : 'transparent',
              color: isActive(item.path) ? 'white' : '#4b5563',
              fontWeight: isActive(item.path) ? '600' : '500',
              fontSize: '0.9375rem',
              border: isActive(item.path) ? 'none' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.color = '#1f2937';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#4b5563';
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
                background: 'white',
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
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          padding: '0.875rem 1rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.375rem',
            background: '#1f2937',
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
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Logged in as
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#1f2937',
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
