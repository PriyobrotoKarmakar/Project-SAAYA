import React from 'react';
import AlertCard from './AlertCard';

const AlertsList = ({ alerts, onVerifyAlert, onRemoveAlert, verifiedAlerts }) => {
  // Helper function to create unique alert ID
  const getAlertId = (alert) => {
    return `${alert.deviceId}_${alert.timestamp}_${alert.coordinates?.join('_') || ''}`;
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
      {alerts
        .sort((a, b) => (b.status === 'SOS' ? 1 : -1) - (a.status === 'SOS' ? 1 : -1))
        .map((alert, index) => (
          <AlertCard 
            key={index} 
            {...alert} 
            onVerify={() => onVerifyAlert(alert)}
            onRemove={() => onRemoveAlert(alert)}
            isVerified={verifiedAlerts.has(getAlertId(alert))}
          />
        ))}
    </div>
  );
};

export default AlertsList;
