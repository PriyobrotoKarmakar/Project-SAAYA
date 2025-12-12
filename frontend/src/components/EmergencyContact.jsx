import React from 'react';
import { Activity } from 'lucide-react';

const EmergencyContact = () => {
  return (
    <div className="glass-panel p-4 emergency-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="icon-container-red">
          <Activity className="w-5 h-5 text-neon-red" />
        </div>
        <div>
          <h3 className="font-bold font-rajdhani">Emergency Hotline</h3>
          <p className="text-2xl font-bold text-neon-red font-rajdhani">1091</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        24/7 Women's Safety Helpline
      </p>
    </div>
  );
};

export default EmergencyContact;
