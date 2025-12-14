import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import MapPanel from './components/MapPanel';
import AlertsHeader from './components/AlertsHeader';
import AlertsList from './components/AlertsList';
import AlertsView from './components/AlertsView';
import NodesView from './components/NodesView';
import AnalyticsView from './components/AnalyticsView';
import DataLogsView from './components/DataLogsView';
import LiveMapView from './components/LiveMapView';
import SettingsView from './components/SettingsView';
import EmergencyContact from './components/EmergencyContact';
import { findNearestPoliceStation } from './data/policeStations';
import { API_ENDPOINTS, getDeleteAlertUrl } from './config';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [previousAlertIds, setPreviousAlertIds] = useState(new Set());
  const [verifiedAlerts, setVerifiedAlerts] = useState(new Map());
  const [currentView, setCurrentView] = useState('home');
  const [solvedAlerts, setSolvedAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ALERTS);
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.log('Backend not connected, using demo data');
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

    fetchAlerts();

    const pollInterval = setInterval(fetchAlerts, 2000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sosAlerts = alerts.filter(a => a.status === 'SOS');
    
    sosAlerts.forEach((alert) => {
      const alertId = alert.deviceId + alert.timestamp;
      
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
        
        setPreviousAlertIds(prev => new Set([...prev, alertId]));
      }
    });
  }, [alerts, previousAlertIds]);

  const handleVerifyAlert = (alert) => {
    if (!alert.coordinates) return;

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
        color: getRouteColor(verifiedAlerts.size)
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

  const getRouteColor = (index) => {
    const colors = [
      '#ff3864',
      '#00ff88',
      '#ffd700',
      '#00cfff',
      '#ff6b9d',
      '#9d4edd',
      '#ff8c00',
      '#00ff00',
    ];
    return colors[index % colors.length];
  };

  const handleRemoveAlert = async (alert) => {
    const uniqueAlertId = `${alert.deviceId}_${alert.timestamp}_${alert.coordinates.join('_')}`;
    
    try {
      const response = await fetch(
        getDeleteAlertUrl(alert.deviceId, alert.timestamp),
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        console.log('Alert removed from backend');
      }
    } catch (error) {
      console.log('Could not remove from backend:', error);
    }
    
    const solvedAlert = {
      ...alert,
      solvedAt: new Date().toLocaleString(),
      originalStatus: alert.status
    };
    setSolvedAlerts(prev => [solvedAlert, ...prev]);
    
    setAlerts(prevAlerts => prevAlerts.filter(a => 
      `${a.deviceId}_${a.timestamp}_${a.coordinates.join('_')}` !== uniqueAlertId
    ));
    
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

  const handleReactivateAlert = (alert) => {
    const reactivatedAlert = {
      deviceId: alert.deviceId,
      heartRate: alert.heartRate,
      status: alert.originalStatus || alert.alertStatus,
      location: alert.location,
      timestamp: `Reactivated - ${new Date().toLocaleTimeString()}`,
      coordinates: alert.coordinates
    };
    
    setAlerts(prev => [reactivatedAlert, ...prev]);
    setSolvedAlerts(prev => prev.filter(a => 
      a.deviceId !== alert.deviceId || a.timestamp !== alert.timestamp
    ));

    toast.success(
      `🔄 Alert Reactivated: ${alert.deviceId}`,
      {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      }
    );
  };

  const handlePermanentDelete = (alert) => {
    setSolvedAlerts(prev => prev.filter(a => 
      a.deviceId !== alert.deviceId || a.timestamp !== alert.timestamp
    ));
    setAlerts(prev => prev.filter(a => 
      a.deviceId !== alert.deviceId || a.timestamp !== alert.timestamp
    ));

    toast.info(
      `🗑️ Alert Permanently Deleted: ${alert.deviceId}`,
      {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      }
    );
  };

  const activeAlerts = alerts.filter(a => a.status === 'SOS').length;
  const totalNodes = alerts.length;

  return (
    <div className="h-screen bg-midnight-900 p-4 overflow-hidden">
      <div className="h-full grid grid-cols-12 gap-4">
        
        <div className="col-span-2">
          <Sidebar 
            activeView={currentView} 
            onViewChange={setCurrentView}
            alertsBadge={alerts.length + solvedAlerts.length}
          />
        </div>

        {currentView === 'alerts' ? (
          <div className="col-span-10 flex flex-col gap-4 min-h-0">
            <Header currentTime={currentTime} />
            <div className="flex-1 min-h-0">
              <AlertsView 
                activeAlerts={alerts}
                solvedAlerts={solvedAlerts}
                onReactivate={handleReactivateAlert}
                onPermanentDelete={handlePermanentDelete}
              />
            </div>
          </div>
        ) : currentView === 'users' ? (
          <div className="col-span-10 flex flex-col gap-4 min-h-0">
            <Header currentTime={currentTime} />
            <div className="flex-1 min-h-0">
              <NodesView 
                alerts={alerts}
                solvedAlerts={solvedAlerts}
              />
            </div>
          </div>
        ) : currentView === 'analytics' ? (
          <div className="col-span-10 flex flex-col gap-4 min-h-0">
            <Header currentTime={currentTime} />
            <div className="flex-1 min-h-0">
              <AnalyticsView 
                alerts={alerts}
                solvedAlerts={solvedAlerts}
              />
            </div>
          </div>
        ) : currentView === 'data' ? (
          <div className="col-span-10 min-h-0">
            <DataLogsView 
              alerts={alerts}
              solvedAlerts={solvedAlerts}
            />
          </div>
        ) : currentView === 'map' ? (
          <div className="col-span-10 min-h-0">
            <LiveMapView 
              alerts={alerts}
              verifiedRoutes={verifiedAlerts}
            />
          </div>
        ) : currentView === 'settings' ? (
          <div className="col-span-10 min-h-0">
            <SettingsView />
          </div>
        ) : (
          <>
            <div className="col-span-7 flex flex-col gap-4 min-h-0">
              <Header currentTime={currentTime} />
              <StatsGrid totalNodes={totalNodes} activeAlerts={activeAlerts} />
              
              <div className="flex-1 min-h-0">
                <MapPanel alerts={alerts} verifiedRoutes={verifiedAlerts} />
              </div>
            </div>

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
          </>
        )}
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

