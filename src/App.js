// frontend-shell/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import { authAPI, isAuthenticated, getUser, clearAuth } from './utils/api';

// comment out remote import
 const SupportTickets = React.lazy(() => import('supportTickets/App'));

// use dummy component
// const SupportTickets = () => <div>SupportTickets Microfrontend Not Loaded</div>;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (isAuthenticated()) {
        const currentUser = getUser();
        if (currentUser) {
          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } else {
          clearAuth();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setError(null);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading Flowbit...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          {error && (
            <div className="error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Navigation user={user} onLogout={handleLogout} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route 
              path="/support-tickets" 
              element={
                <ErrorBoundary>
                  <React.Suspense fallback={
                    <div className="loading">
                      <div className="spinner"></div>
                      Loading Support Tickets...
                    </div>
                  }>
                    <SupportTickets />
                  </React.Suspense>
                </ErrorBoundary>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Error Boundary for micro-frontends
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Micro-frontend error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ margin: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '16px' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: '#4a5568', marginBottom: '16px' }}>
            The micro-frontend failed to load. This might be because:
          </p>
          <ul style={{ textAlign: 'left', color: '#4a5568', marginBottom: '16px' }}>
            <li>Support Tickets app is not running (http://localhost:3002)</li>
            <li>Network connectivity issues</li>
            <li>Module Federation configuration problem</li>
          </ul>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;