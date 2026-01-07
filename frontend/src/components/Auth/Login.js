import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div className="login-card">
        <div className="auth-logo">
          <div className="logo-icon-wrapper">
            <div className="logo-icon">🏥</div>
            <div className="logo-glow"></div>
          </div>
          <h1>Medical ERP System</h1>
          <p className="subtitle">Complete Hospital Management Solution</p>
          <span className="demo-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">DEMO MODE</span>
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <span className="label-icon">👤</span>
              <span className="label-text">Username</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
                autoComplete="username"
              />
              <span className="input-focus-border"></span>
            </div>
          </div>
          
          <div className="form-group">
            <label>
              <span className="label-icon">🔒</span>
              <span className="label-text">Password</span>
            </label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <span className="input-focus-border"></span>
            </div>
          </div>
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                <span>Login to Dashboard</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>
        
        <div className="divider">
          <span className="divider-text">Quick Access</span>
        </div>
        
        <div className="demo-credentials">
          <div className="credentials-grid">
            <div className="credential-card">
              <div className="credential-icon">👨‍⚕️</div>
              <div className="credential-info">
                <span className="credential-label">Admin</span>
                <span className="credential-value">admin / admin123</span>
              </div>
            </div>
            <div className="credential-card">
              <div className="credential-icon">👨‍⚕️</div>
              <div className="credential-info">
                <span className="credential-label">Doctor</span>
                <span className="credential-value">doctor / doctor123</span>
              </div>
            </div>
            <div className="credential-card">
              <div className="credential-icon">🧪</div>
              <div className="credential-info">
                <span className="credential-label">Test</span>
                <span className="credential-value">test / test</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <span className="feature-text">6 Complete Modules</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💾</span>
            <span className="feature-text">Data Persistence</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">₹</span>
            <span className="feature-text">Indian Currency</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span className="feature-text">Modern UI/UX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
