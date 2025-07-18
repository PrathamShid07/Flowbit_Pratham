const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['TenantA', 'TenantB', 'TestTenant'],
    required: true
  },
  customerId: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['starter', 'pro', 'enterprise'],
    required: true
  }
});

// ✅ Only register model once
module.exports = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
