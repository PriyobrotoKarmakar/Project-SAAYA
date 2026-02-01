import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shield, Activity } from "lucide-react";

import { MapControls } from "./components/MapControls";
import { MapSearch } from "./components/MapSearch";
import { MapLayers } from "./components/MapLayers";
import { MapStats } from "./components/MapStats";
import { Badge } from "@/components/ui/badge";
import { policeStations } from "../../utils/policeStations";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LiveMapView({
  alerts = [],
  verifiedRoutes = new Map(),
  minimal = false,
}) {
  const [map, setMap] = useState(null);
  const [layers, setLayers] = useState({
    alerts: true,
    police: true,
    routes: true,
  });
  const [previousAlertCount, setPreviousAlertCount] = useState(0);

  useEffect(() => {
    if (map && alerts.length > 0) {
      // Check if new alerts arrived
      if (alerts.length !== previousAlertCount) {
        const isNewAlertSOS = alerts[0]?.status === "SOS";

        // ONLY zoom/fitBounds if the newest alert is Critical (SOS)
        if (isNewAlertSOS) {
          const bounds = alerts
            .filter((alert) => alert.coordinates)
            .map((alert) => alert.coordinates);

          if (bounds.length > 0) {
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 15,
              animate: true,
              duration: 1.5,
            });
          }
        }

        setPreviousAlertCount(alerts.length);
      }
    }
  }, [map, alerts, previousAlertCount]);

  const sosIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div class="relative flex items-center justify-center w-6 h-6">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white"></span>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const normalIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div class="relative flex items-center justify-center w-5 h-5">
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white shadow-lg"></span>
           </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const policeIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div class="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-xl text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  /* 
    Dual Logic:
    - Minimal (Dashboard): SOS Alerts Only. Verified Stations Only.
    - Full: All Active Alerts. All Stations (controlled by layers).
  */

  // 1. Alert Visibility
  const visibleAlerts = minimal
    ? alerts.filter((a) => a.status === "SOS")
    : alerts.filter((a) => a.status !== "RESOLVED");

  // 2. Station Visibility
  // For Minimal: Calculate active stations from verified routes
  const activeStations = minimal
    ? Array.from(verifiedRoutes.values()).map((route) => ({
        id: `station-${route.stationName}`, // Unique key fallback
        name: route.stationName,
        coordinates: route.stationCoordinates,
        contact: route.stationContact,
      }))
    : [];

  // Determine which list to render
  const stationsToRender = minimal ? activeStations : policeStations;

  return (
    <div className="relative h-full w-full bg-gray-900 group">
      {!minimal && (
        <>
          <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm">
            <MapSearch map={map} alerts={alerts} stations={policeStations} />
          </div>

          <div className="absolute top-4 right-4 z-[1000]">
            <MapLayers layers={layers} setLayers={setLayers} />
            <div className="mt-2 flex justify-end">
              <Badge
                variant="outline"
                className="h-8 px-3 bg-background/90 backdrop-blur-none border-border shadow-md text-emerald-500 gap-2 flex items-center"
              >
                <Activity className="h-3 w-3 animate-pulse" />
                Live
              </Badge>
            </div>
          </div>
        </>
      )}

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={11}
        className="h-full w-full bg-gray-900"
        zoomControl={false}
        ref={setMap}
      >
        <TileLayer
          attribution="&copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {layers.alerts &&
          visibleAlerts.map((alert, idx) => {
            const isSOS = alert.status === "SOS";
            if (!alert.coordinates) return null;

            return (
              <div key={`alert-${idx}`}>
                <Marker
                  position={alert.coordinates}
                  icon={isSOS ? sosIcon : normalIcon}
                >
                  <Popup>
                    <div className="p-1 min-w-[150px]">
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <span className="font-bold">{alert.deviceId}</span>
                        <Badge variant={isSOS ? "destructive" : "secondary"}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm">
                        HR: <b>{alert.heartRate} BPM</b>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.location}
                      </p>
                    </div>
                  </Popup>
                </Marker>
                {isSOS && (
                  <Circle
                    center={alert.coordinates}
                    radius={500}
                    pathOptions={{
                      color: "#ef4444",
                      fillColor: "#ef4444",
                      fillOpacity: 0.2,
                      weight: 1,
                    }}
                  />
                )}
              </div>
            );
          })}

        {/* 
            Render Stations based on mode:
            - Minimal: Only stations involved in verified routes
            - Full: All stations (if toggle is on)
        */}
        {layers.police &&
          stationsToRender.map((station, idx) => (
            <Marker
              key={station.id || `station-${idx}`}
              position={station.coordinates}
              icon={policeIcon}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-blue-600 flex items-center gap-2">
                    <Shield className="h-3 w-3" /> {station.name}
                  </h3>
                  <p className="text-xs">{station.contact}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {layers.routes &&
          Array.from(verifiedRoutes.values()).map((route, idx) => (
            <Polyline
              key={`route-${idx}`}
              positions={[route.alertCoordinates, route.stationCoordinates]}
              pathOptions={{
                color: "#a855f7",
                weight: 3,
                dashArray: "10, 10",
                opacity: 0.8,
              }}
            />
          ))}
      </MapContainer>

      <MapControls map={map} />

      {!minimal && (
        <MapStats
          alerts={alerts}
          stations={policeStations}
          routesCount={verifiedRoutes.size}
        />
      )}
    </div>
  );
}
