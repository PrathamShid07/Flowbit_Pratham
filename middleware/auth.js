// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');


 // Middleware to authenticate user via JWT token
 
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};


//  Middleware to ensure user has admin role
 
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};


//  Middleware to ensure user belongs to a specific tenant
 
const tenantOnly = (allowedTenants = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (allowedTenants.length > 0 && !allowedTenants.includes(req.user.customerId)) {
      return res.status(403).json({ error: 'Tenant access denied' });
    }
    
    next();
  };
};

module.exports = { auth, adminOnly, tenantOnly };