import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPanel = ({ alerts = [], verifiedRoutes = new Map() }) => {
  const defaultCenter = [28.6139, 77.2090]; // New Delhi
  const [map, setMap] = useState(null);
  const [previousAlertCount, setPreviousAlertCount] = useState(0);

  // Custom icon for emergency markers - using simple red marker
  const emergencyIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="#ff3864" stroke="#fff" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Custom icon for police stations - blue with shield
  const policeIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="14" fill="#0088ff" stroke="#fff" stroke-width="2"/>
        <path fill="#fff" d="M15 6 L10 9 L10 13 C10 17 15 20 15 20 S20 17 20 13 L20 9 Z"/>
        <text x="15" y="17" font-size="10" fill="#0088ff" text-anchor="middle" font-weight="bold">P</text>
      </svg>
    `),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  // Only auto-fit bounds when NEW alerts are added
  useEffect(() => {
    if (map && alerts.length > 0) {
      // Check if alert count has changed (new alert arrived)
      if (alerts.length !== previousAlertCount) {
        const bounds = alerts.map(alert => alert.coordinates);
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
        setPreviousAlertCount(alerts.length);
      }
    }
  }, [map, alerts, previousAlertCount]);

  return (
    <div className="glass-panel h-full overflow-hidden relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        ref={setMap}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
        />

        {/* Police Station Markers - ONLY show for verified routes */}
        {Array.from(verifiedRoutes.values()).map((route, index) => (
          <Marker
            key={`station-${index}`}
            position={route.stationCoordinates}
            icon={policeIcon}
          >
            <Popup>
              <div className="font-inter" style={{ color: '#0a0e27' }}>
                <h3 className="font-bold text-blue-600">🚔 {route.stationName}</h3>
                <p className="text-sm">📞 {route.stationContact}</p>
                <p className="text-xs text-gray-600">{route.stationCity}, {route.stationState}</p>
                <p className="text-xs font-bold mt-1" style={{ color: route.color }}>
                  Responding to: {route.deviceId}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Alert Markers */}
        {alerts.map((alert, index) => (
          <div key={index}>
            <Marker 
              position={alert.coordinates}
              icon={alert.status === 'SOS' ? emergencyIcon : DefaultIcon}
            >
              <Popup>
                <div className="font-inter" style={{ color: '#0a0e27' }}>
                  <h3 className="font-bold">{alert.deviceId}</h3>
                  <p className="text-sm">Status: {alert.status}</p>
                  <p className="text-sm">Heart Rate: {alert.heartRate} BPM</p>
                </div>
              </Popup>
            </Marker>
            
            {alert.status === 'SOS' && (
              <Circle
                center={alert.coordinates}
                radius={300}
                pathOptions={{
                  color: '#ff3864',
                  fillColor: '#ff3864',
                  fillOpacity: 0.1,
                }}
              />
            )}
          </div>
        ))}

        {/* Verified Routes - Draw lines from police station to alert location */}
        {Array.from(verifiedRoutes.values()).map((route, index) => (
          <Polyline
            key={`route-${index}`}
            positions={[route.stationCoordinates, route.alertCoordinates]}
            pathOptions={{
              color: route.color,
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10',
            }}
          >
            <Popup>
              <div className="font-inter" style={{ color: '#0a0e27' }}>
                <h3 className="font-bold" style={{ color: route.color }}>
                  Emergency Route
                </h3>
                <p className="text-sm">From: {route.stationName}</p>
                <p className="text-sm">To: {route.deviceId}</p>
                <p className="text-sm font-bold">Distance: {route.distance} km</p>
              </div>
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
      
      {/* Map Overlay */}
      <div className="absolute top-4 left-4 glass-panel px-4 py-2 pointer-events-none z-1000">
        <p className="text-sm font-semibold font-rajdhani">Live Tracking Active</p>
        <p className="text-xs text-gray-400">{alerts.length} Active Signals</p>
        {verifiedRoutes.size > 0 && (
          <p className="text-xs text-green-400 mt-1">
            🚔 {verifiedRoutes.size} Route{verifiedRoutes.size > 1 ? 's' : ''} Dispatched
          </p>
        )}
      </div>
    </div>
  );
};

export default MapPanel;
