import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import MapPanel from './components/MapPanel';
import AlertsHeader from './components/AlertsHeader';
import AlertsList from './components/AlertsList';
import EmergencyContact from './components/EmergencyContact';
import { findNearestPoliceStation } from './data/policeStations';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [previousAlertIds, setPreviousAlertIds] = useState(new Set());
  const [verifiedAlerts, setVerifiedAlerts] = useState(new Map()); // deviceId -> route info
  
  // Backend API URL (change this to your backend URL)
  const API_URL = 'http://localhost:5000/api/alerts';

  // Fetch alerts from backend
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.log('Backend not connected, using demo data');
        // Fallback to demo data if backend is not available
        setAlerts([
          {
            deviceId: 'Saaya_001',
            heartRate: 156,
            status: 'SOS',
            location: 'Connaught Place, New Delhi',
            timestamp: '2 mins ago',
            coordinates: [28.6304, 77.2177]
          },
          {
            deviceId: 'Saaya_007',
            heartRate: 148,
            status: 'SOS',
            location: 'Karol Bagh, Delhi',
            timestamp: '5 mins ago',
            coordinates: [28.6517, 77.1901]
          },
          {
            deviceId: 'Saaya_023',
            heartRate: 142,
            status: 'SOS',
            location: 'Chandni Chowk, Delhi',
            timestamp: '8 mins ago',
            coordinates: [28.6506, 77.2303]
          },
          {
            deviceId: 'Saaya_015',
            heartRate: 85,
            status: 'Normal',
            location: 'Lajpat Nagar, Delhi',
            timestamp: '1 min ago',
            coordinates: [28.5678, 77.2432]
          },
          {
            deviceId: 'Saaya_042',
            heartRate: 78,
            status: 'Normal',
            location: 'Hauz Khas, Delhi',
            timestamp: '3 mins ago',
            coordinates: [28.5494, 77.2001]
          }
        ]);
      }
    };

    // Initial fetch
    fetchAlerts();

    // Poll every 2 seconds for new alerts
    const pollInterval = setInterval(fetchAlerts, 2000);

    return () => clearInterval(pollInterval);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor for NEW SOS alerts and trigger notifications
  useEffect(() => {
    const sosAlerts = alerts.filter(a => a.status === 'SOS');
    
    sosAlerts.forEach((alert) => {
      const alertId = alert.deviceId + alert.timestamp;
      
      // Only show notification for NEW alerts (not seen before)
      if (!previousAlertIds.has(alertId)) {
        toast.error(
          `🚨 EMERGENCY ALERT: ${alert.deviceId}\n` +
          `Location: ${alert.location}\n` +
          `Heart Rate: ${alert.heartRate} BPM`,
          {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            style: {
              background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1f3a 100%)',
              border: '2px solid #ff3864',
              boxShadow: '0 0 20px rgba(255, 56, 100, 0.3)'
            }
          }
        );
        
        // Mark this alert as seen
        setPreviousAlertIds(prev => new Set([...prev, alertId]));
      }
    });
  }, [alerts, previousAlertIds]);

  // Handle alert verification - Find nearest police station and create route
  const handleVerifyAlert = (alert) => {
    if (!alert.coordinates) return;

    // Create unique ID for this specific alert (deviceId + timestamp + coordinates)
    const uniqueAlertId = `${alert.deviceId}_${alert.timestamp}_${alert.coordinates.join('_')}`;

    const nearestStation = findNearestPoliceStation(alert.coordinates);
    
    if (nearestStation) {
      const routeInfo = {
        alertCoordinates: alert.coordinates,
        stationCoordinates: nearestStation.coordinates,
        stationName: nearestStation.name,
        stationId: nearestStation.id,
        stationCity: nearestStation.city,
        stationState: nearestStation.state,
        stationContact: nearestStation.contact,
        distance: nearestStation.distance.toFixed(2),
        deviceId: alert.deviceId,
        color: getRouteColor(verifiedAlerts.size) // Different color for each route
      };

      setVerifiedAlerts(prev => new Map(prev).set(uniqueAlertId, routeInfo));

      toast.success(
        `✅ VERIFIED: ${alert.deviceId}\n` +
        `Nearest Station: ${nearestStation.name}\n` +
        `Distance: ${nearestStation.distance.toFixed(2)} km`,
        {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
          style: {
            background: 'linear-gradient(135deg, #1a3a1a 0%, #1f2d3a 100%)',
            border: '2px solid #00ff88',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
          }
        }
      );
    }
  };

  // Get different route colors for multiple routes
  const getRouteColor = (index) => {
    const colors = [
      '#ff3864', // Red
      '#00ff88', // Green
      '#ffd700', // Gold
      '#00cfff', // Cyan
      '#ff6b9d', // Pink
      '#9d4edd', // Purple
      '#ff8c00', // Orange
      '#00ff00', // Lime
    ];
    return colors[index % colors.length];
  };

  // Handle alert removal (when solved)
  const handleRemoveAlert = async (alert) => {
    const uniqueAlertId = `${alert.deviceId}_${alert.timestamp}_${alert.coordinates.join('_')}`;
    
    // Remove from backend
    try {
      const response = await fetch(
        `http://localhost:5000/api/alerts/${encodeURIComponent(alert.deviceId)}/${encodeURIComponent(alert.timestamp)}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        console.log('Alert removed from backend');
      }
    } catch (error) {
      console.log('Could not remove from backend:', error);
    }
    
    // Remove from frontend state immediately
    setAlerts(prevAlerts => prevAlerts.filter(a => 
      `${a.deviceId}_${a.timestamp}_${a.coordinates.join('_')}` !== uniqueAlertId
    ));
    
    // Remove from verified routes if it was verified
    setVerifiedAlerts(prev => {
      const newMap = new Map(prev);
      newMap.delete(uniqueAlertId);
      return newMap;
    });

    toast.info(
      `✅ Alert Resolved: ${alert.deviceId}`,
      {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      }
    );
  };

  const activeAlerts = alerts.filter(a => a.status === 'SOS').length;
  const totalNodes = alerts.length;

  return (
    <div className="h-screen bg-midnight-900 p-4 overflow-hidden">
      <div className="h-full grid grid-cols-12 gap-4">
        
        {/* Sidebar */}
        <div className="col-span-2">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-7 flex flex-col gap-4 min-h-0">
          <Header currentTime={currentTime} />
          <StatsGrid totalNodes={totalNodes} activeAlerts={activeAlerts} />
          
          {/* Map */}
          <div className="flex-1 min-h-0">
            <MapPanel alerts={alerts} verifiedRoutes={verifiedAlerts} />
          </div>
        </div>

        {/* Right Panel - Alert Feed */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <AlertsHeader activeAlerts={activeAlerts} totalNodes={totalNodes} />
          <AlertsList 
            alerts={alerts} 
            onVerifyAlert={handleVerifyAlert}
            onRemoveAlert={handleRemoveAlert}
            verifiedAlerts={verifiedAlerts}
          />
          <EmergencyContact />
        </div>
      </div>
      
      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;

