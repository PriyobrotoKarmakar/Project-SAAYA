import { useState, useEffect } from 'react';
import { 
  Database, Search, X, Filter, Download, RefreshCw, Clock, 
  AlertCircle, CheckCircle, Info, XCircle, Activity, Heart,
  MapPin, Wifi, Server, Terminal, FileText, Eye, ChevronDown,
  Calendar, User, Zap, Shield
} from 'lucide-react';

const DataLogsView = ({ alerts, solvedAlerts }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  const [logType, setLogType] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const generatedLogs = generateLogs(alerts, solvedAlerts);
    setLogs(generatedLogs);
    setFilteredLogs(generatedLogs);
  }, [alerts, solvedAlerts]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        const newLogs = generateLogs(alerts, solvedAlerts);
        setLogs(newLogs);
        applyFilters(newLogs);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, alerts, solvedAlerts, searchTerm, logLevel, logType]);

  const applyFilters = (logData = logs) => {
    let filtered = [...logData];

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (logLevel !== 'all') {
      filtered = filtered.filter(log => log.level === logLevel);
    }

    if (logType !== 'all') {
      filtered = filtered.filter(log => log.type === logType);
    }

    setFilteredLogs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, logLevel, logType, logs]);

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `saaya-logs-${new Date().toISOString()}.json`;
    link.click();
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warning').length,
    info: logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/10 glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-rajdhani font-bold text-3xl neon-text-blue flex items-center gap-3">
              <Database className="w-8 h-8" />
              System Data Logs
            </h2>
            <p className="text-gray-400 text-sm mt-1">Real-time system event monitoring and telemetry logs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                autoRefresh 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Paused'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/30 transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-4">
          <StatBadge label="Total Logs" value={stats.total} icon={FileText} color="blue" />
          <StatBadge label="Errors" value={stats.errors} icon={XCircle} color="red" />
          <StatBadge label="Warnings" value={stats.warnings} icon={AlertCircle} color="yellow" />
          <StatBadge label="Info" value={stats.info} icon={Info} color="cyan" />
          <StatBadge label="Success" value={stats.success} icon={CheckCircle} color="green" />
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by message, device ID, or source..."
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
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
          >
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </select>

          <select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
          >
            <option value="all">All Types</option>
            <option value="telemetry">Telemetry</option>
            <option value="alert">Alert</option>
            <option value="api">API</option>
            <option value="system">System</option>
            <option value="database">Database</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${selectedLog ? 'w-2/3' : 'w-full'} flex flex-col border-r border-white/10`}>
          <div 
            className="flex-1 overflow-y-auto"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 207, 255, 0.3) rgba(255, 255, 255, 0.05)'
            }}
          >
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <Database className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-rajdhani">No logs found</p>
                <p className="text-sm">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-midnight-900 border-b border-white/10">
                  <tr className="text-left text-xs text-gray-400 uppercase">
                    <th className="p-4 font-medium">Timestamp</th>
                    <th className="p-4 font-medium">Level</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Source</th>
                    <th className="p-4 font-medium flex-1">Message</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <LogRow 
                      key={log.id} 
                      log={log} 
                      onSelect={() => setSelectedLog(log)}
                      isSelected={selectedLog?.id === log.id}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {selectedLog && (
          <div className="w-1/3 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-rajdhani font-semibold text-lg">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 207, 255, 0.3) rgba(255, 255, 255, 0.05)'
              }}
            >
              <LogDetailView log={selectedLog} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatBadge = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'text-neon-blue bg-blue-500/10',
    red: 'text-red-400 bg-red-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    green: 'text-green-400 bg-green-500/10'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-3 flex items-center gap-3`}>
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

