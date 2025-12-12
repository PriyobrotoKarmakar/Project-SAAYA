import React from 'react';
import StatWidget from './StatWidget';
import { Activity, Users, Zap, TrendingUp } from 'lucide-react';

const StatsGrid = ({ totalNodes, activeAlerts }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatWidget
        icon={Users}
        label="Active Nodes"
        value={totalNodes}
        trend={5}
        status="good"
      />
      <StatWidget
        icon={Activity}
        label="SOS Alerts"
        value={activeAlerts}
        trend={-15}
        status={activeAlerts > 0 ? 'critical' : 'normal'}
      />
      <StatWidget
        icon={TrendingUp}
        label="System Health"
        value="99.8%"
        trend={0.2}
        status="good"
      />
      <StatWidget
        icon={Zap}
        label="Avg Response"
        value="1.8s"
        trend={-12}
        status="normal"
      />
    </div>
  );
};

export default StatsGrid;
