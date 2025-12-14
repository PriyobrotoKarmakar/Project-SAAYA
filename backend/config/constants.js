const BACKEND_IP = process.env.BACKEND_IP || 'localhost';
const PORT = process.env.PORT || 5000;

module.exports = {
  PORT: PORT,
  HOST: process.env.HOST || '0.0.0.0',
  API_BASE_URL: `http://${BACKEND_IP}:${PORT}`,
  SOS_HEART_RATE_THRESHOLD: 150,
  MAX_ALERTS_IN_MEMORY: 50,
  MAX_TELEMETRY_LOG_SIZE: 1000,
  ALERTS_LIMIT: 10,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:5173',
    `http://${BACKEND_IP}`,
    `http://${BACKEND_IP}:30007`,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
  ]
};
