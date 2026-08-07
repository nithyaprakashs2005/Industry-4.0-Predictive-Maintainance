import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import PageHeader from '../components/layout/PageHeader';

export default function Settings() {
  const { settings, updateSettings, defaultSettings } = useMonitoring();
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocal(defaultSettings);
    updateSettings(defaultSettings);
  };

  const updateThreshold = (key, value) => {
    setLocal((prev) => ({
      ...prev,
      thresholds: { ...prev.thresholds, [key]: parseFloat(value) || 0 },
    }));
  };

  const updateSimulation = (key, value) => {
    setLocal((prev) => ({
      ...prev,
      simulation: { ...prev.simulation, [key]: value },
    }));
  };

  const updateNotification = (key, value) => {
    setLocal((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure monitoring thresholds, simulation and notifications"
        actions={
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-industrial-800 border border-industrial-700 text-industrial-400 hover:bg-industrial-700">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-status-info/10 border border-status-info/30 text-status-info hover:bg-status-info/20">
              <Save className="w-3.5 h-3.5" /> {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-industrial p-5">
          <h3 className="text-sm font-semibold text-industrial-300 mb-4">Monitoring Thresholds</h3>
          <div className="space-y-4">
            {[
              { key: 'temperature', label: 'Temperature Threshold', unit: '°C', max: 120 },
              { key: 'rpm', label: 'RPM Threshold', unit: 'RPM', max: 3000 },
              { key: 'vibration', label: 'Vibration Threshold', unit: 'mm/s', max: 0.5, step: 0.01 },
              { key: 'torque', label: 'Torque Threshold', unit: 'Nm', max: 50 },
            ].map(({ key, label, unit, max, step }) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-industrial-400">{label}</label>
                  <span className="text-xs text-industrial-300 tabular-nums">{local.thresholds[key]} {unit}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={max}
                  step={step || 1}
                  value={local.thresholds[key]}
                  onChange={(e) => updateThreshold(key, e.target.value)}
                  className="w-full accent-status-info"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card-industrial p-5">
          <h3 className="text-sm font-semibold text-industrial-300 mb-4">Simulation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-industrial-400">Simulation Speed</label>
                <span className="text-xs text-industrial-300">{local.simulation.speed}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.5}
                value={local.simulation.speed}
                onChange={(e) => updateSimulation('speed', parseFloat(e.target.value))}
                className="w-full accent-status-info"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-industrial-400">Update Interval</label>
                <span className="text-xs text-industrial-300">{local.simulation.updateInterval}ms</span>
              </div>
              <input
                type="range"
                min={500}
                max={3000}
                step={100}
                value={local.simulation.updateInterval}
                onChange={(e) => updateSimulation('updateInterval', parseInt(e.target.value))}
                className="w-full accent-status-info"
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-xs text-industrial-400">Auto Fault Simulation</span>
              <input
                type="checkbox"
                checked={local.simulation.autoFault}
                onChange={(e) => updateSimulation('autoFault', e.target.checked)}
                className="accent-status-info w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="card-industrial p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-industrial-300 mb-4">Notifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: 'criticalAlerts', label: 'Critical Alerts' },
              { key: 'warningAlerts', label: 'Warning Alerts' },
              { key: 'browserNotifications', label: 'Browser Notifications' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between p-3 bg-industrial-800 rounded border border-industrial-700">
                <span className="text-xs text-industrial-400">{label}</span>
                <input
                  type="checkbox"
                  checked={local.notifications[key]}
                  onChange={(e) => updateNotification(key, e.target.checked)}
                  className="accent-status-info w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
