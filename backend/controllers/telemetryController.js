// ============================================================================
// PROJECT SAAYA - TELEMETRY CONTROLLER
// ============================================================================
// Business Logic Layer - Handles all telemetry processing and alert management
// ============================================================================

const Alert = require('../models/Alert');
const Telemetry = require('../models/Telemetry');

// ============================================================================
// IN-MEMORY DATA STORAGE (Simulates Database)
// ============================================================================
let activeAlerts = []; // Stores active SOS alerts
let telemetryLog = []; // Stores all incoming telemetry data

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Console log with color support for different alert levels
 */
const logWithColor = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
};

// ============================================================================
// CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Process incoming telemetry data from smart watches
 * POST /api/telemetry
 */
exports.processTelemetry = (req, res) => {
  const { deviceId, heartRate, lat, lng } = req.body;

  // Validate incoming payload
  if (!deviceId || heartRate === undefined || lat === undefined || lng === undefined) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['deviceId', 'heartRate', 'lat', 'lng']
    });
  }

  // Create Telemetry Model instance
  const telemetryEntry = new Telemetry(deviceId, heartRate, lat, lng);
  telemetryLog.push(telemetryEntry);

  // ========================================================================
  // CRITICAL BUSINESS LOGIC: SOS DETECTION
  // ========================================================================
  let alertTriggered = false;

  if (telemetryEntry.isEmergency()) {
    // 🚨 EMERGENCY DETECTED
    logWithColor(
      `🚨 CRITICAL SOS: Device ${deviceId} | Heart Rate: ${heartRate} BPM | Location: [${lat}, ${lng}]`,
      'error'
    );
    
    // Create Alert Model instance
    const newAlert = new Alert(deviceId, heartRate, lat, lng, 'SOS');
    
    // Add to active alerts array
    activeAlerts.push(newAlert);
    alertTriggered = true;
    
    // Keep only the last 50 alerts in memory (prevent memory overflow)
    if (activeAlerts.length > 50) {
      activeAlerts = activeAlerts.slice(-50);
    }

    console.log('🚨 Alert added to active alerts queue');
  } else {
    // ✅ NORMAL PULSE
    logWithColor(
      `✅ Normal Pulse: Device ${deviceId} | Heart Rate: ${heartRate} BPM | 💓 Status: Healthy`,
      'success'
    );
  }

  // Send acknowledgment response
  res.status(200).json({
    success: true,
    message: 'Telemetry received',
    deviceId,
    heartRate,
    alertTriggered,
    timestamp: new Date().toISOString()
  });
};

/**
 * Get active alerts for dashboard
 * GET /api/alerts
 */
exports.getAlerts = (req, res) => {
  // Reduced logging for polling endpoint (runs every 2 seconds)
  // Uncomment below for debugging:
  // console.log('🛡️  Dashboard requested active alerts');
  
  // Return last 10 alerts (most recent first)
  const recentAlerts = activeAlerts.slice(-10).reverse();
  
  res.status(200).json(recentAlerts);
};

/**
 * Health check endpoint for Kubernetes
 * GET /api/health
 */
exports.checkHealth = (req, res) => {
  // Silent health check (Kubernetes probes run frequently)
  // Uncomment below for debugging:
  // console.log('🛡️  Health check requested');
  res.status(200).json({
    status: 'UP',
    service: 'Saaya-Backend',
    timestamp: new Date().toISOString()
  });
};

/**
 * Get system statistics
 * GET /api/stats
 */
exports.getStats = (req, res) => {
  res.status(200).json({
    totalAlerts: activeAlerts.length,
    totalTelemetryReceived: telemetryLog.length,
    activeDevices: [...new Set(telemetryLog.map(t => t.deviceId))].length,
    lastUpdate: telemetryLog.length > 0 ? telemetryLog[telemetryLog.length - 1].timestamp : null
  });
};

/**
 * Clear all active alerts (for testing)
 * DELETE /api/alerts/clear
 */
exports.clearAlerts = (req, res) => {
  const clearedCount = activeAlerts.length;
  activeAlerts = [];
  logWithColor(`🧹 Cleared ${clearedCount} alerts from memory`, 'warning');
  res.status(200).json({
    success: true,
    message: `Cleared ${clearedCount} alerts`
  });
};

/**
 * Remove a specific alert by deviceId and timestamp
 * DELETE /api/alerts/:deviceId/:timestamp
 */
exports.removeAlert = (req, res) => {
  const { deviceId, timestamp } = req.params;
  
  const initialLength = activeAlerts.length;
  activeAlerts = activeAlerts.filter(alert => 
    !(alert.deviceId === deviceId && alert.timestamp === timestamp)
  );
  
  const removed = initialLength - activeAlerts.length;
  
  if (removed > 0) {
    logWithColor(`✅ Removed alert: ${deviceId} (${timestamp})`, 'success');
    res.status(200).json({
      success: true,
      message: `Removed ${removed} alert(s)`,
      deviceId,
      timestamp
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Alert not found'
    });
  }
};
