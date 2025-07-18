import React, { useState } from 'react';
import { authAPI, setAuthToken, setUser } from '../utils/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Store token and user data
      setAuthToken(response.token);
      setUser(response.user);
      
      // Call the onLogin callback
      onLogin(response.user);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
  { email: 'admin@logisticsco.com', password: 'admin123', label: 'LogisticsCo Admin' },
  { email: 'user@logisticsco.com', password: 'admin123', label: 'LogisticsCo User' },
  { email: 'admin@retailgmbh.com', password: 'admin123', label: 'RetailGmbH Admin' },
  { email: 'user@retailgmbh.com', password: 'admin123', label: 'RetailGmbH User' },
];

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#2d3748', marginBottom: '8px' }}>
            Welcome to Flowbit
          </h1>
          <p style={{ color: '#4a5568' }}>
            Multi-Tenant Platform
          </p>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ 
            fontSize: '14px', 
            color: '#4a5568', 
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Demo Credentials
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#4a5568',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#edf2f7';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f7fafc';
                }}
              >
                {cred.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f7fafc',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#4a5568'
        }}>
          <strong>Challenge Demo:</strong> Each tenant has isolated data and screens.
          Try logging in with different credentials to see tenant separation.
        </div>
      </div>
    </div>
  );
};

export default Login;