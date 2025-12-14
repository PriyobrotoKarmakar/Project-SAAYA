import { Activity, AlertTriangle, Heart, MapPin, Wifi, ShieldAlert, X } from 'lucide-react';

const AlertCard = ({ deviceId, heartRate, status, location, timestamp, onVerify, onRemove, isVerified }) => {
  const isEmergency = status === 'SOS' || heartRate > 140;
  
  return (
    <div className={`glass-panel-hover p-4 relative ${isEmergency ? 'alert-card-emergency' : ''}`}>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition-colors group"
        title="Remove Alert"
      >
        <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
      </button>

      <div className="flex items-start justify-between mb-3 pr-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isEmergency ? 'bg-neon-red' : 'bg-green-500'}`}></div>
            {isEmergency && (
              <div className="pulse-ring bg-neon-red opacity-75"></div>
            )}
          </div>
          <h3 className="font-rajdhani font-semibold text-lg">{deviceId}</h3>
        </div>
        
        {isEmergency && (
          <span className="status-badge status-badge-emergency animate-pulse">
            {status}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart className="w-4 h-4" />
            <span>Heart Rate</span>
          </div>
          <span className={`font-bold text-lg font-rajdhani ${heartRate > 140 ? 'neon-text-red' : 'neon-text-blue'}`}>
            {heartRate} BPM
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-green-500" />
            <span>Online</span>
          </div>
        </div>

        {isEmergency && (
          <button
            onClick={onVerify}
            disabled={isVerified}
            className={`w-full mt-3 px-4 py-2 rounded-md font-rajdhani font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              isVerified 
                ? 'bg-green-600/20 text-green-400 border border-green-500/50 cursor-not-allowed' 
                : 'bg-red-600/20 text-red-400 border border-red-500 hover:bg-red-600/30 hover:border-red-400 cursor-pointer'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {isVerified ? 'VERIFIED - Route Active' : 'Verify Rape Attempt'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
