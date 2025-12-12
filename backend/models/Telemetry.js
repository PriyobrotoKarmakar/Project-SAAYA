// ============================================================================
// PROJECT SAAYA - TELEMETRY MODEL
// ============================================================================
// This represents the data structure for incoming sensor data
// ============================================================================

/**
 * Telemetry Model Class
 * Represents sensor data from smart watch devices
 */
class Telemetry {
  constructor(deviceId, heartRate, lat, lng) {
    this.deviceId = deviceId;
    this.heartRate = heartRate;
    this.coordinates = [lat, lng];
    this.timestamp = new Date().toISOString();
    this.receivedAt = Date.now();
  }

  /**
   * Check if telemetry indicates an emergency
   */
  isEmergency() {
    return this.heartRate > 150;
  }

  /**
   * Convert to JSON format
   */
  toJSON() {
    return {
      deviceId: this.deviceId,
      heartRate: this.heartRate,
      coordinates: this.coordinates,
      timestamp: this.timestamp,
      receivedAt: this.receivedAt
    };
  }
}

module.exports = Telemetry;
