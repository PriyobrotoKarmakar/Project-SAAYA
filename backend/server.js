// ============================================================================
// PROJECT SAAYA - CENTRAL COMMAND BACKEND API (MVC ARCHITECTURE)
// ============================================================================
// Digital Twin IoT Platform for Women's Safety
// This is the "Brain" that receives signals from smart watches and alerts
// the React Dashboard in real-time.
//
// ARCHITECTURE:
// - MVC (Model-View-Controller) for clean code organization
// - Microservices deployment (Docker/Kubernetes)
// ============================================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const config = require('./config/constants');

const app = express();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));

app.use(bodyParser.json()); // Parse incoming JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================================================
// API ROUTES (Delegated to Router)
// ============================================================================
// All /api/* endpoints are handled by apiRoutes
app.use('/api', apiRoutes);

// Root endpoint for service identification
app.get('/', (req, res) => {
  res.json({
    service: 'Project Saaya - Women\'s Safety IoT Platform',
    version: '1.0.0',
    architecture: 'MVC + Microservices',
    status: 'ONLINE',
    endpoints: {
      health: '/api/health',
      telemetry: 'POST /api/telemetry',
      alerts: '/api/alerts',
      stats: '/api/stats'
    }
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================
app.listen(config.PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('\x1b[36m%s\x1b[0m', '🛡️  PROJECT SAAYA - CENTRAL COMMAND ONLINE (MVC Architecture)');
  console.log('='.repeat(70));
  console.log(`📡 Server running on: http://localhost:${config.PORT}`);
  console.log(`🏥 Health Check: http://localhost:${config.PORT}/api/health`);
  console.log(`📊 Active Alerts: http://localhost:${config.PORT}/api/alerts`);
  console.log(`📈 System Stats: http://localhost:${config.PORT}/api/stats`);
  console.log(`🏗️  Architecture: MVC (Model-View-Controller)`);
  console.log(`🐳 Deployment: Docker + Kubernetes Ready`);
  console.log('='.repeat(70));
  console.log('\x1b[32m%s\x1b[0m', '✅ Ready to receive telemetry from smart watches...');
  console.log('='.repeat(70) + '\n');
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================
app.use((err, req, res, next) => {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================
process.on('SIGTERM', () => {
  console.log('\x1b[33m%s\x1b[0m', '🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\x1b[33m%s\x1b[0m', '\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});
