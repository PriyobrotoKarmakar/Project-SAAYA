const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.get('/health', telemetryController.checkHealth);
router.post('/telemetry', telemetryController.processTelemetry);
router.get('/alerts', telemetryController.getAlerts);
router.get('/stats', telemetryController.getStats);
router.delete('/alerts/clear', telemetryController.clearAlerts);
router.delete('/alerts/:deviceId/:timestamp', telemetryController.removeAlert);


module.exports = router;
