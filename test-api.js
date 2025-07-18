// scripts/test-api.js
const axios = require('axios');
const http = require('http');
require('dotenv').config();

const app = require('../backend/server');
const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Test server running on port ${PORT}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

async function testAPI() {
  const server = await startServer();

  try {
    console.log('🧪 Testing Flowbit API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Health check passed:', healthResponse.data.status);

    // Add more tests here if needed

    console.log('\n🎉 Basic test passed. Server and /health are working.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message || error);
    process.exit(1);
  } finally {
    // Shutdown server after test
    server.close(() => {
      console.log('🛑 Test server shut down.');
    });
  }
}

testAPI();
