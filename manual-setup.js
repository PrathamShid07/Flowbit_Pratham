require('dotenv').config();
const mongoose = require('mongoose');

// ✅ Define schema inline — skip external model
const tenantSchema = new mongoose.Schema({
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

// ✅ Register model safely
const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flowbit', {
      autoIndex: false // ✅ prevent index hangs
    });
    console.log("✅ Connected to MongoDB");

    const tenant = new Tenant({
      customerId: 'tenant123',
      name: 'TestTenant',
      email: 'admin@tenant.com',
      plan: 'starter',
    });

    await tenant.save(); // ✅ should now work
    console.log("✅ Tenant created:", tenant);
  } catch (err) {
    console.error("❌ Error during setup:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
