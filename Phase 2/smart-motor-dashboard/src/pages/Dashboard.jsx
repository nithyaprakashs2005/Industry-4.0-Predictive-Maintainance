import { useMemo } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import PageHeader from '../components/layout/PageHeader';
import KPICard from '../components/dashboard/KPICard';
import MotorVisualization from '../components/dashboard/MotorVisualization';
import TrendChart from '../components/dashboard/TrendChart';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import FaultHistoryPreview from '../components/dashboard/FaultHistoryPreview';
import AIRecommendation from '../components/dashboard/AIRecommendation';
import MotorInfo from '../components/dashboard/MotorInfo';
import SimulationControls from '../components/dashboard/SimulationControls';

function calcTrend(history, key) {
  if (history.length < 2) return 0;
  const recent = history.slice(-10);
  const first = recent[0][key];
  const last = recent[recent.length - 1][key];
  if (first === 0) return 0;
  return parseFloat(((last - first) / first * 100).toFixed(1));
}

export default function Dashboard() {
  const { sensorData, history, scenario } = useMonitoring();

  const trends = useMemo(() => ({
    rpm: calcTrend(history, 'rpm'),
    temperature: calcTrend(history, 'temperature'),
    torque: calcTrend(history, 'torque'),
    vibration: calcTrend(history, 'vibration'),
    health: calcTrend(history, 'health'),
  }), [history]);

  const kpiStatus = (key) => {
    if (sensorData.status === 'critical') return 'critical';
    if (sensorData.status === 'warning') return 'warning';
    if (key === 'health') return sensorData.healthLabel?.toLowerCase() || 'normal';
    if (key === 'torque') return 'stable';
    return 'normal';
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time motor health monitoring and predictive maintenance overview"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KPICard title="Motor Speed" value={sensorData.rpm} unit="RPM" status={kpiStatus('rpm')} trend={trends.rpm} dataKey="rpm" history={history} />
        <KPICard title="Temperature" value={sensorData.temperature} unit="°C" status={kpiStatus('temperature')} trend={trends.temperature} dataKey="temperature" history={history} />
        <KPICard title="Torque" value={sensorData.torque} unit="Nm" status={kpiStatus('torque')} trend={trends.torque} dataKey="torque" history={history} />
        <KPICard title="Vibration" value={sensorData.vibration} unit="mm/s" status={kpiStatus('vibration')} trend={trends.vibration} dataKey="vibration" history={history} />
        <KPICard title="Motor Health" value={sensorData.health} unit="%" status={kpiStatus('health')} trend={trends.health} dataKey="health" history={history} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <MotorVisualization sensorData={sensorData} scenario={scenario} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TrendChart title="Temperature" data={history} dataKey="temperature" unit="°C" />
          <TrendChart title="RPM" data={history} dataKey="rpm" unit="RPM" />
          <TrendChart title="Vibration" data={history} dataKey="vibration" unit="mm/s" />
          <TrendChart title="Torque" data={history} dataKey="torque" unit="Nm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <ActiveAlerts limit={3} />
        <FaultHistoryPreview />
        <AIRecommendation />
        <MotorInfo />
      </div>

      <SimulationControls />
    </div>
  );
}
