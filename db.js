const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async (uri) => {
  if (isConnected) {
    console.log('📊 Already connected to MongoDB');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (!isConnected) return;
  
  await mongoose.disconnect();
  isConnected = false;
  console.log('📊 MongoDB Disconnected');
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected: () => isConnected
};