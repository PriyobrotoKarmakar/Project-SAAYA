import { Home, Map, Bell, Settings, Shield, Users, TrendingUp, Database } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', badge: null },
    { id: 'map', icon: Map, label: 'Live Map', badge: null },
    { id: 'alerts', icon: Bell, label: 'Alerts', badge: 12 },
    { id: 'users', icon: Users, label: 'Nodes', badge: null },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null },
    { id: 'data', icon: Database, label: 'Data Logs', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className="glass-panel h-full p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 px-2">
          <div className="icon-container-red">
            <Shield className="w-6 h-6 text-neon-red" />
          </div>
          <div>
            <h1 className="font-bold text-xl font-rajdhani">SAAYA</h1>
            <p className="text-xs text-gray-500">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'sidebar-item-active'
                  : 'hover:bg-white-5 text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-neon-red' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-neon-red-20 text-neon-red">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="status-dot status-dot-green animate-pulse"></div>
          <span className="text-sm text-gray-400">System Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
