import React, { useState, useEffect } from 'react';
import { screensAPI } from '../utils/api';

const Navigation = ({ user, onLogout, onScreenSelect, activeScreen }) => {
  const [screens, setScreens] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: directly using response without assuming nested .data
      const response = await screensAPI.getMyScreens();
      setScreens(response.screens || []);
      setTenant(response.tenant || null);

    } catch (err) {
      console.error('Error fetching screens:', err);
      setError('Failed to load screens');
    } finally {
      setLoading(false);
    }
  };

  const getIconForScreen = (iconName) => {
    const icons = {
      dashboard: '📊',
      ticket: '🎫',
      box: '📦',
      inventory: '📋',
      default: '📄'
    };
    return icons[iconName] || icons.default;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="header">
        <div className="logo">
          {tenant?.displayName || 'Flowbit'}
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong style={{ color: '#2d3748' }}>{user.email}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`badge ${user.role === 'admin' ? 'badge-admin' : ''}`}>
            {user.role.toUpperCase()}
          </span>
          <span className="badge">
            {user.customerId}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1 }}>
        {loading ? (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 auto' }}></div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#4a5568' }}>
              Loading screens...
            </div>
          </div>
        ) : error ? (
          <div style={{ padding: '16px', color: '#e53e3e', fontSize: '12px' }}>
            {error}
          </div>
        ) : (
          <>
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => {
                  onScreenSelect?.(screen); // optional chaining for safety
                  window.location.href = screen.path; // also navigate
                }}
                className={`nav-item ${activeScreen?.id === screen.id ? 'active' : ''}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#2d3748'
                }}
              >
                <span style={{ fontSize: '16px' }}>
                  {getIconForScreen(screen.icon)}
                </span>
                <span>{screen.name}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
        <button
          onClick={handleLogout}
          className="btn-logout"
          style={{ width: '100%' }}
        >
          Logout
        </button>

        <div style={{
          marginTop: '12px',
          fontSize: '11px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          <div>Flowbit Challenge</div>
          <div>Tenant: {tenant?.displayName || '—'}</div>
          <div>Screens: {screens.length}</div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
