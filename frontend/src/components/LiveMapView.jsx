import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Map, Layers, ZoomIn, ZoomOut, Maximize2, Navigation, 
  MapPin, Shield, AlertCircle, Eye, EyeOff, Filter,
  Search, X, Radio, Activity, TrendingUp, Users, Bell
} from 'lucide-react';
import { globalPoliceStations } from '../data/Police_Data';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapControls = ({ map }) => {
  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleReset = () => map?.setView([20.5937, 78.9629], 5);

  return (
    <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="glass-panel p-3 hover:bg-white/10 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5 text-neon-blue" />
      </button>
      <button
        onClick={handleZoomOut}
        className="glass-panel p-3 hover:bg-white/10 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5 text-neon-blue" />
      </button>
      <button
        onClick={handleReset}
        className="glass-panel p-3 hover:bg-white/10 transition-colors"
        title="Reset View"
      >
        <Maximize2 className="w-5 h-5 text-neon-blue" />
      </button>
    </div>
  );
};

const LayerToggle = ({ layers, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-1000">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-2"
      >
        <Layers className="w-5 h-5 text-neon-blue" />
        <span className="font-rajdhani font-semibold">Map Layers</span>
      </button>

      {isOpen && (
        <div className="glass-panel mt-2 p-4 space-y-3 min-w-50">
          {Object.entries(layers).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={value}
                onChange={() => onToggle(key)}
                className="w-4 h-4 rounded bg-white/10 border-white/20 text-neon-blue focus:ring-neon-blue"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const MapStatsOverlay = ({ alerts, policeStations, verifiedRoutes }) => {
  const stats = {
    activeAlerts: alerts.filter(a => a.status === 'SOS').length,
    totalAlerts: alerts.length,
    policeStations: policeStations.length,
    activeRoutes: verifiedRoutes.size
  };

  return (
    <div className="absolute bottom-4 left-4 z-1000 flex gap-3">
      <StatCard icon={Bell} label="Active Alerts" value={stats.activeAlerts} color="red" />
      <StatCard icon={MapPin} label="Total Alerts" value={stats.totalAlerts} color="blue" />
      <StatCard icon={Shield} label="Police Stations" value={stats.policeStations} color="green" />
      <StatCard icon={Navigation} label="Active Routes" value={stats.activeRoutes} color="purple" />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    red: 'text-neon-red bg-red-500/10 border-red-500/30',
    blue: 'text-neon-blue bg-blue-500/10 border-blue-500/30',
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  };

  return (
    <div className={`glass-panel px-4 py-3 flex items-center gap-3 border ${colorClasses[color]}`}>
      <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[0]}`} />
      <div>
        <div className={`text-2xl font-bold font-rajdhani ${colorClasses[color].split(' ')[0]}`}>
          {value}
        </div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
};

const SearchBox = ({ onSearch, onClear, policeStations }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <div className="absolute top-20 left-4 z-1000 w-80">
      <form onSubmit={handleSearch} className="glass-panel flex items-center gap-2 px-4 py-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search location, device ID..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
        />
        {searchTerm && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};

const MapLegend = () => {
  const items = [
    { color: 'bg-red-500', label: 'Emergency Alert (SOS)', icon: AlertCircle },
    { color: 'bg-blue-500', label: 'Normal Alert', icon: Radio },
    { color: 'bg-green-500', label: 'Police Station', icon: Shield },
    { color: 'bg-purple-500', label: 'Verified Route', icon: Navigation }
  ];

  return (
    <div className="absolute bottom-4 right-4 z-1000">
      <div className="glass-panel p-4 min-w-50">
        <h3 className="font-rajdhani font-semibold text-sm mb-3 flex items-center gap-2">
          <Map className="w-4 h-4 text-neon-blue" />
          Map Legend
        </h3>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <item.icon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LiveMapView = ({ alerts, verifiedRoutes }) => {
  const [map, setMap] = useState(null);
  const [layers, setLayers] = useState({
    alerts: true,
    policeStations: false,
    routes: true,
    heatmap: false,
    clusters: false
  });
  const [searchResult, setSearchResult] = useState(null);

  const handleLayerToggle = (layerName) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const handleSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    
    // Search alerts
    const foundAlert = alerts.find(a => 
      a.deviceId.toLowerCase().includes(lowerTerm) ||
      a.location.toLowerCase().includes(lowerTerm)
    );

    if (foundAlert && foundAlert.coordinates) {
      map?.setView(foundAlert.coordinates, 13);
      setSearchResult(foundAlert);
    } else {
      // Search police stations
      const foundStation = globalPoliceStations.find(s =>
        s.name.toLowerCase().includes(lowerTerm) ||
        s.city.toLowerCase().includes(lowerTerm) ||
        s.state.toLowerCase().includes(lowerTerm)
      );

      if (foundStation) {
        map?.setView(foundStation.coordinates, 13);
        setSearchResult(foundStation);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchResult(null);
    map?.setView([20.5937, 78.9629], 5);
  };

  const sosIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background: #ff3864; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(255, 56, 100, 0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const normalIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background: #00cfff; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0, 207, 255, 0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const policeIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background: #00ff88; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return (
    <div className="h-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full rounded-lg"
        whenCreated={setMap}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com">Esri</a>'
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          opacity={0.5}
        />

        {layers.alerts && alerts.map((alert, index) => {
          if (!alert.coordinates) return null;
          const isEmergency = alert.status === 'SOS' || alert.heartRate > 140;
          
          return (
            <div key={`alert-${index}`}>
              <Marker 
                position={alert.coordinates}
                icon={isEmergency ? sosIcon : normalIcon}
              >
                <Popup>
                  <div className="font-rajdhani">
                    <h3 className="font-bold text-lg mb-2">{alert.deviceId}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${isEmergency ? 'text-red-600' : 'text-blue-600'}`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heart Rate:</span>
                        <span className="font-semibold">{alert.heartRate} BPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold text-xs">{alert.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {isEmergency && (
                <Circle
                  center={alert.coordinates}
                  radius={300}
                  pathOptions={{
                    color: '#ff3864',
                    fillColor: '#ff3864',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </div>
          );
        })}

        {layers.policeStations && globalPoliceStations.slice(0, 50).map((station) => (
          <Marker 
            key={station.id}
            position={station.coordinates}
            icon={policeIcon}
          >
            <Popup>
              <div className="font-rajdhani">
                <h3 className="font-bold text-lg mb-2 text-green-600">{station.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-semibold">{station.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-semibold">{station.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-semibold">{station.contact}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {layers.routes && Array.from(verifiedRoutes.values()).map((route, index) => (
          <div key={`route-${index}`}>
            <Polyline
              positions={[route.alertCoordinates, route.stationCoordinates]}
              pathOptions={{
                color: route.color,
                weight: 3,
                opacity: 0.8,
                dashArray: '10, 10'
              }}
            />
            <Marker position={route.stationCoordinates} icon={policeIcon}>
              <Popup>
                <div className="font-rajdhani">
                  <h3 className="font-bold text-lg mb-2 text-green-600">{route.stationName}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Responding to:</span>
                      <span className="font-semibold text-red-600">{route.deviceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold">{route.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-semibold">{route.stationCity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-semibold">{route.stationContact}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>

      <LayerToggle layers={layers} onToggle={handleLayerToggle} />
      <MapControls map={map} />
      <SearchBox onSearch={handleSearch} onClear={handleClearSearch} policeStations={globalPoliceStations} />
      <MapStatsOverlay 
        alerts={alerts} 
        policeStations={globalPoliceStations} 
        verifiedRoutes={verifiedRoutes} 
      />
      <MapLegend />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000">
        <div className="glass-panel px-6 py-3">
          <h2 className="font-rajdhani font-bold text-xl neon-text-blue flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Live Map View - Real-Time Monitoring
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LiveMapView;
