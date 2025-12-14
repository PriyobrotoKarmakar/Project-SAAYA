import { useState } from 'react';
import { 
  Users, Heart, MapPin, Battery, Wifi, WifiOff, Clock, Activity, 
  Signal, Search, X, Filter, TrendingUp, AlertCircle, CheckCircle,
  Smartphone, Shield
} from 'lucide-react';

const NodesView = ({ alerts, solvedAlerts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deviceId');

  const generateNodesData = () => {
    const nodeMap = new Map();
    
    alerts.forEach(alert => {
      if (!nodeMap.has(alert.deviceId)) {
        nodeMap.set(alert.deviceId, {
          deviceId: alert.deviceId,
          status: alert.status,
          heartRate: alert.heartRate,
          location: alert.location,
          coordinates: alert.coordinates,
          lastSeen: alert.timestamp,
          online: true,
          battery: Math.floor(Math.random() * 40) + 60, // 60-100%
          signalStrength: Math.floor(Math.random() * 30) + 70, // 70-100%
          alerts: 1,
          totalAlerts: 1,
          isActive: true
        });
      } else {
        const node = nodeMap.get(alert.deviceId);
        node.alerts += 1;
        node.totalAlerts += 1;
        node.heartRate = alert.heartRate;
        node.lastSeen = alert.timestamp;
      }
    });

    solvedAlerts.forEach(alert => {
      if (!nodeMap.has(alert.deviceId)) {
        nodeMap.set(alert.deviceId, {
          deviceId: alert.deviceId,
          status: 'Normal',
          heartRate: Math.floor(Math.random() * 40) + 60, // Normal range
          location: alert.location,
          coordinates: alert.coordinates,
          lastSeen: alert.timestamp,
          online: Math.random() > 0.3, // 70% online
          battery: Math.floor(Math.random() * 40) + 60,
          signalStrength: Math.floor(Math.random() * 30) + 70,
          alerts: 0,
          totalAlerts: 1,
          isActive: false
        });
      } else {
        const node = nodeMap.get(alert.deviceId);
        node.totalAlerts += 1;
      }
    });

    if (nodeMap.size === 0) {
      for (let i = 1; i <= 12; i++) {
        const deviceId = `Saaya_${String(i).padStart(3, '0')}`;
        const isOnline = Math.random() > 0.2;
        const heartRate = Math.floor(Math.random() * 60) + 60;
        
        nodeMap.set(deviceId, {
          deviceId,
          status: heartRate > 140 ? 'SOS' : 'Normal',
          heartRate,
          location: `Location ${i}, Delhi`,
          coordinates: [28.6 + Math.random() * 0.1, 77.2 + Math.random() * 0.1],
          lastSeen: isOnline ? 'Just now' : `${Math.floor(Math.random() * 30) + 1} mins ago`,
          online: isOnline,
          battery: Math.floor(Math.random() * 50) + 50,
          signalStrength: isOnline ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40),
          alerts: heartRate > 140 ? 1 : 0,
          totalAlerts: Math.floor(Math.random() * 10),
          isActive: isOnline
        });
      }
    }

    return Array.from(nodeMap.values());
  };

  const nodes = generateNodesData();

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'online' && node.online) ||
      (filterStatus === 'offline' && !node.online) ||
      (filterStatus === 'emergency' && node.status === 'SOS') ||
      (filterStatus === 'lowBattery' && node.battery < 30);

    return matchesSearch && matchesFilter;
  });

  const sortedNodes = [...filteredNodes].sort((a, b) => {
    switch (sortBy) {
      case 'deviceId':
        return a.deviceId.localeCompare(b.deviceId);
      case 'heartRate':
        return b.heartRate - a.heartRate;
      case 'battery':
        return a.battery - b.battery;
      case 'alerts':
        return b.alerts - a.alerts;
      default:
        return 0;
    }
  });

  const stats = {
    total: nodes.length,
    online: nodes.filter(n => n.online).length,
    offline: nodes.filter(n => !n.online).length,
    emergency: nodes.filter(n => n.status === 'SOS').length,
    lowBattery: nodes.filter(n => n.battery < 30).length,
    avgHeartRate: Math.round(nodes.reduce((sum, n) => sum + n.heartRate, 0) / nodes.length),
    activeAlerts: nodes.reduce((sum, n) => sum + n.alerts, 0)
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-rajdhani font-bold text-2xl mb-4 neon-text-blue flex items-center gap-2">
          <Users className="w-7 h-7" />
          IoT Nodes Management
        </h2>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani neon-text-blue">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">Total Nodes</div>
          </div>
          <div className="glass-panel-hover p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="text-2xl font-bold font-rajdhani text-green-400">{stats.online}</div>
            </div>
            <div className="text-xs text-gray-400">Online</div>
          </div>
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani text-red-400">{stats.emergency}</div>
            <div className="text-xs text-gray-400 mt-1">Emergency</div>
          </div>
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani text-orange-400">{stats.activeAlerts}</div>
            <div className="text-xs text-gray-400 mt-1">Active Alerts</div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by device ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-neon-blue"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
          >
            <option value="deviceId">Sort by ID</option>
            <option value="heartRate">Sort by Heart Rate</option>
            <option value="battery">Sort by Battery</option>
            <option value="alerts">Sort by Alerts</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Nodes', count: stats.total },
            { id: 'online', label: 'Online', count: stats.online },
            { id: 'offline', label: 'Offline', count: stats.offline },
            { id: 'emergency', label: 'Emergency', count: stats.emergency },
            { id: 'lowBattery', label: 'Low Battery', count: stats.lowBattery }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filterStatus === filter.id
                  ? 'bg-neon-blue text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-white/20">{filter.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-6"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 207, 255, 0.3) rgba(255, 255, 255, 0.05)'
        }}
      >
        {sortedNodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-rajdhani">No nodes found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNodes.map((node) => (
              <NodeCard key={node.deviceId} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NodeCard = ({ node }) => {
  const isEmergency = node.status === 'SOS' || node.heartRate > 140;
  const isLowBattery = node.battery < 30;
  const isWeakSignal = node.signalStrength < 50;

  const getBatteryColor = (battery) => {
    if (battery >= 60) return 'text-green-400';
    if (battery >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalColor = (signal) => {
    if (signal >= 70) return 'text-green-400';
    if (signal >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`glass-panel-hover p-4 relative ${
      isEmergency ? 'alert-card-emergency' : ''
    } ${!node.online ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`icon-container-${isEmergency ? 'red' : 'blue'}`}>
              <Smartphone className={`w-5 h-5 ${
                isEmergency ? 'text-neon-red' : 'text-neon-blue'
              }`} />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
              node.online ? 'bg-green-500' : 'bg-gray-500'
            } border-2 border-midnight-900`}></div>
          </div>
          <div>
            <h3 className="font-rajdhani font-semibold text-base">{node.deviceId}</h3>
            <div className="flex items-center gap-2 mt-1">
              {node.online ? (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <Wifi className="w-3 h-3" />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>

        {isEmergency && (
          <span className="status-badge status-badge-emergency text-xs animate-pulse">
            SOS
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart className="w-4 h-4" />
            <span>Heart Rate</span>
          </div>
          <span className={`font-bold font-rajdhani ${
            node.heartRate > 140 ? 'neon-text-red' : 
            node.heartRate > 100 ? 'text-yellow-400' : 'neon-text-blue'
          }`}>
            {node.heartRate} BPM
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Battery className={`w-4 h-4 ${isLowBattery ? 'animate-pulse' : ''}`} />
            <span>Battery</span>
          </div>
          <span className={`font-bold font-rajdhani ${getBatteryColor(node.battery)}`}>
            {node.battery}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Signal className="w-4 h-4" />
            <span>Signal</span>
          </div>
          <span className={`font-bold font-rajdhani ${getSignalColor(node.signalStrength)}`}>
            {node.signalStrength}%
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 pt-2 border-t border-white/5">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate text-xs">{node.location}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Last seen:</span>
          </div>
          <span className="text-gray-400">{node.lastSeen}</span>
        </div>

        {node.alerts > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Active Alerts</span>
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-bold">
                {node.alerts}
              </span>
            </div>
          </div>
        )}

        {(isLowBattery || isWeakSignal) && (
          <div className="pt-2 space-y-1">
            {isLowBattery && (
              <div className="flex items-center gap-2 text-xs text-orange-400">
                <AlertCircle className="w-3 h-3" />
                <span>Low battery warning</span>
              </div>
            )}
            {isWeakSignal && (
              <div className="flex items-center gap-2 text-xs text-yellow-400">
                <AlertCircle className="w-3 h-3" />
                <span>Weak signal detected</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Total Alerts (Lifetime)</span>
          <span className="font-rajdhani font-bold">{node.totalAlerts}</span>
        </div>
      </div>
    </div>
  );
};

export default NodesView;
