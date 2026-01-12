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

  // Premium SVG Icons
  const DashboardIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <rect x="14" y="14" width="7" height="7" rx="1" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
    </svg>
  );

  const PatientsIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const ConsultationsIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  const BillingIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );

  const PharmacyIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill={active ? "rgba(16, 185, 129, 0.1)" : "none"}/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );

  const LaboratoryIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v7l-4 6.5A2 2 0 0 0 6.5 20h11a2 2 0 0 0 1.5-3.5L15 10V3" fill={active ? "rgba(16, 185, 129, 0.05)" : "none"}/>
      <line x1="9" y1="3" x2="15" y2="3"/>
      <line x1="9" y1="7" x2="15" y2="7"/>
    </svg>
  );

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: DashboardIcon,
      roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician']
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: PatientsIcon,
      roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician']
    },
    {
      path: '/consultations',
      label: 'Consultations',
      icon: ConsultationsIcon,
      roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician']
    },
    {
      path: '/billing',
      label: 'Billing',
      icon: BillingIcon,
      roles: ['Admin', 'Receptionist']
    },
    {
      path: '/pharmacy',
      label: 'Pharmacy',
      icon: PharmacyIcon,
      roles: ['Admin', 'Pharmacist']
    },
    {
      path: '/laboratory',
      label: 'Laboratory',
      icon: LaboratoryIcon,
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
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      borderRight: '1px solid rgba(16, 185, 129, 0.1)',
      boxShadow: '2px 0 20px rgba(0, 0, 0, 0.15)',
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
        borderBottom: '1px solid rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            🏥
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              lineHeight: '1',
              letterSpacing: '-0.5px',
              textShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}>
              Healium
            </h2>
            <p style={{
              fontSize: '0.75rem',
              color: '#a5b4fc',
              margin: 0,
              marginTop: '0.25rem',
              fontWeight: '600'
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
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                background: isActive(item.path) 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
                  : 'transparent',
                color: isActive(item.path) ? '#10b981' : '#cbd5e1',
                fontWeight: isActive(item.path) ? '600' : '500',
                fontSize: '0.9375rem',
                border: isActive(item.path) 
                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                  : '1px solid transparent',
                boxShadow: isActive(item.path) 
                  ? '0 4px 16px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                  e.currentTarget.style.color = '#10b981';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '0.5rem',
                background: isActive(item.path)
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'rgba(148, 163, 184, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: isActive(item.path)
                  ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                  : 'none'
              }}>
                <Icon active={isActive(item.path)} />
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive(item.path) && (
                <div style={{
                  width: '4px',
                  height: '20px',
                  background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Role Badge at Bottom */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderTop: '1px solid rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{
          padding: '0.875rem 1rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '700',
            color: 'white',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            {user?.role?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontWeight: '500'
            }}>
              Logged in as
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#10b981',
              fontWeight: '700',
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