const LogRow = ({ log, onSelect, isSelected }) => {
  const levelConfig = {
    error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
    warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    info: { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
  };

  const config = levelConfig[log.level];
  const Icon = config.icon;

  return (
    <tr 
      className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
        isSelected ? 'bg-neon-blue/10' : ''
      }`}
      onClick={onSelect}
    >
      <td className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{log.timestamp}</span>
        </div>
      </td>
      <td className="p-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.color} text-xs font-medium`}>
          <Icon className="w-3 h-3" />
          <span>{log.level.toUpperCase()}</span>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm text-gray-300 font-medium">{log.type}</span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {log.deviceId && <User className="w-3 h-3" />}
          <span>{log.source}</span>
        </div>
      </td>
      <td className="p-4">
        <p className="text-sm text-gray-300 truncate max-w-md">{log.message}</p>
      </td>
      <td className="p-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="text-neon-blue hover:text-neon-blue/80 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const LogDetailView = ({ log }) => {
  const levelConfig = {
    error: { icon: XCircle, color: 'text-red-400' },
    warning: { icon: AlertCircle, color: 'text-yellow-400' },
    info: { icon: Info, color: 'text-cyan-400' },
    success: { icon: CheckCircle, color: 'text-green-400' }
  };

  const config = levelConfig[log.level];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div className={`glass-panel-hover p-4 ${config.color}`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-6 h-6" />
          <h4 className="font-rajdhani font-semibold text-lg">{log.level.toUpperCase()}</h4>
        </div>
        <p className="text-sm text-gray-300">{log.message}</p>
      </div>

      <div className="glass-panel-hover p-4 space-y-3">
        <DetailItem icon={Clock} label="Timestamp" value={log.timestamp} />
        <DetailItem icon={Terminal} label="Type" value={log.type} />
        <DetailItem icon={Server} label="Source" value={log.source} />
        {log.deviceId && <DetailItem icon={User} label="Device ID" value={log.deviceId} />}
        {log.endpoint && <DetailItem icon={Zap} label="Endpoint" value={log.endpoint} />}
      </div>

      {log.data && (
        <div className="glass-panel-hover p-4">
          <h5 className="font-rajdhani font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-blue" />
            Additional Data
          </h5>
          <div className="space-y-2">
            {Object.entries(log.data).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between text-sm">
                <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-gray-300 font-mono text-xs ml-3 text-right">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {log.stackTrace && (
        <div className="glass-panel-hover p-4">
          <h5 className="font-rajdhani font-semibold mb-3 flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            Stack Trace
          </h5>
          <pre className="text-xs text-gray-400 font-mono bg-black/30 p-3 rounded overflow-x-auto">
            {log.stackTrace}
          </pre>
        </div>
      )}

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/30 transition-all">
          Copy Details
        </button>
        <button className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all">
          Report Issue
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
    <span className="text-gray-300 text-sm font-medium">{value}</span>
  </div>
);

const generateLogs = (alerts, solvedAlerts) => {
  const logs = [];
  let logId = 1;

  alerts.forEach(alert => {
    logs.push({
      id: logId++,
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      type: 'telemetry',
      source: 'IoT Device',
      deviceId: alert.deviceId,
      message: `Telemetry data received from ${alert.deviceId}`,
      data: {
        heartRate: alert.heartRate,
        location: alert.location,
        coordinates: alert.coordinates,
        status: alert.status
      }
    });

    if (alert.status === 'SOS') {
      logs.push({
        id: logId++,
        timestamp: new Date().toLocaleTimeString(),
        level: 'error',
        type: 'alert',
        source: 'Alert System',
        deviceId: alert.deviceId,
        message: `EMERGENCY ALERT: High heart rate detected (${alert.heartRate} BPM)`,
        data: {
          heartRate: alert.heartRate,
          threshold: 150,
          location: alert.location,
          coordinates: alert.coordinates
        }
      });
    }
  });

  solvedAlerts.forEach(alert => {
    logs.push({
      id: logId++,
      timestamp: alert.solvedAt || new Date().toLocaleTimeString(),
      level: 'success',
      type: 'alert',
      source: 'Alert System',
      deviceId: alert.deviceId,
      message: `Alert resolved for ${alert.deviceId}`,
      data: {
        deviceId: alert.deviceId,
        originalStatus: alert.originalStatus,
        resolvedAt: alert.solvedAt
      }
    });
  });

  const systemLogs = [
    {
      id: logId++,
      timestamp: new Date().toLocaleTimeString(),
      level: 'success',
      type: 'system',
      source: 'Backend Server',
      message: 'Health check endpoint responded successfully',
      endpoint: 'GET /api/health',
      data: { status: 'UP', responseTime: '23ms' }
    },
    {
      id: logId++,
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      level: 'info',
      type: 'api',
      source: 'API Gateway',
      message: 'Alerts endpoint accessed',
      endpoint: 'GET /api/alerts',
      data: { responseCode: 200, responseTime: '45ms' }
    },
    {
      id: logId++,
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      level: 'info',
      type: 'database',
      source: 'Data Store',
      message: 'Alert data synchronized to memory cache',
      data: { recordCount: alerts.length, operation: 'SYNC' }
    },
    {
      id: logId++,
      timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
      level: 'warning',
      type: 'system',
      source: 'IoT Device',
      message: 'Weak signal strength detected on node',
      deviceId: 'Saaya_005',
      data: { signalStrength: 42, threshold: 50 }
    }
  ];

  logs.push(...systemLogs);

  return logs.sort((a, b) => {
    const timeA = new Date(`1970-01-01 ${a.timestamp}`);
    const timeB = new Date(`1970-01-01 ${b.timestamp}`);
    return timeB - timeA;
  });
};

export default DataLogsView;
