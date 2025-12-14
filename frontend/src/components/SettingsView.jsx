import { useState } from 'react';
import { 
  Settings, Save, RotateCcw, Bell, Shield, Map, Users, 
  Monitor, Moon, Sun, Volume2, VolumeX, Wifi, Database,
  Lock, Eye, EyeOff, Globe, Clock, Zap, Mail, Phone,
  Smartphone, Heart, AlertTriangle, CheckCircle, Info, Layers
} from 'lucide-react';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    theme: 'dark',
    language: 'en',
    timezone: 'Asia/Kolkata',
    notifications: true,
    soundEffects: true,
    
    // Alert Settings
    autoVerifyThreshold: 150,
    alertPriority: 'high',
    sosNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    alertRetention: 30,
    
    // Map Settings
    defaultZoom: 5,
    mapStyle: 'satellite',
    showPoliceStations: false,
    showRoutes: true,
    autoCenter: true,
    clusterMarkers: false,
    
    // System Settings
    refreshInterval: 2,
    maxAlerts: 50,
    logLevel: 'info',
    apiTimeout: 30,
    dataRetention: 90,
    autoBackup: true,
    
    // Privacy Settings
    showDeviceIds: true,
    showCoordinates: true,
    anonymizeData: false,
    shareAnalytics: true,
    
    // Contact Settings
    emergencyContact: '1091',
    adminEmail: 'admin@saaya.com',
    supportPhone: '+91-100',
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('saaya_settings', JSON.stringify(settings));
    setHasChanges(false);
    
    // Show success notification
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset to defaults
      const defaultSettings = {
        theme: 'dark',
        language: 'en',
        timezone: 'Asia/Kolkata',
        notifications: true,
        soundEffects: true,
        autoVerifyThreshold: 150,
        alertPriority: 'high',
        sosNotifications: true,
        emailAlerts: true,
        smsAlerts: false,
        alertRetention: 30,
        defaultZoom: 5,
        mapStyle: 'satellite',
        showPoliceStations: false,
        showRoutes: true,
        autoCenter: true,
        clusterMarkers: false,
        refreshInterval: 2,
        maxAlerts: 50,
        logLevel: 'info',
        apiTimeout: 30,
        dataRetention: 90,
        autoBackup: true,
        showDeviceIds: true,
        showCoordinates: true,
        anonymizeData: false,
        shareAnalytics: true,
        emergencyContact: '1091',
        adminEmail: 'admin@saaya.com',
        supportPhone: '+91-100',
      };
      setSettings(defaultSettings);
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'contacts', label: 'Contacts', icon: Phone },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/10 glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-rajdhani font-bold text-3xl neon-text-blue flex items-center gap-3">
              <Settings className="w-8 h-8" />
              System Settings
            </h2>
            <p className="text-gray-400 text-sm mt-1">Configure your dashboard preferences and system parameters</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                hasChanges
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/30'
                  : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-6"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 207, 255, 0.3) rgba(255, 255, 255, 0.05)'
        }}
      >
        {activeTab === 'general' && <GeneralSettings settings={settings} onChange={handleChange} />}
        {activeTab === 'alerts' && <AlertSettings settings={settings} onChange={handleChange} />}
        {activeTab === 'map' && <MapSettings settings={settings} onChange={handleChange} />}
        {activeTab === 'system' && <SystemSettings settings={settings} onChange={handleChange} />}
        {activeTab === 'privacy' && <PrivacySettings settings={settings} onChange={handleChange} />}
        {activeTab === 'contacts' && <ContactSettings settings={settings} onChange={handleChange} />}
      </div>
    </div>
  );
};

const GeneralSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <SettingSection title="Appearance" icon={Monitor}>
      <SettingRow label="Theme" description="Choose your preferred color scheme">
        <select
          value={settings.theme}
          onChange={(e) => onChange('theme', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
          <option value="auto">Auto (System)</option>
        </select>
      </SettingRow>

      <SettingRow label="Language" description="Select interface language">
        <select
          value={settings.language}
          onChange={(e) => onChange('language', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="bn">বাংলা (Bengali)</option>
        </select>
      </SettingRow>
    </SettingSection>

    <SettingSection title="Regional" icon={Globe}>
      <SettingRow label="Timezone" description="Set your local timezone">
        <select
          value={settings.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
          <option value="Asia/Dubai">GST (Asia/Dubai)</option>
          <option value="UTC">UTC</option>
        </select>
      </SettingRow>
    </SettingSection>

    <SettingSection title="Notifications" icon={Bell}>
      <ToggleRow
        label="Enable Notifications"
        description="Receive system notifications"
        checked={settings.notifications}
        onChange={(val) => onChange('notifications', val)}
      />

      <ToggleRow
        label="Sound Effects"
        description="Play sounds for alerts and events"
        checked={settings.soundEffects}
        onChange={(val) => onChange('soundEffects', val)}
      />
    </SettingSection>
  </div>
);

const AlertSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <SettingSection title="Alert Thresholds" icon={Heart}>
      <SettingRow label="Auto-Verify Threshold" description="Heart rate BPM that triggers automatic SOS">
        <input
          type="number"
          value={settings.autoVerifyThreshold}
          onChange={(e) => onChange('autoVerifyThreshold', parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-32 focus:outline-none focus:border-neon-blue"
          min="100"
          max="200"
        />
      </SettingRow>

      <SettingRow label="Alert Priority" description="Default priority level for new alerts">
        <select
          value={settings.alertPriority}
          onChange={(e) => onChange('alertPriority', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="critical">Critical Priority</option>
        </select>
      </SettingRow>
    </SettingSection>

    <SettingSection title="Alert Notifications" icon={Bell}>
      <ToggleRow
        label="SOS Notifications"
        description="Instant notifications for emergency alerts"
        checked={settings.sosNotifications}
        onChange={(val) => onChange('sosNotifications', val)}
      />

      <ToggleRow
        label="Email Alerts"
        description="Send alerts via email"
        checked={settings.emailAlerts}
        onChange={(val) => onChange('emailAlerts', val)}
      />

      <ToggleRow
        label="SMS Alerts"
        description="Send alerts via SMS (requires integration)"
        checked={settings.smsAlerts}
        onChange={(val) => onChange('smsAlerts', val)}
      />
    </SettingSection>

    <SettingSection title="Data Retention" icon={Database}>
      <SettingRow label="Alert Retention Period" description="Days to keep alert history">
        <input
          type="number"
          value={settings.alertRetention}
          onChange={(e) => onChange('alertRetention', parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-32 focus:outline-none focus:border-neon-blue"
          min="7"
          max="365"
        />
      </SettingRow>
    </SettingSection>
  </div>
);

const MapSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <SettingSection title="Map Display" icon={Map}>
      <SettingRow label="Default Zoom Level" description="Initial map zoom (1-18)">
        <input
          type="range"
          value={settings.defaultZoom}
          onChange={(e) => onChange('defaultZoom', parseInt(e.target.value))}
          className="w-48"
          min="1"
          max="18"
        />
        <span className="text-sm font-bold font-rajdhani text-neon-blue w-12 text-center">
          {settings.defaultZoom}
        </span>
      </SettingRow>

      <SettingRow label="Map Style" description="Select base map layer">
        <select
          value={settings.mapStyle}
          onChange={(e) => onChange('mapStyle', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="satellite">Satellite Imagery</option>
          <option value="streets">Street Map</option>
          <option value="hybrid">Hybrid View</option>
          <option value="terrain">Terrain View</option>
        </select>
      </SettingRow>
    </SettingSection>

    <SettingSection title="Map Layers" icon={Layers}>
      <ToggleRow
        label="Show Police Stations"
        description="Display all police station markers by default"
        checked={settings.showPoliceStations}
        onChange={(val) => onChange('showPoliceStations', val)}
      />

      <ToggleRow
        label="Show Routes"
        description="Display verified emergency routes"
        checked={settings.showRoutes}
        onChange={(val) => onChange('showRoutes', val)}
      />

      <ToggleRow
        label="Auto Center Map"
        description="Automatically center on new alerts"
        checked={settings.autoCenter}
        onChange={(val) => onChange('autoCenter', val)}
      />

      <ToggleRow
        label="Cluster Markers"
        description="Group nearby markers for better performance"
        checked={settings.clusterMarkers}
        onChange={(val) => onChange('clusterMarkers', val)}
      />
    </SettingSection>
  </div>
);

const SystemSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <SettingSection title="Performance" icon={Zap}>
      <SettingRow label="Refresh Interval" description="Seconds between data updates">
        <input
          type="number"
          value={settings.refreshInterval}
          onChange={(e) => onChange('refreshInterval', parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-32 focus:outline-none focus:border-neon-blue"
          min="1"
          max="60"
        />
      </SettingRow>

      <SettingRow label="Max Alerts Displayed" description="Maximum alerts to show at once">
        <input
          type="number"
          value={settings.maxAlerts}
          onChange={(e) => onChange('maxAlerts', parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-32 focus:outline-none focus:border-neon-blue"
          min="10"
          max="500"
        />
      </SettingRow>
    </SettingSection>

    <SettingSection title="Logging" icon={Database}>
      <SettingRow label="Log Level" description="System logging verbosity">
        <select
          value={settings.logLevel}
          onChange={(e) => onChange('logLevel', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue"
        >
          <option value="error">Error Only</option>
          <option value="warning">Warning & Above</option>
          <option value="info">Info & Above</option>
          <option value="debug">Debug (All Logs)</option>
        </select>
      </SettingRow>

      <SettingRow label="Data Retention" description="Days to keep system logs">
        <input
          type="number"
          value={settings.dataRetention}
          onChange={(e) => onChange('dataRetention', parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-32 focus:outline-none focus:border-neon-blue"
          min="7"
          max="365"
        />
      </SettingRow>
    </SettingSection>

    <SettingSection title="API Configuration" icon={Wifi}>
      <SettingRow label="API Timeout" description="Request timeout in seconds">
        <input
          type="number"
          value={settings.apiTimeout}
          onChange={(e) => onChange('apiTimeout', parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-32 focus:outline-none focus:border-neon-blue"
          min="5"
          max="120"
        />
      </SettingRow>

      <ToggleRow
        label="Auto Backup"
        description="Automatically backup data daily"
        checked={settings.autoBackup}
        onChange={(val) => onChange('autoBackup', val)}
      />
    </SettingSection>
  </div>
);

const PrivacySettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <SettingSection title="Data Display" icon={Eye}>
      <ToggleRow
        label="Show Device IDs"
        description="Display full device identifiers"
        checked={settings.showDeviceIds}
        onChange={(val) => onChange('showDeviceIds', val)}
      />

      <ToggleRow
        label="Show Coordinates"
        description="Display GPS coordinates in alerts"
        checked={settings.showCoordinates}
        onChange={(val) => onChange('showCoordinates', val)}
      />
    </SettingSection>

    <SettingSection title="Data Privacy" icon={Shield}>
      <ToggleRow
        label="Anonymize Data"
        description="Remove personally identifiable information"
        checked={settings.anonymizeData}
        onChange={(val) => onChange('anonymizeData', val)}
      />

      <ToggleRow
        label="Share Analytics"
        description="Help improve the system by sharing usage data"
        checked={settings.shareAnalytics}
        onChange={(val) => onChange('shareAnalytics', val)}
      />
    </SettingSection>

    <div className="glass-panel-hover p-4 flex items-start gap-3 border border-blue-500/30">
      <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-rajdhani font-semibold text-sm mb-1">Privacy Notice</h4>
        <p className="text-xs text-gray-400">
          Your data is encrypted and stored securely. We never share personal information with third parties 
          without explicit consent. For more details, please review our Privacy Policy.
        </p>
      </div>
    </div>
  </div>
);

const ContactSettings = ({ settings, onChange }) => (
  <div className="space-y-6">
    <SettingSection title="Emergency Contacts" icon={AlertTriangle}>
      <SettingRow label="Women Helpline" description="National emergency contact">
        <input
          type="text"
          value={settings.emergencyContact}
          onChange={(e) => onChange('emergencyContact', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-48 focus:outline-none focus:border-neon-blue"
        />
      </SettingRow>
    </SettingSection>

    <SettingSection title="Administrative Contacts" icon={Users}>
      <SettingRow label="Admin Email" description="System administrator email">
        <input
          type="email"
          value={settings.adminEmail}
          onChange={(e) => onChange('adminEmail', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-neon-blue"
          placeholder="admin@example.com"
        />
      </SettingRow>

      <SettingRow label="Support Phone" description="Technical support hotline">
        <input
          type="tel"
          value={settings.supportPhone}
          onChange={(e) => onChange('supportPhone', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-48 focus:outline-none focus:border-neon-blue"
          placeholder="+91-XXX-XXXXXXX"
        />
      </SettingRow>
    </SettingSection>

    <div className="glass-panel-hover p-6 space-y-4">
      <h4 className="font-rajdhani font-semibold flex items-center gap-2">
        <Smartphone className="w-5 h-5 text-neon-blue" />
        Quick Access Hotlines
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <ContactCard icon={Shield} label="Women Helpline" value="1091" color="red" />
        <ContactCard icon={Phone} label="Emergency" value="112" color="blue" />
        <ContactCard icon={Shield} label="Police" value="100" color="green" />
        <ContactCard icon={Heart} label="Ambulance" value="102" color="purple" />
      </div>
    </div>
  </div>
);

const SettingSection = ({ title, icon: Icon, children }) => (
  <div className="glass-panel p-6">
    <h3 className="font-rajdhani font-semibold text-lg mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5 text-neon-blue" />
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1">
      <div className="font-medium text-sm text-gray-200">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5">{description}</div>
    </div>
    <div className="flex items-center gap-2">
      {children}
    </div>
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <SettingRow label={label} description={description}>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
    </label>
  </SettingRow>
);

const ContactCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    red: 'border-red-500/30 bg-red-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5'
  };

  return (
    <div className={`glass-panel-hover p-4 border ${colorClasses[color]} flex items-center gap-3`}>
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-bold font-rajdhani text-lg neon-text-blue">{value}</div>
      </div>
    </div>
  );
};

export default SettingsView;
