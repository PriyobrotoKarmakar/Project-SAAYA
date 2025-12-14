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

  getRelativeTime() {
    return "Just now";
  }

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
