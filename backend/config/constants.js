module.exports = {
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || '0.0.0.0',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  SOS_HEART_RATE_THRESHOLD: 150,
  MAX_ALERTS_IN_MEMORY: 50,
  MAX_TELEMETRY_LOG_SIZE: 1000,
  ALERTS_LIMIT: 10,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:5173']
};
