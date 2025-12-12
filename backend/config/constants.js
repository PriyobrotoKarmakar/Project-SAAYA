// ============================================================================
// PROJECT SAAYA - CONFIGURATION CONSTANTS
// ============================================================================
// Centralized configuration for easy maintenance
// ============================================================================

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  
  // Business Logic Thresholds
  SOS_HEART_RATE_THRESHOLD: 150, // BPM above which SOS is triggered
  
  // Data Management
  MAX_ALERTS_IN_MEMORY: 50, // Maximum alerts to store before cleanup
  MAX_TELEMETRY_LOG_SIZE: 1000, // Maximum telemetry entries to store
  
  // API Configuration
  ALERTS_LIMIT: 10, // Number of recent alerts to return to dashboard
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS Configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:5173']
};
