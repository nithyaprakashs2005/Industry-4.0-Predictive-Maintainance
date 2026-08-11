import { FAULT_SCENARIOS } from '../data/faults';

export function getPrediction(sensorData, scenario) {
  const { health, temperature, vibration } = sensorData;
  const faultScenario = FAULT_SCENARIOS[scenario] || FAULT_SCENARIOS.normal;

  if (scenario === 'bearing_failure') {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(85, 95)),
      predictedFault: 'Bearing Failure',
      severity: 'high',
      priority: 'HIGH',
      recommendation: 'Inspect motor bearing within 24 hours. Schedule immediate maintenance.',
    };
  }

  if (scenario === 'overheating') {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(65, 80)),
      predictedFault: 'Thermal Overload',
      severity: 'medium',
      priority: 'HIGH',
      recommendation: 'Check cooling system and reduce load. Inspect thermal insulation.',
    };
  }

  if (scenario === 'excessive_vibration') {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(70, 88)),
      predictedFault: 'Mechanical Imbalance',
      severity: 'high',
      priority: 'HIGH',
      recommendation: 'Perform vibration analysis. Check alignment and balance.',
    };
  }

  if (scenario === 'overspeed') {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(75, 90)),
      predictedFault: 'Speed Control Failure',
      severity: 'high',
      priority: 'HIGH',
      recommendation: 'Inspect VFD and speed controller. Reduce motor speed immediately.',
    };
  }

  if (scenario === 'high_torque') {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(55, 72)),
      predictedFault: 'Overload Condition',
      severity: 'medium',
      priority: 'MEDIUM',
      recommendation: 'Reduce mechanical load. Inspect drive coupling and gearbox.',
    };
  }

  if (health >= 90) {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(5, 12)),
      predictedFault: 'None',
      severity: 'low',
      priority: 'LOW',
      recommendation: 'Continue normal operation. Next scheduled maintenance in 30 days.',
    };
  }

  if (health >= 75) {
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(20, 35)),
      predictedFault: 'Minor Wear Detected',
      severity: 'low',
      priority: 'LOW',
      recommendation: 'Monitor closely. Schedule preventive inspection within 2 weeks.',
    };
  }

  if (health >= 50) {
    const fault = temperature > 80 ? 'Temperature Anomaly' : vibration > 0.06 ? 'Vibration Increase' : 'Performance Degradation';
    return {
      motorId: 'MTR-001',
      risk: Math.round(randomRange(40, 65)),
      predictedFault: fault,
      severity: 'medium',
      priority: 'MEDIUM',
      recommendation: `Address ${fault.toLowerCase()}. Schedule maintenance within 48 hours.`,
    };
  }

  return {
    motorId: 'MTR-001',
    risk: Math.round(randomRange(80, 95)),
    predictedFault: faultScenario.alertType || 'Critical Failure Imminent',
    severity: 'high',
    priority: 'HIGH',
    recommendation: 'Immediate shutdown recommended. Contact maintenance team urgently.',
  };
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export function getMotorPredictions() {
  return [
    {
      motorId: 'MTR-001',
      name: 'Main Production Motor',
      risk: 92,
      predictedFault: 'Bearing Failure',
      priority: 'HIGH',
      recommendation: 'Inspect bearing',
      severity: 'high',
    },
    {
      motorId: 'MTR-002',
      name: 'Production Line B',
      risk: 37,
      predictedFault: 'Temperature anomaly',
      priority: 'MEDIUM',
      recommendation: 'Monitor cooling system',
      severity: 'medium',
    },
    {
      motorId: 'MTR-003',
      name: 'Conveyor Motor',
      risk: 8,
      predictedFault: 'None',
      priority: 'LOW',
      recommendation: 'Continue normal operation',
      severity: 'low',
    },
    {
      motorId: 'MTR-004',
      name: 'Cooling Pump',
      risk: 78,
      predictedFault: 'Bearing degradation',
      priority: 'HIGH',
      recommendation: 'Replace bearing assembly',
      severity: 'high',
    },
  ];
}
