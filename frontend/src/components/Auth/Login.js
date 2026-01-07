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
      <div className="login-card">
        <div className="auth-logo">
          <div className="logo-icon">🏥</div>
          <h1>Medical Management</h1>
          <p>Hospital & Clinic Management System</p>
          <span className="demo-badge">✨ DEMO MODE</span>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>👤 Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter any username"
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter any password"
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🚀 Login to Dashboard'}
          </button>
        </form>
        
        <div className="demo-info">
          <h3>🎯 Demo Mode Features:</h3>
          <ul>
            <li>No backend or database needed</li>
            <li>Login with any credentials</li>
            <li>Explore all 6 modules with sample data</li>
            <li>Add & view patients in real-time</li>
            <li>Indian currency formatting (₹)</li>
            <li>Professional healthcare UI</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
