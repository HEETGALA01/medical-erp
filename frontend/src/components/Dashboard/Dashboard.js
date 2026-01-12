import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllPatients } from '../../data/mockData';
import { formatCurrency, formatDate, calculateAge } from '../../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  // Premium SVG Icons - Monochrome
  const UserPlusIcon = ({ color = "#6b7280" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/>
      <line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  );

  const DocumentPlusIcon = ({ color = "#6b7280" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  );

  const UsersIcon = ({ color = "#9ca3af" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const CurrencyIcon = ({ color = "#9ca3af" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  const DocumentIcon = ({ color = "#9ca3af" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );

  const ActivityIcon = ({ color = "#9ca3af" }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );

  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayPatients: 0,
    totalRevenue: 0,
    pendingBills: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chart data states with colorful gradients
  const [revenueData] = useState({
    current: [45000, 52000, 49000, 63000, 58000, 71000, 69000],
    previous: [38000, 42000, 45000, 48000, 52000, 55000, 58000],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });
  
  const [patientStats] = useState({
    current: [12, 19, 15, 22, 18, 25, 21],
    previous: [8, 15, 12, 18, 14, 20, 18],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });
  
  const [departmentStats] = useState([
    { name: 'General', value: 35, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { name: 'Surgery', value: 25, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { name: 'Pediatrics', value: 20, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { name: 'Cardiology', value: 12, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { name: 'Others', value: 8, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setTimeout(() => {
      const patients = getAllPatients();
      const totalPatients = patients.length;

      const billings = JSON.parse(localStorage.getItem('mockBillings') || '[]');
      const pendingBills = billings.filter(b => b.status === 'Pending').length;

      const today = new Date().toDateString();
      const todayRevenue = billings
        .filter(b => b.status === 'Paid' && new Date(b.createdAt).toDateString() === today)
        .reduce((sum, bill) => sum + (bill.total || 0), 0);

      const sortedPatients = [...patients].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setStats({
        todayPatients: totalPatients,
        pendingBills: pendingBills,
        totalRevenue: todayRevenue
      });
      setRecentPatients(sortedPatients);
      setLoading(false);
    }, 300);
  };

  // Colorful Donut Chart Component
  const DonutChart = ({ data, size = 200 }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;
    
    const slices = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (currentAngle * Math.PI) / 180;
      const radius = hoveredIndex === index ? size / 2 - 8 : size / 2 - 12;
      const innerRadius = radius * 0.6;
      
      const x1 = size / 2 + radius * Math.cos(startRad);
      const y1 = size / 2 + radius * Math.sin(startRad);
      const x2 = size / 2 + radius * Math.cos(endRad);
      const y2 = size / 2 + radius * Math.sin(endRad);
      
      const x3 = size / 2 + innerRadius * Math.cos(endRad);
      const y3 = size / 2 + innerRadius * Math.sin(endRad);
      const x4 = size / 2 + innerRadius * Math.cos(startRad);
      const y4 = size / 2 + innerRadius * Math.sin(startRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
      
      return { path, color: item.color, percentage: percentage.toFixed(1), name: item.name, value: item.value };
    });
    
    return (
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <filter id="colorfulShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
          </filter>
        </defs>
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            stroke="#fff"
            strokeWidth="3"
            filter={hoveredIndex === index ? "url(#colorfulShadow)" : "none"}
            style={{ 
              transition: 'all 0.3s',
              cursor: 'pointer',
              opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
        <circle cx={size / 2} cy={size / 2} r={(size / 2 - 12) * 0.6} fill="#ffffff" />
        <text
          x={size / 2}
          y={size / 2 - 6}
          textAnchor="middle"
          style={{ fontSize: '1.75rem', fontWeight: '900', fill: hoveredIndex !== null ? slices[hoveredIndex].color : '#1f2937' }}
        >
          {hoveredIndex !== null ? slices[hoveredIndex].value : total}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          style={{ fontSize: '0.7rem', fontWeight: '600', fill: '#6b7280', textTransform: 'uppercase' }}
        >
          {hoveredIndex !== null ? slices[hoveredIndex].name : 'Total'}
        </text>
      </svg>
    );
  };

  // Colorful Area Chart Component
  const AreaChart = ({ data, height = 280 }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const maxValue = Math.max(...data.current, ...data.previous) * 1.1;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 700;
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;
    
    const getX = (index) => padding.left + (index * chartWidth) / (data.labels.length - 1);
    const getY = (value) => height - padding.bottom - (value / maxValue) * chartHeight;
    
    const currentPath = data.current.map((value, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(value)}`).join(' ');
    const currentAreaPath = currentPath + ` L ${getX(data.current.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;
    const previousPath = data.previous.map((value, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(value)}`).join(' ');
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="colorfulGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={padding.top + chartHeight * percent}
              x2={width - padding.right}
              y2={padding.top + chartHeight * percent}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={padding.top + chartHeight * percent}
              textAnchor="end"
              alignmentBaseline="middle"
              style={{ fontSize: '0.7rem', fill: '#6b7280', fontWeight: '500' }}
            >
              {formatCurrency(Math.round(maxValue * (1 - percent)))}
            </text>
          </g>
        ))}
        
        <path d={previousPath} fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
        <path d={currentAreaPath} fill="url(#colorfulGradient)" />
        <path d={currentPath} fill="none" stroke="#3b82f6" strokeWidth="3" />
        
        {data.current.map((value, index) => (
          <g key={index}>
            <circle
              cx={getX(index)}
              cy={getY(value)}
              r={hoveredIndex === index ? 6 : 4}
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {hoveredIndex === index && (
              <g>
                <rect x={getX(index) - 35} y={getY(value) - 42} width="70" height="32" fill="#1f2937" rx="6" opacity="0.95" />
                <text x={getX(index)} y={getY(value) - 28} textAnchor="middle" style={{ fontSize: '0.7rem', fill: '#9ca3af', fontWeight: '600' }}>
                  {data.labels[index]}
                </text>
                <text x={getX(index)} y={getY(value) - 16} textAnchor="middle" style={{ fontSize: '0.85rem', fill: '#ffffff', fontWeight: '700' }}>
                  {formatCurrency(value)}
                </text>
              </g>
            )}
          </g>
        ))}
        
        {data.labels.map((label, index) => (
          <text
            key={index}
            x={getX(index)}
            y={height - 8}
            textAnchor="middle"
            style={{ fontSize: '0.75rem', fill: '#6b7280', fontWeight: '500' }}
          >
            {label}
          </text>
        ))}
      </svg>
    );
  };

  // Colorful Bar Chart Component
  const BarChart = ({ data, height = 280 }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const maxValue = Math.max(...data.current, ...data.previous) * 1.1;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 700;
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;
    const barGroupWidth = chartWidth / data.labels.length;
    const barWidth = barGroupWidth * 0.35;
    
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e'];
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {colors.map((color, i) => (
            <linearGradient key={i} id={`bar${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>
        
        {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={padding.top + chartHeight * percent}
              x2={width - padding.right}
              y2={padding.top + chartHeight * percent}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={padding.top + chartHeight * percent}
              textAnchor="end"
              alignmentBaseline="middle"
              style={{ fontSize: '0.7rem', fill: '#6b7280', fontWeight: '500' }}
            >
              {Math.round(maxValue * (1 - percent))}
            </text>
          </g>
        ))}
        
        {data.labels.map((label, index) => {
          const x = padding.left + index * barGroupWidth + barGroupWidth / 2;
          const currentHeight = (data.current[index] / maxValue) * chartHeight;
          const previousHeight = (data.previous[index] / maxValue) * chartHeight;
          const isHovered = hoveredIndex === index;
          const colorIndex = index % colors.length;
          
          return (
            <g key={index}>
              <rect
                x={x - barWidth - 3}
                y={height - padding.bottom - previousHeight}
                width={barWidth}
                height={previousHeight}
                fill="#e5e7eb"
                rx="4"
                opacity={0.5}
              />
              <rect
                x={x + 3}
                y={height - padding.bottom - currentHeight}
                width={barWidth}
                height={currentHeight}
                fill={`url(#bar${colorIndex})`}
                rx="4"
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {isHovered && (
                <g>
                  <rect x={x - 30} y={height - padding.bottom - currentHeight - 38} width="60" height="32" fill={colors[colorIndex]} rx="6" opacity="0.95" />
                  <text x={x} y={height - padding.bottom - currentHeight - 20} textAnchor="middle" style={{ fontSize: '0.85rem', fill: '#ffffff', fontWeight: '700' }}>
                    {data.current[index]}
                  </text>
                  <text x={x} y={height - padding.bottom - currentHeight - 8} textAnchor="middle" style={{ fontSize: '0.65rem', fill: '#ffffff', fontWeight: '500', opacity: 0.9 }}>
                    patients
                  </text>
                </g>
              )}
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                style={{ fontSize: '0.75rem', fill: '#6b7280', fontWeight: '500' }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard-container" style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* Monochrome Premium Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        padding: '2rem',
        borderRadius: '1.25rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: '#ffffff', 
              marginBottom: '0.5rem',
              letterSpacing: '-0.025em'
            }}>
              Welcome back, {user?.fullName || user?.username || 'User'}
            </h1>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '0.9375rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ 
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: '#e5e7eb'
              }}>
                {user?.role || 'Admin'}
              </span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <span style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: '700' }}>Operational</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards with Navigation - Monochrome */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem'
        }}>
          <Link to="/patients" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '0.875rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '0.75rem'
                }}>
                  <UsersIcon color="#e5e7eb" />
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: '700' }}>↗ 12%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Patients
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1' }}>
                {stats.todayPatients || 0}
              </div>
            </div>
          </Link>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '0.875rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '0.75rem'
              }}>
                <CurrencyIcon color="#e5e7eb" />
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: '700' }}>↗ 8%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Revenue Today
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1' }}>
              {formatCurrency(stats.totalRevenue || 0)}
            </div>
          </div>

          <Link to="/billing" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '0.875rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '0.75rem'
                }}>
                  <DocumentIcon color="#e5e7eb" />
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#ef4444', fontWeight: '700' }}>↘ 3%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending Bills
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1' }}>
                {stats.pendingBills || 0}
              </div>
            </div>
          </Link>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '0.875rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '0.75rem'
              }}>
                <ActivityIcon color="#e5e7eb" />
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: '700' }}>↗ 15%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Today
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1' }}>
              {recentPatients.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar - Monochrome with Premium Icons */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <Link to="/patients/new" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '1.25rem 1.75rem',
            background: '#ffffff',
            borderRadius: '1rem',
            border: '2px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.borderColor = '#1f2937';
            e.currentTarget.style.background = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = '#ffffff';
          }}
          >
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#111827', marginBottom: '0.25rem' }}>
                Register Patient
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                Add new patient records
              </div>
            </div>
            <div style={{ 
              padding: '0.75rem',
              background: '#f3f4f6',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              <UserPlusIcon color="#374151" />
            </div>
          </div>
        </Link>

        <Link to="/billing/new" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '1.25rem 1.75rem',
            background: '#ffffff',
            borderRadius: '1rem',
            border: '2px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.borderColor = '#1f2937';
            e.currentTarget.style.background = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = '#ffffff';
          }}
          >
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#111827', marginBottom: '0.25rem' }}>
                Create Bill
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                Generate new billing
              </div>
            </div>
            <div style={{ 
              padding: '0.75rem',
              background: '#f3f4f6',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
              <DocumentPlusIcon color="#374151" />
            </div>
          </div>
        </Link>
      </div>

      {/* Main Dashboard Grid - Optimized Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Top Row - Revenue Analytics (left) and Department Mix (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
          
          {/* Left Column - Revenue and Patient Visits stacked */}
          <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Revenue Chart */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '1rem 1rem 0 0', 
              border: '1px solid #e5e7eb',
              borderBottom: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              padding: '1.75rem'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '800', 
                color: '#111827', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ width: '4px', height: '20px', background: '#3b82f6', borderRadius: '2px' }}></span>
                Revenue Analytics
              </h3>
              <AreaChart data={revenueData} height={280} />
            </div>

            {/* Patient Visits - Directly below Revenue with no gap */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '0 0 1rem 1rem', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              padding: '1.75rem',
              paddingTop: '1rem'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '800', 
                color: '#111827', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ width: '4px', height: '20px', background: '#ec4899', borderRadius: '2px' }}></span>
                Patient Visits Overview
              </h3>
              <BarChart data={patientStats} height={280} />
            </div>
          </div>

          {/* Right Column - Department Mix */}
          <div style={{ gridColumn: 'span 4' }}>
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '1rem', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              padding: '1.75rem'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '800', 
                color: '#111827', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ width: '4px', height: '20px', background: '#8b5cf6', borderRadius: '2px' }}></span>
                Department Mix
              </h3>
              <DonutChart data={departmentStats} size={200} />
              <div style={{ marginTop: '1.5rem' }}>
                {departmentStats.map((dept, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.625rem 0.875rem',
                    marginBottom: '0.5rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${dept.color}10`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: '10px', height: '10px', background: dept.color, borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '600' }}>{dept.name}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '800', color: dept.color }}>{dept.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Records Table - Full Width */}
        <div style={{ gridColumn: 'span 12' }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '1rem', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: '1.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '800', 
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ width: '4px', height: '20px', background: '#10b981', borderRadius: '2px' }}></span>
                All Patient Records
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  color: '#6b7280', 
                  background: '#f3f4f6', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '0.5rem' 
                }}>
                  {recentPatients.length} Total
                </span>
              </h3>
              <Link to="/patients">
                <button style={{
                  padding: '0.625rem 1.25rem',
                  background: '#1f2937',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#111827';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1f2937';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  View All →
                </button>
              </Link>
            </div>
            
            {recentPatients.length > 0 ? (
              <div style={{ 
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: '600px',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>ID</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Name</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Age</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Gender</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Contact</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Registered</th>
                      <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((patient, index) => {
                      if (!patient || (!patient.firstName && !patient.name)) return null;
                      
                      const fullName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
                      const contactNumber = patient.contactNumber || patient.phoneNumber || 'N/A';
                      
                      // Monochrome gray shades
                      const grayColors = ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#1f2937'];
                      const color = grayColors[index % grayColors.length];
                      
                      return (
                        <tr key={patient._id || patient.id} style={{ 
                          background: '#ffffff',
                          transition: 'all 0.2s',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                        }}
                        >
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: '700', color: '#6b7280' }}>
                            #{patient.patientId || patient.id}
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                background: color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontWeight: '700',
                                fontSize: '0.875rem'
                              }}>
                                {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                              </div>
                              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1f2937' }}>
                                {fullName || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>
                            {patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : '-'} yrs
                          </td>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <span style={{ 
                              padding: '0.25rem 0.75rem',
                              background: patient.gender === 'Male' ? '#dbeafe' : '#fce7f3',
                              color: patient.gender === 'Male' ? '#1e40af' : '#be185d',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '700'
                            }}>
                              {patient.gender || 'N/A'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>
                            {contactNumber}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>
                            {patient.createdAt ? formatDate(patient.createdAt) : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <Link to={`/patients/edit/${patient._id || patient.id}`}>
                              <button style={{
                                padding: '0.5rem 1rem',
                                background: '#1f2937',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#111827';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#1f2937';
                              }}
                              >
                                View →
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: '1rem', fontWeight: '600' }}>
                No patient records found. Start by registering a new patient!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
