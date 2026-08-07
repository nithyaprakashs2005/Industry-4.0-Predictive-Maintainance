export const DEFAULT_SETTINGS = {
  thresholds: {
    temperature: 80,
    rpm: 1600,
    vibration: 0.08,
    torque: 25,
  },
  simulation: {
    speed: 1,
    autoFault: false,
    updateInterval: 1000,
  },
  notifications: {
    criticalAlerts: true,
    warningAlerts: true,
    browserNotifications: false,
  },
};

export function loadSettings() {
  try {
    const stored = localStorage.getItem('smart-motor-settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    /* use defaults */
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings) {
  localStorage.setItem('smart-motor-settings', JSON.stringify(settings));
}
