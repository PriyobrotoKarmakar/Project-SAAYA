const Alert = require('../models/Alert');
const Telemetry = require('../models/Telemetry');

let activeAlerts = [];
let telemetryLog = [];

const logWithColor = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
};

exports.processTelemetry = (req, res) => {
  const { deviceId, heartRate, lat, lng } = req.body;

  if (!deviceId || heartRate === undefined || lat === undefined || lng === undefined) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['deviceId', 'heartRate', 'lat', 'lng']
    });
  }

  const telemetryEntry = new Telemetry(deviceId, heartRate, lat, lng);
  telemetryLog.push(telemetryEntry);

  let alertTriggered = false;

  if (telemetryEntry.isEmergency()) {
    logWithColor(
      `🚨 CRITICAL SOS: Device ${deviceId} | Heart Rate: ${heartRate} BPM | Location: [${lat}, ${lng}]`,
      'error'
    );
    
    const newAlert = new Alert(deviceId, heartRate, lat, lng, 'SOS');
    activeAlerts.push(newAlert);
    alertTriggered = true;
    
    if (activeAlerts.length > 50) {
      activeAlerts = activeAlerts.slice(-50);
    }

    console.log('🚨 Alert added to active alerts queue');
  } else {
    logWithColor(
      `✅ Normal Pulse: Device ${deviceId} | Heart Rate: ${heartRate} BPM | 💓 Status: Healthy`,
      'success'
    );
  }

  res.status(200).json({
    success: true,
    message: 'Telemetry received',
    deviceId,
    heartRate,
    alertTriggered,
    timestamp: new Date().toISOString()
  });
};

exports.getAlerts = (req, res) => {
  const recentAlerts = activeAlerts.slice(-10).reverse();
  
  res.status(200).json(recentAlerts);
};

exports.checkHealth = (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Saaya-Backend',
    timestamp: new Date().toISOString()
  });
};

exports.getStats = (req, res) => {
  res.status(200).json({
    totalAlerts: activeAlerts.length,
    totalTelemetryReceived: telemetryLog.length,
    activeDevices: [...new Set(telemetryLog.map(t => t.deviceId))].length,
    lastUpdate: telemetryLog.length > 0 ? telemetryLog[telemetryLog.length - 1].timestamp : null
  });
};

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
