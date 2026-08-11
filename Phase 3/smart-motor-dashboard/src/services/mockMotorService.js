import { MOTORS } from '../data/motors';

const MOTOR_HEALTH = {
  'MTR-001': { health: 96, status: 'healthy', rpm: 1450, temperature: 68.5, vibration: 0.025 },
  'MTR-002': { health: 78, status: 'warning', rpm: 1420, temperature: 76.2, vibration: 0.055 },
  'MTR-003': { health: 91, status: 'healthy', rpm: 1180, temperature: 62.1, vibration: 0.018 },
  'MTR-004': { health: 42, status: 'critical', rpm: 1750, temperature: 88.4, vibration: 0.142 },
};

export function getMotors() {
  return MOTORS.map((motor) => ({
    ...motor,
    ...MOTOR_HEALTH[motor.id],
    lastUpdate: new Date().toISOString(),
  }));
}

export function getMotorById(id) {
  const motor = MOTORS.find((m) => m.id === id);
  if (!motor) return null;
  return {
    ...motor,
    ...MOTOR_HEALTH[id],
    lastUpdate: new Date().toISOString(),
  };
}

export function getMotorStatusLabel(status) {
  const labels = { healthy: 'Healthy', warning: 'Warning', critical: 'Critical' };
  return labels[status] || 'Unknown';
}
