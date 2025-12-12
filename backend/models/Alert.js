// ============================================================================
// PROJECT SAAYA - ALERT MODEL
// ============================================================================
// This represents the data structure for SOS alerts
// In production, this would be a MongoDB Schema using Mongoose
// ============================================================================

/**
 * Alert Model Class
 * Represents an emergency alert from a smart watch device
 */
class Alert {
  constructor(deviceId, heartRate, lat, lng, status = 'SOS') {
    this.deviceId = deviceId;
    this.status = status;
    this.heartRate = heartRate;
    this.coordinates = [lat, lng]; // Format for React Leaflet
    this.location = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    this.timestamp = this.getRelativeTime();
    this.createdAt = Date.now();
  }

  /**
   * Get relative time string for display
   */
  getRelativeTime() {
    return "Just now";
  }

  /**
   * Convert alert to JSON format matching frontend requirements
   */
  toJSON() {
    return {
      deviceId: this.deviceId,
      status: this.status,
      heartRate: this.heartRate,
      coordinates: this.coordinates,
      timestamp: this.timestamp,
      location: this.location,
      createdAt: this.createdAt
    };
  }
}

module.exports = Alert;
