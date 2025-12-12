import React from 'react';
import { RefreshCw } from 'lucide-react';

const AlertsHeader = ({ activeAlerts, totalNodes }) => {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl font-rajdhani">Active Distress Signals</h2>
          <p className="text-sm text-gray-400">{activeAlerts} Emergency / {totalNodes} Total</p>
        </div>
        <button className="p-2 glass-panel-hover rounded-lg hover:rotate-180 transition-transform duration-500">
          <RefreshCw className="w-5 h-5 text-neon-blue" />
        </button>
      </div>
    </div>
  );
};

export default AlertsHeader;
