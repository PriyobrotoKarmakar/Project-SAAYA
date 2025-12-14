class Telemetry {
  constructor(deviceId, heartRate, lat, lng) {
    this.deviceId = deviceId;
    this.heartRate = heartRate;
    this.coordinates = [lat, lng];
    this.timestamp = new Date().toISOString();
    this.receivedAt = Date.now();
  }

  isEmergency() {
    return this.heartRate > 150;
  }

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
