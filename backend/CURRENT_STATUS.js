const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5003; // Use port 5003

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Backend is working!',
    port: PORT,
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint requested');
  res.json({ 
    message: 'Backend test successful!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Modules endpoint
app.get('/api/modules', (req, res) => {
  console.log('Modules requested');
  res.json([
    { id: 'water', name: 'Water Supply', icon: 'water' },
    { id: 'electricity', name: 'Electricity', icon: 'bolt' },
    { id: 'traffic', name: 'Traffic', icon: 'traffic' },
    { id: 'bus', name: 'Bus Routes', icon: 'bus' },
    { id: 'waste', name: 'Waste Management', icon: 'trash' },
    { id: 'aqi', name: 'Air Quality', icon: 'wind' },
    { id: 'repairs', name: 'Road Repairs', icon: 'wrench' }
  ]);
});

// Auth register endpoint (supports both GET and POST)
app.all('/api/auth/register', (req, res) => {
  console.log('Register request:', req.method, req.body, req.query);
  
  // Get data from body (POST) or query params (GET)
  const data = req.method === 'POST' ? req.body : req.query;
  const { name, email, password } = data || {};
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Name, email, and password required',
      note: 'Frontend uses localStorage auth. This endpoint is for future integration.'
    });
  }
  
  res.json({ 
    message: 'Registration successful!',
    user: { id: 1, name, email, role: 'user' },
    token: 'mock-token-' + Date.now()
  });
});

// Auth login endpoint (supports both GET and POST)
app.all('/api/auth/login', (req, res) => {
  console.log('Login request:', req.method, req.body, req.query);
  
  // Get data from body (POST) or query params (GET)
  const data = req.method === 'POST' ? req.body : req.query;
  const { email, password } = data || {};
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password required',
      note: 'Frontend uses localStorage auth. This endpoint is for future integration.'
    });
  }
  
  res.json({ 
    message: 'Login successful!',
    user: { id: 1, name: 'Test User', email, role: 'user' },
    token: 'mock-token-' + Date.now()
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('='.repeat(60, '🚀'));
  console.log('🚀 SMART CITY BACKEND - CURRENT STATUS');
  console.log('='.repeat(60, '🚀'));
  console.log('');
  console.log('✅ Server Status: RUNNING');
  console.log(`✅ Port: ${PORT}`);
  console.log(`✅ Local URL: http://localhost:${PORT}`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Test Endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✅ Modules: http://localhost:${PORT}/api/modules`);
  console.log('');
  console.log('🎯 AVAILABLE ENDPOINTS:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/test');
  console.log('   GET  /api/modules');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('');
  console.log('='.repeat(60, '🚀'));
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
});

// Keep server alive
console.log('🚀 Starting current status backend server...');
