// frontend-shell/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { screensAPI, ticketsAPI } from '../utils/api';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    inProgressTickets: 0,
    completedTickets: 0
  });
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: access response.screens instead of response.data.screens
      const screensResponse = await screensAPI.getMyScreens();
      setScreens(screensResponse.screens || []);

      const ticketsResponse = await ticketsAPI.getTickets();
      const tickets = ticketsResponse.tickets || [];

      console.log('Tickets:', tickets);

      const statsData = {
        totalTickets: tickets.length,
        pendingTickets: tickets.filter(t => t.status === 'pending').length,
        inProgressTickets: tickets.filter(t => t.status === 'in-progress').length,
        completedTickets: tickets.filter(t => t.status === 'completed').length
      };

      setStats(statsData);
    } catch (error) {
      console.error('Dashboard load error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = () => {
    switch (user?.customerId) {
      case 'LogisticsCo':
        return '#2563eb';
      case 'RetailGmbH':
        return '#dc2626';
      default:
        return '#3182ce';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button
          className="btn btn-primary"
          onClick={loadDashboardData}
          style={{ marginLeft: '12px' }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1 className="logo">📊 Dashboard</h1>
          <p style={{ color: '#4a5568', fontSize: '14px', marginTop: '4px' }}>
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="user-info">
          <span className="badge">{user?.customerId}</span>
          <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : ''}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        {/* Total */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: getThemeColor(),
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'white', fontSize: '18px' }}>🎫</span>
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.totalTickets}
              </h3>
              <p style={{ color: '#4a5568', fontSize: '14px' }}>Total Tickets</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ed8936',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'white', fontSize: '18px' }}>⏳</span>
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.pendingTickets}
              </h3>
              <p style={{ color: '#4a5568', fontSize: '14px' }}>Pending</p>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3182ce',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'white', fontSize: '18px' }}>🔄</span>
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.inProgressTickets}
              </h3>
              <p style={{ color: '#4a5568', fontSize: '14px' }}>In Progress</p>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#38a169',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'white', fontSize: '18px' }}>✅</span>
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>
                {stats.completedTickets}
              </h3>
              <p style={{ color: '#4a5568', fontSize: '14px' }}>Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screens */}
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#2d3748' }}>
          🚀 Available Screens
        </h2>
        <p style={{ color: '#4a5568', marginBottom: '20px' }}>
          Click on any screen to navigate to it
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="card"
              style={{
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s'
              }}
              onClick={() => window.location.href = screen.path}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {screen.icon === 'ticket' ? '🎫' :
                    screen.icon === 'dashboard' ? '📊' :
                      screen.icon === 'box' ? '📦' : '⚙️'}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>
                  {screen.name}
                </h3>
                <p style={{ color: '#4a5568', fontSize: '12px' }}>
                  {screen.path}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#2d3748' }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/support-tickets'}
            style={{ backgroundColor: getThemeColor() }}
          >
            🎫 Create New Ticket
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/support-tickets'}
            style={{ backgroundColor: getThemeColor() }}
          >
            📋 View All Tickets
          </button>
          <button
            className="btn btn-primary"
            onClick={loadDashboardData}
            style={{ backgroundColor: '#4a5568' }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <h2 style={{ marginBottom: '16px', color: '#2d3748' }}>
          ℹ️ System Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              <strong>Tenant:</strong> {user?.customerId}
            </p>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              <strong>Role:</strong> {user?.role}
            </p>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          <div>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              <strong>Available Screens:</strong> {screens.length}
            </p>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleString()}
            </p>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              <strong>Version:</strong> 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
