require('dotenv').config();
const mongoose = require('mongoose');

async function seedTenants() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowbit';
    await mongoose.connect(mongoUri, { autoIndex: false });
    console.log('🏢 Connected to MongoDB (Tenants)');

    // ✅ Inline schema to avoid buffering issue
    const tenantSchema = new mongoose.Schema({
      name: {
        type: String,
        enum: ['TenantA', 'TenantB', 'TestTenant'], // update this if needed
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

    const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);

    // ✅ Clear old tenants
    await Tenant.deleteMany({});
    console.log('🗑️  Cleared existing tenants');

    // ✅ Insert sample tenants
    const tenants = await Tenant.create([
      {
        name: 'TenantA',
        customerId: 'LogisticsCo',
        email: 'admin@logisticsco.com',
        plan: 'starter'
      },
      {
        name: 'TenantB',
        customerId: 'RetailGmbH',
        email: 'admin@retailgmbh.com',
        plan: 'starter'
      },
      {
        name: 'TestTenant',
        customerId: 'test123',
        email: 'admin@test.com',
        plan: 'starter'
      }
    ]);

    console.log('✅ Seeded Tenants:');
    tenants.forEach(t => {
      console.log(`   - ${t.name} (${t.customerId})`);
    });

    console.log('\n✅ Tenants seeded successfully!');
  } catch (error) {
    console.error('❌ Tenant seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedTenants();
