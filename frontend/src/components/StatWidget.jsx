const StatWidget = ({ icon: Icon, label, value, trend, status = 'normal' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'border-neon-red text-neon-red';
      case 'warning':
        return 'border-neon-orange text-neon-orange';
      case 'good':
        return 'border-green-500 text-green-500';
      default:
        return 'border-neon-blue text-neon-blue';
    }
  };

  return (
    <div className={`glass-panel p-4 border-l-2 ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold font-rajdhani">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-500' : 'text-neon-red'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last hour
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white-5 ${getStatusColor()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatWidget;
