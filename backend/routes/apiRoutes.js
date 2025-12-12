// ============================================================================
// PROJECT SAAYA - API ROUTES
// ============================================================================
// Traffic Director - Maps URL endpoints to Controller functions
// ============================================================================

const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

// ============================================================================
// CORE API ENDPOINTS
// ============================================================================

/**
 * Health Check - Kubernetes Liveness Probe
 * GET /api/health
 */
router.get('/health', telemetryController.checkHealth);

/**
 * Telemetry Ingestion - Receive sensor data from smart watches
 * POST /api/telemetry
 * Body: { deviceId, heartRate, lat, lng }
 */
router.post('/telemetry', telemetryController.processTelemetry);

/**
 * Active Alerts Feed - For React Dashboard
 * GET /api/alerts
 */
router.get('/alerts', telemetryController.getAlerts);

/**
 * System Statistics - Monitoring Dashboard
 * GET /api/stats
 */
router.get('/stats', telemetryController.getStats);

/**
 * Clear Alerts - Testing/Debug Endpoint
 * DELETE /api/alerts/clear
 */
router.delete('/alerts/clear', telemetryController.clearAlerts);

/**
 * Remove Specific Alert - Remove solved alert
 * DELETE /api/alerts/:deviceId/:timestamp
 */
router.delete('/alerts/:deviceId/:timestamp', telemetryController.removeAlert);

// ============================================================================
// EXPORT ROUTER
// ============================================================================
module.exports = router;
