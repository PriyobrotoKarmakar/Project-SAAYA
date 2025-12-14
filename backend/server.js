require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const config = require('./config/constants');

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'DELETE', 'PUT'] 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

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

app.listen(config.PORT, config.HOST, () => {
  const apiUrl = config.API_BASE_URL || `http://${config.HOST}:${config.PORT}`;
  const displayHost = apiUrl.replace('http://', '').replace(`http://`, '').split(':')[0];
  
  console.log('\n' + '='.repeat(70));
  console.log('\x1b[36m%s\x1b[0m', '🛡️  PROJECT SAAYA - CENTRAL COMMAND ONLINE (MVC Architecture)');
  console.log('='.repeat(70));
  console.log(`📡 Server running on: ${apiUrl}`);
  console.log(`🏥 Health Check: ${apiUrl}/api/health`);
  console.log(`📊 Active Alerts: ${apiUrl}/api/alerts`);
  console.log(`📈 System Stats: ${apiUrl}/api/stats`);
  console.log(`🌐 Listening on: ${config.HOST}:${config.PORT}`);
  console.log(`🏗️  Architecture: MVC (Model-View-Controller)`);
  console.log(`🐳 Deployment: Docker + Kubernetes Ready`);
  console.log('='.repeat(70));
  console.log('\x1b[32m%s\x1b[0m', '✅ Ready to receive telemetry from smart watches...');
  console.log('='.repeat(70) + '\n');
});

app.use((err, req, res, next) => {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


process.on('SIGTERM', () => {
  console.log('\x1b[33m%s\x1b[0m', '🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\x1b[33m%s\x1b[0m', '\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});
