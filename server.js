const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Dynamic CORS origin handling (allow localhost:3000 & 3001)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const screenRoutes = require('./routes/screens');
const ticketRoutes = require('./routes/tickets');
const webhookRoutes = require('./routes/webhook');

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Flowbit Backend'
  });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/webhook', webhookRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
if (require.main === module) {
  const server = app.listen(PORT, async () => {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/flowbit');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
