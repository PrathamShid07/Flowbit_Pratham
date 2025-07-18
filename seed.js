require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // ✅ Connect first
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowbit';
    await mongoose.connect(mongoUri, { autoIndex: false });
    console.log('📦 Connected to MongoDB');

    // ✅ Define schemas inline to avoid model buffering issues
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      customerId: { type: String, required: true, enum: ['LogisticsCo', 'RetailGmbH'] },
      role: { type: String, enum: ['admin', 'user'], default: 'user' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    userSchema.pre('save', async function (next) {
      this.updatedAt = new Date();
      if (!this.isModified('password')) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    const ticketSchema = new mongoose.Schema({
      title: String,
      description: String,
      customerId: { type: String, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
      priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

    // ✅ Clear old data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ✅ Create users
    const users = await User.create([
      { email: 'admin@logisticsco.com', password: 'admin123', customerId: 'LogisticsCo', role: 'admin' },
      { email: 'user@logisticsco.com', password: 'user123', customerId: 'LogisticsCo', role: 'user' },
      { email: 'admin@retailgmbh.com', password: 'admin123', customerId: 'RetailGmbH', role: 'admin' },
      { email: 'user@retailgmbh.com', password: 'user123', customerId: 'RetailGmbH', role: 'user' }
    ]);

    console.log('👥 Created users:');
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ${user.customerId}`);
    });

    // ✅ Create tickets
    const tickets = await Ticket.create([
      { title: 'Server Performance Issue', description: 'Server slow', customerId: 'LogisticsCo', createdBy: users[0]._id, status: 'pending', priority: 'high' },
      { title: 'Database Backup Failed', description: 'Backup failed', customerId: 'LogisticsCo', createdBy: users[1]._id, status: 'in-progress', priority: 'medium' },
      { title: 'SSL Certificate Renewal', description: 'SSL expiring soon', customerId: 'LogisticsCo', createdBy: users[0]._id, status: 'completed', priority: 'low' },
      { title: 'Payment Gateway Down', description: 'Payments failing', customerId: 'RetailGmbH', createdBy: users[2]._id, status: 'pending', priority: 'high' },
      { title: 'Inventory Sync Issue', description: 'Warehouse mismatch', customerId: 'RetailGmbH', createdBy: users[3]._id, status: 'in-progress', priority: 'medium' },
      { title: 'Email Campaign', description: 'Marketing launch', customerId: 'RetailGmbH', createdBy: users[2]._id, status: 'completed', priority: 'low' }
    ]);

    console.log('🎫 Created sample tickets:');
    tickets.forEach(t => console.log(`   - ${t.title} (${t.status}) - ${t.customerId}`));

    // ✅ Show login info
    console.log('\n🔐 Login Credentials:');
    console.log('LogisticsCo:');
    console.log('  Admin: admin@logisticsco.com / admin123');
    console.log('  User:  user@logisticsco.com / user123');
    console.log('RetailGmbH:');
    console.log('  Admin: admin@retailgmbh.com / admin123');
    console.log('  User:  user@retailgmbh.com / user123');

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
