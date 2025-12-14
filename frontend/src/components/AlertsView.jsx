import { useState } from 'react';
import { Activity, Heart, MapPin, Wifi, Clock, CheckCircle, AlertTriangle, Filter, Search, X } from 'lucide-react';

const AlertsView = ({ activeAlerts, solvedAlerts, onReactivate, onPermanentDelete }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allAlerts = [
    ...activeAlerts.map(alert => ({ ...alert, status: 'active', alertStatus: alert.status })),
    ...solvedAlerts.map(alert => ({ ...alert, status: 'solved', alertStatus: alert.originalStatus }))
  ];

  const filteredAlerts = allAlerts.filter(alert => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && alert.status === 'active') ||
      (filter === 'solved' && alert.status === 'solved') ||
      (filter === 'emergency' && alert.alertStatus === 'SOS');
    
    const matchesSearch = 
      alert.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: allAlerts.length,
    active: activeAlerts.length,
    solved: solvedAlerts.length,
    emergency: allAlerts.filter(a => a.alertStatus === 'SOS').length
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-rajdhani font-bold text-2xl mb-4 neon-text-red">
          📋 All Alerts Dashboard
        </h2>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani neon-text-blue">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">Total Alerts</div>
          </div>
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani neon-text-red">{stats.active}</div>
            <div className="text-xs text-gray-400 mt-1">Active</div>
          </div>
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani text-green-400">{stats.solved}</div>
            <div className="text-xs text-gray-400 mt-1">Solved</div>
          </div>
          <div className="glass-panel-hover p-3 text-center">
            <div className="text-2xl font-bold font-rajdhani text-orange-400">{stats.emergency}</div>
            <div className="text-xs text-gray-400 mt-1">Emergency</div>
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
        </div>

        <div className="flex gap-2">
          {['all', 'active', 'solved', 'emergency'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterType
                  ? 'bg-neon-red text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 56, 100, 0.3) rgba(255, 255, 255, 0.05)'
      }}>
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <AlertTriangle className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-rajdhani">No alerts found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <AlertDetailCard
              key={`${alert.deviceId}-${alert.timestamp}-${index}`}
              alert={alert}
              onReactivate={onReactivate}
              onPermanentDelete={onPermanentDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

const AlertDetailCard = ({ alert, onReactivate, onPermanentDelete }) => {
  const isActive = alert.status === 'active';
  const isEmergency = alert.alertStatus === 'SOS' || alert.heartRate > 140;

  return (
    <div className={`glass-panel-hover p-4 relative ${
      isEmergency && isActive ? 'alert-card-emergency' : ''
    } ${!isActive ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-4 h-4 rounded-full ${
              isActive 
                ? (isEmergency ? 'bg-neon-red' : 'bg-green-500')
                : 'bg-gray-500'
            }`}></div>
            {isEmergency && isActive && (
              <div className="pulse-ring bg-neon-red opacity-75"></div>
            )}
          </div>
          <div>
            <h3 className="font-rajdhani font-semibold text-lg">{alert.deviceId}</h3>
            <div className="flex items-center gap-2 mt-1">
              {isActive ? (
                <span className="status-badge bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                  Active
                </span>
              ) : (
                <span className="status-badge bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Solved
                </span>
              )}
              {isEmergency && (
                <span className="status-badge status-badge-emergency text-xs">
                  SOS
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isActive && (
            <button
              onClick={() => onReactivate(alert)}
              className="px-3 py-1 text-xs rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/50 hover:bg-blue-600/30 transition-colors"
              title="Reactivate Alert"
            >
              Reactivate
            </button>
          )}
          <button
            onClick={() => onPermanentDelete(alert)}
            className="px-3 py-1 text-xs rounded-md bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/30 transition-colors"
            title="Delete Permanently"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4" />
              <span>Heart Rate</span>
            </div>
            <span className={`font-bold text-lg font-rajdhani ${
              alert.heartRate > 140 ? 'neon-text-red' : 'neon-text-blue'
            }`}>
              {alert.heartRate} BPM
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate text-xs">{alert.location}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{alert.timestamp}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Wifi className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-gray-500'}`} />
            <span className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
              {isActive ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {alert.coordinates && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>
              Coordinates: {alert.coordinates[0].toFixed(4)}, {alert.coordinates[1].toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {alert.solvedAt && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Solved at: {alert.solvedAt}
        </div>
      )}
    </div>
  );
};

export default AlertsView;
