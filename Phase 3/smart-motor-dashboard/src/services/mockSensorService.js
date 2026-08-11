import { FAULT_SCENARIOS } from '../data/faults';

const HISTORY_LENGTH = 60;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(current, target, rate = 0.15) {
  return current + (target - current) * rate;
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function getHealthLabel(health) {
  if (health >= 90) return 'Excellent';
  if (health >= 75) return 'Good';
  if (health >= 50) return 'Warning';
  return 'Critical';
}

function getHealthStatus(health) {
  if (health >= 75) return 'healthy';
  if (health >= 50) return 'warning';
  return 'critical';
}

function computeHealth(rpm, temperature, torque, vibration, scenario) {
  const base = (scenario.healthRange.min + scenario.healthRange.max) / 2;
  const rpmDev = Math.abs(rpm - 1450) / 500;
  const tempDev = Math.max(0, temperature - 70) / 30;
  const vibDev = Math.max(0, vibration - 0.04) / 0.16;
  const torqueDev = Math.max(0, torque - 20) / 15;
  const penalty = (rpmDev + tempDev + vibDev + torqueDev) * 15;
  return clamp(Math.round(base - penalty + (Math.random() - 0.5) * 3), 0, 100);
}

class MockSensorService {
  constructor() {
    this.scenario = 'normal';
    this.targets = { rpm: 1450, temperature: 65, torque: 15, vibration: 0.025 };
    this.current = { rpm: 1450, temperature: 65, torque: 15, vibration: 0.025 };
    this.history = [];
    this.listeners = new Set();
    this.intervalId = null;
    this.updateInterval = 1000;
    this.speedMultiplier = 1;
  }

  setScenario(scenarioId) {
    this.scenario = scenarioId;
  }

  reset() {
    this.scenario = 'normal';
    this.targets = { rpm: 0, temperature: 0, torque: 0, vibration: 0 };
    this.current = { rpm: 0, temperature: 0, torque: 0, vibration: 0 };
    this.history = [];
    return this.getCurrent();
  }

  setUpdateInterval(ms) {
    this.updateInterval = ms;
    if (this.intervalId) {
      this.stop();
      this.start();
    }
  }

  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
  }

  getScenario() {
    return FAULT_SCENARIOS[this.scenario] || FAULT_SCENARIOS.normal;
  }

  updateTargets() {
    const scenario = this.getScenario();
    this.targets = {
      rpm: randomInRange(scenario.rpm.min, scenario.rpm.max),
      temperature: randomInRange(scenario.temperature.min, scenario.temperature.max),
      torque: randomInRange(scenario.torque.min, scenario.torque.max),
      vibration: randomInRange(scenario.vibration.min, scenario.vibration.max),
    };
  }

  tick() {
    this.updateTargets();
    const rate = this.scenario === 'bearing_failure' ? 0.08 : 0.12;

    this.current = {
      rpm: Math.round(smoothStep(this.current.rpm, this.targets.rpm, rate)),
      temperature: parseFloat(smoothStep(this.current.temperature, this.targets.temperature, rate).toFixed(1)),
      torque: parseFloat(smoothStep(this.current.torque, this.targets.torque, rate).toFixed(1)),
      vibration: parseFloat(smoothStep(this.current.vibration, this.targets.vibration, rate).toFixed(3)),
    };

    const scenario = this.getScenario();
    const health = computeHealth(
      this.current.rpm,
      this.current.temperature,
      this.current.torque,
      this.current.vibration,
      scenario
    );

    const reading = {
      motorId: 'MTR-001',
      timestamp: new Date().toISOString(),
      rpm: this.current.rpm,
      temperature: this.current.temperature,
      torque: this.current.torque,
      vibration: this.current.vibration,
      health,
      healthLabel: getHealthLabel(health),
      status: getHealthStatus(health),
      scenario: this.scenario,
    };

    this.history.push(reading);
    if (this.history.length > HISTORY_LENGTH) {
      this.history.shift();
    }

    this.listeners.forEach((fn) => fn(reading, [...this.history]));
    return reading;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  start() {
    if (this.intervalId) return;
    this.tick();
    const ms = this.updateInterval / this.speedMultiplier;
    this.intervalId = setInterval(() => this.tick(), ms);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getHistory() {
    return [...this.history];
  }

  getCurrent() {
    const scenario = this.getScenario();
    const health = computeHealth(
      this.current.rpm,
      this.current.temperature,
      this.current.torque,
      this.current.vibration,
      scenario
    );
    return {
      motorId: 'MTR-001',
      timestamp: new Date().toISOString(),
      rpm: this.current.rpm,
      temperature: this.current.temperature,
      torque: this.current.torque,
      vibration: this.current.vibration,
      health,
      healthLabel: getHealthLabel(health),
      status: getHealthStatus(health),
      scenario: this.scenario,
    };
  }
}

export const mockSensorService = new MockSensorService();
export { getHealthLabel, getHealthStatus, computeHealth, FAULT_SCENARIOS };
