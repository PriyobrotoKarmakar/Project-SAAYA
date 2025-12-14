import React from 'react';

const Header = ({ currentTime }) => {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-rajdhani">
            Saaya Command Center
          </h1>
          <p className="text-sm text-gray-400">
            Real-time monitoring and emergency response system
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-rajdhani neon-text-blue">
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-400">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
