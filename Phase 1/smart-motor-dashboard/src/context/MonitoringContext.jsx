import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { mockSensorService, FAULT_SCENARIOS } from '../services/mockSensorService';
import { getPrediction } from '../services/mockPredictionService';
import { getMotors } from '../services/mockMotorService';
import { INITIAL_FAULT_HISTORY } from '../data/faults';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../services/settingsService';

const MonitoringContext = createContext(null);

let alertIdCounter = 100;

export function MonitoringProvider({ children }) {
  const [sensorData, setSensorData] = useState(() => mockSensorService.getCurrent());
  const [history, setHistory] = useState([]);
  const [scenario, setScenario] = useState('normal');
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [faultHistory, setFaultHistory] = useState(INITIAL_FAULT_HISTORY);
  const [prediction, setPrediction] = useState(() => getPrediction(mockSensorService.getCurrent(), 'normal'));
  const [motors] = useState(getMotors);
  const [settings, setSettings] = useState(loadSettings);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const lastAlertScenario = useRef(null);
  const faultIdCounter = useRef(INITIAL_FAULT_HISTORY.length + 1);

  const changeScenario = useCallback((newScenario) => {
    setScenario(newScenario);
    mockSensorService.setScenario(newScenario);
    lastAlertScenario.current = null;
  }, []);

  useEffect(() => {
    mockSensorService.setUpdateInterval(settings.simulation.updateInterval);
    mockSensorService.setSpeedMultiplier(settings.simulation.speed);
    mockSensorService.setScenario(scenario);

    const unsubscribe = mockSensorService.subscribe((reading, hist) => {
      setSensorData(reading);
      setHistory(hist);
      setPrediction(getPrediction(reading, scenario));
    });

    mockSensorService.start();
    return () => {
      unsubscribe();
      mockSensorService.stop();
    };
  }, [scenario, settings.simulation.updateInterval, settings.simulation.speed]);

  useEffect(() => {
    if (!settings.simulation.autoFault) return;

    const faultIds = Object.keys(FAULT_SCENARIOS).filter((id) => id !== 'normal');
    const intervalMs = Math.max(settings.simulation.updateInterval * 15, 15000);

    const timer = setInterval(() => {
      const randomFault = faultIds[Math.floor(Math.random() * faultIds.length)];
      changeScenario(randomFault);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.simulation.autoFault, settings.simulation.updateInterval, changeScenario]);

  useEffect(() => {
    const faultScenario = FAULT_SCENARIOS[scenario];
    if (!faultScenario || scenario === 'normal') {
      lastAlertScenario.current = null;
      return;
    }

    if (lastAlertScenario.current === scenario) return;
    lastAlertScenario.current = scenario;

    const currentData = mockSensorService.getCurrent();
    const now = new Date();
    const alert = {
      id: ++alertIdCounter,
      motorId: 'MTR-001',
      type: faultScenario.alertType || faultScenario.label,
      severity: faultScenario.alertSeverity || 'warning',
      value: getAlertValue(faultScenario, currentData),
      timestamp: now.toISOString(),
      acknowledged: false,
    };

    setAlerts((prev) => [alert, ...prev]);

    const notification = {
      id: alert.id,
      title: `${faultScenario.alertSeverity === 'critical' ? '🔴 Critical Alert' : '🟡 Warning Alert'}`,
      message: `${faultScenario.alertType || faultScenario.label} detected in MTR-001.`,
      severity: faultScenario.alertSeverity,
      timestamp: now.toISOString(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);

    const faultEntry = {
      id: faultIdCounter.current++,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false }),
      motorId: 'MTR-001',
      fault: faultScenario.alertType || faultScenario.label,
      parameter: getFaultParameter(scenario),
      value: getAlertValue(faultScenario, currentData),
      severity: faultScenario.alertSeverity || 'warning',
      status: 'Active',
      action: 'Pending inspection',
    };
    setFaultHistory((prev) => [faultEntry, ...prev]);

    if (settings.notifications.browserNotifications && 'Notification' in window) {
      const shouldNotify =
        (faultScenario.alertSeverity === 'critical' && settings.notifications.criticalAlerts) ||
        (faultScenario.alertSeverity === 'warning' && settings.notifications.warningAlerts);

      if (shouldNotify) {
        if (Notification.permission === 'granted') {
          new Notification(notification.title, { body: notification.message });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
    }
  }, [scenario, settings.notifications.browserNotifications, settings.notifications.criticalAlerts, settings.notifications.warningAlerts]);

  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <MonitoringContext.Provider
      value={{
        sensorData,
        history,
        scenario,
        changeScenario,
        alerts,
        activeAlerts,
        acknowledgeAlert,
        notifications,
        unreadNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        faultHistory,
        prediction,
        motors,
        settings,
        updateSettings,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        faultScenarios: FAULT_SCENARIOS,
        defaultSettings: DEFAULT_SETTINGS,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const ctx = useContext(MonitoringContext);
  if (!ctx) throw new Error('useMonitoring must be used within MonitoringProvider');
  return ctx;
}

function getAlertValue(scenario, data) {
  if (scenario.id === 'overheating' || scenario.id === 'bearing_failure') {
    return `${data.temperature}°C`;
  }
  if (scenario.id === 'excessive_vibration' || scenario.id === 'bearing_failure') {
    return `${data.vibration} mm/s`;
  }
  if (scenario.id === 'overspeed') {
    return `${data.rpm} RPM`;
  }
  if (scenario.id === 'high_torque') {
    return `${data.torque} Nm`;
  }
  return `${data.temperature}°C`;
}

function getFaultParameter(scenarioId) {
  const map = {
    overheating: 'Temperature',
    excessive_vibration: 'Vibration',
    overspeed: 'RPM',
    high_torque: 'Torque',
    bearing_failure: 'Vibration',
  };
  return map[scenarioId] || 'General';
}
