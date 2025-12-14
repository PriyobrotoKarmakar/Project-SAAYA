import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Activity, Heart, Bell, Users, MapPin, 
  Clock, AlertTriangle, CheckCircle, BarChart3, PieChart, Calendar,
  Zap, Shield, Battery, Wifi, ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const AnalyticsView = ({ alerts, solvedAlerts }) => {
  const [timeRange, setTimeRange] = useState('today');

  const analytics = calculateAnalytics(alerts, solvedAlerts, timeRange);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6" style={{ 
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0, 207, 255, 0.3) rgba(255, 255, 255, 0.05)'
    }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-rajdhani font-bold text-3xl neon-text-blue flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            System Analytics
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time insights and performance metrics</p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KPICard
          title="Total Alerts"
          value={analytics.totalAlerts}
          change={analytics.alertsChange}
          icon={Bell}
          color="blue"
        />
        <KPICard
          title="Emergency Events"
          value={analytics.emergencyCount}
          change={analytics.emergencyChange}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Resolved Alerts"
          value={analytics.resolvedCount}
          change={analytics.resolvedChange}
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="Active Nodes"
          value={analytics.activeNodes}
          change={analytics.nodesChange}
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-rajdhani font-semibold text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-neon-blue" />
              Alert Trends
            </h3>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <BarChart data={analytics.weeklyTrends} />
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-rajdhani font-semibold text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-neon-blue" />
              Alert Status Distribution
            </h3>
          </div>
          <StatusPieChart data={analytics.statusDistribution} />
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-rajdhani font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-neon-blue" />
          System Performance
        </h3>
        <div className="grid grid-cols-4 gap-6">
          <MetricBar
            label="Response Time"
            value={analytics.avgResponseTime}
            max={100}
            unit="sec"
            color="blue"
          />
          <MetricBar
            label="Resolution Rate"
            value={analytics.resolutionRate}
            max={100}
            unit="%"
            color="green"
          />
          <MetricBar
            label="System Uptime"
            value={analytics.uptime}
            max={100}
            unit="%"
            color="purple"
          />
          <MetricBar
            label="Node Connectivity"
            value={analytics.connectivity}
            max={100}
            unit="%"
            color="yellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6">
          <h3 className="font-rajdhani font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neon-blue" />
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            {analytics.topLocations.map((loc, idx) => (
              <LocationBar key={idx} location={loc} rank={idx + 1} />
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-rajdhani font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-blue" />
            Peak Activity Hours
          </h3>
          <HourlyActivity data={analytics.hourlyActivity} />
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-rajdhani font-semibold text-lg mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-neon-blue" />
          Alert Response Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Avg Response Time"
            value={`${analytics.avgResponseTime}s`}
            subtext="Time to verify alert"
            icon={Clock}
          />
          <StatCard
            label="Fastest Response"
            value={`${analytics.fastestResponse}s`}
            subtext="Best response time"
            icon={Zap}
          />
          <StatCard
            label="Resolution Success"
            value={`${analytics.resolutionRate}%`}
            subtext="Successfully resolved"
            icon={CheckCircle}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container-red">
              <Heart className="w-5 h-5 text-neon-red" />
            </div>
            <div>
              <h3 className="font-rajdhani font-semibold">Heart Rate Analysis</h3>
              <p className="text-xs text-gray-500">Average BPM trends</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Average</span>
              <span className="font-bold font-rajdhani neon-text-blue">{analytics.avgHeartRate} BPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Peak</span>
              <span className="font-bold font-rajdhani text-red-400">{analytics.peakHeartRate} BPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Normal Range</span>
              <span className="font-bold font-rajdhani text-green-400">{analytics.normalRangePercent}%</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container-blue">
              <Battery className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h3 className="font-rajdhani font-semibold">Power Status</h3>
              <p className="text-xs text-gray-500">Node battery levels</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Avg Battery</span>
              <span className="font-bold font-rajdhani text-green-400">{analytics.avgBattery}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Low Battery</span>
              <span className="font-bold font-rajdhani text-orange-400">{analytics.lowBatteryCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Critical</span>
              <span className="font-bold font-rajdhani text-red-400">{analytics.criticalBatteryCount}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container-green">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-rajdhani font-semibold">Connectivity</h3>
              <p className="text-xs text-gray-500">Network status</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Online Nodes</span>
              <span className="font-bold font-rajdhani text-green-400">{analytics.onlineNodes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Avg Signal</span>
              <span className="font-bold font-rajdhani neon-text-blue">{analytics.avgSignal}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Weak Signal</span>
              <span className="font-bold font-rajdhani text-yellow-400">{analytics.weakSignalCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-rajdhani font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-blue" />
          AI Insights & Recommendations
        </h3>
        <div className="space-y-3">
          {analytics.insights.map((insight, idx) => (
            <InsightCard key={idx} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  const colorClasses = {
    blue: 'text-neon-blue bg-blue-500/10',
    red: 'text-neon-red bg-red-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10'
  };

  return (
    <div className="glass-panel-hover p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`icon-container-${color}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[0]}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="text-3xl font-bold font-rajdhani neon-text-blue mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
};

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{item.label}</span>
            <span className="font-bold">{item.value}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-neon-blue to-neon-red rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const StatusPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
        return (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-bold font-rajdhani w-12 text-right">{percentage}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MetricBar = ({ label, value, max, unit, color }) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: 'bg-neon-blue',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="font-bold font-rajdhani neon-text-blue">{value}{unit}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const LocationBar = ({ location, rank }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center">
        <span className="text-xs font-bold text-neon-blue">{rank}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-300">{location.name}</span>
          <span className="text-xs font-bold font-rajdhani text-neon-blue">{location.count}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-neon-blue to-purple-500 rounded-full"
            style={{ width: `${location.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const HourlyActivity = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between gap-1 h-32">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-white/5 rounded-t relative group cursor-pointer" style={{ 
            height: `${(item.value / maxValue) * 100}%`,
            minHeight: '4px'
          }}>
            <div className="absolute inset-0 bg-linear-to-r from-neon-blue to-purple-500 rounded-t opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-midnight-900 border border-neon-blue px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.value} alerts
            </div>
          </div>
          <span className="text-xs text-gray-500">{item.hour}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, subtext, icon: Icon }) => {
  return (
    <div className="glass-panel-hover p-4">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5 text-neon-blue" />
      </div>
      <div className="text-2xl font-bold font-rajdhani neon-text-blue mb-1">{value}</div>
      <div className="text-sm text-gray-300 mb-1">{label}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
};

const InsightCard = ({ insight }) => {
  const iconMap = {
    warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    info: { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' }
  };
  
  const config = iconMap[insight.type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border border-white/10 rounded-lg p-4 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${config.color} shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className="text-sm text-gray-300">{insight.message}</p>
        {insight.action && (
          <button className="text-xs text-neon-blue hover:text-neon-blue/80 mt-2 flex items-center gap-1">
            {insight.action} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

const calculateAnalytics = (alerts, solvedAlerts, timeRange) => {
  const allAlerts = [...alerts, ...solvedAlerts];
  const emergencyAlerts = allAlerts.filter(a => a.status === 'SOS' || a.alertStatus === 'SOS');
  
  const weeklyTrends = [
    { label: 'Mon', value: Math.floor(Math.random() * 15) + 5 },
    { label: 'Tue', value: Math.floor(Math.random() * 15) + 5 },
    { label: 'Wed', value: Math.floor(Math.random() * 15) + 5 },
    { label: 'Thu', value: Math.floor(Math.random() * 15) + 5 },
    { label: 'Fri', value: Math.floor(Math.random() * 15) + 5 },
    { label: 'Sat', value: Math.floor(Math.random() * 15) + 5 },
    { label: 'Sun', value: alerts.length }
  ];

  const statusDistribution = [
    { label: 'Emergency (SOS)', value: emergencyAlerts.length, color: 'bg-red-500' },
    { label: 'Resolved', value: solvedAlerts.length, color: 'bg-green-500' },
    { label: 'Normal', value: alerts.filter(a => a.status !== 'SOS').length, color: 'bg-blue-500' }
  ];

  const locationMap = new Map();
  allAlerts.forEach(alert => {
    const loc = alert.location || 'Unknown';
    locationMap.set(loc, (locationMap.get(loc) || 0) + 1);
  });
  const topLocations = Array.from(locationMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / allAlerts.length) * 100
    }));

  const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
    hour: i < 12 ? `${i || 12}AM` : `${i === 12 ? 12 : i - 12}PM`,
    value: Math.floor(Math.random() * 10)
  }));

  const insights = [
    {
      type: 'success',
      message: `${((solvedAlerts.length / allAlerts.length) * 100).toFixed(0)}% alert resolution rate is above target. Great response time!`
    },
    {
      type: 'warning',
      message: `${emergencyAlerts.length} emergency alerts detected. Ensure adequate police coverage in high-risk zones.`,
      action: 'View Emergency Map'
    },
    {
      type: 'info',
      message: 'Peak activity hours are 6PM-10PM. Consider increasing monitoring during these hours.',
      action: 'Adjust Schedule'
    }
  ];

  return {
    totalAlerts: allAlerts.length,
    alertsChange: 12,
    emergencyCount: emergencyAlerts.length,
    emergencyChange: -5,
    resolvedCount: solvedAlerts.length,
    resolvedChange: 8,
    activeNodes: alerts.length + Math.floor(Math.random() * 5),
    nodesChange: 3,
    avgResponseTime: Math.floor(Math.random() * 30) + 15,
    resolutionRate: solvedAlerts.length > 0 ? Math.round((solvedAlerts.length / allAlerts.length) * 100) : 85,
    uptime: 99.8,
    connectivity: 94,
    weeklyTrends,
    statusDistribution,
    topLocations,
    hourlyActivity,
    avgHeartRate: Math.floor(Math.random() * 20) + 80,
    peakHeartRate: Math.floor(Math.random() * 30) + 150,
    normalRangePercent: 78,
    avgBattery: 76,
    lowBatteryCount: 2,
    criticalBatteryCount: 0,
    onlineNodes: alerts.length,
    avgSignal: 87,
    weakSignalCount: 1,
    fastestResponse: 8,
    insights
  };
};

export default AnalyticsView;
