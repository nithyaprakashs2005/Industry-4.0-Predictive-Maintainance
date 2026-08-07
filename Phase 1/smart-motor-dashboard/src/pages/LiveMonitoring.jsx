import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMonitoring } from '../context/MonitoringContext';
import { getMotorById } from '../services/mockMotorService';
import { getHealthLabel } from '../services/mockSensorService';
import PageHeader from '../components/layout/PageHeader';
import MotorVisualization from '../components/dashboard/MotorVisualization';
import HealthGauge from '../components/dashboard/HealthGauge';
import TrendChart from '../components/dashboard/TrendChart';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import SimulationControls from '../components/dashboard/SimulationControls';
import { Gauge, Thermometer, Wrench, Vibrate } from 'lucide-react';
import { DEFAULT_MOTOR_ID } from '../data/motors';

export default function LiveMonitoring() {
  const [searchParams] = useSearchParams();
  const motorId = searchParams.get('motor') || DEFAULT_MOTOR_ID;
  const { sensorData, history, scenario, activeAlerts } = useMonitoring();

  const selectedMotor = useMemo(() => getMotorById(motorId), [motorId]);
  const isLiveMotor = motorId === DEFAULT_MOTOR_ID;

  const displayData = isLiveMotor
    ? sensorData
    : {
        motorId,
        rpm: selectedMotor?.rpm ?? 0,
        temperature: selectedMotor?.temperature ?? 0,
        torque: 15,
        vibration: selectedMotor?.vibration ?? 0,
        health: selectedMotor?.health ?? 0,
        healthLabel: getHealthLabel(selectedMotor?.health ?? 0),
        status: selectedMotor?.status ?? 'healthy',
      };

  const motorAlerts = activeAlerts.filter((a) => a.motorId === motorId || isLiveMotor);
  const chartHistory = isLiveMotor ? history : [];

  const metrics = [
    { label: 'RPM', value: displayData.rpm, unit: 'RPM', icon: Gauge, color: 'text-status-info' },
    { label: 'Temperature', value: displayData.temperature, unit: '°C', icon: Thermometer, color: 'text-status-warning' },
    { label: 'Torque', value: displayData.torque, unit: 'Nm', icon: Wrench, color: 'text-status-normal' },
    { label: 'Vibration', value: displayData.vibration, unit: 'mm/s', icon: Vibrate, color: 'text-status-critical' },
  ];

  return (
    <div>
      <PageHeader
        title="Live Monitoring"
        subtitle={`Control room interface — ${motorId} ${selectedMotor?.name ?? ''}`}
      />

      {!isLiveMotor && (
        <div className="mb-4 px-3 py-2 rounded border border-status-info/20 bg-status-info/5 text-xs text-status-info">
          Viewing static snapshot for {motorId}. Switch to MTR-001 for live simulated sensor data.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2">
          <MotorVisualization
            sensorData={displayData}
            scenario={isLiveMotor ? scenario : 'normal'}
            motorId={motorId}
            motorName={selectedMotor?.name ?? 'Unknown Motor'}
          />
        </div>
        <div className="card-industrial p-6 flex flex-col items-center justify-center">
          <HealthGauge health={displayData.health} label={displayData.healthLabel} size="lg" />
          <p className="text-xs text-industrial-500 mt-4">Motor Health Score</p>
          <div className="grid grid-cols-2 gap-3 mt-6 w-full">
            {metrics.map(({ label, value, unit, icon: Icon, color }) => (
              <div key={label} className="p-3 bg-industrial-800 rounded border border-industrial-700 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
                <p className="text-[10px] text-industrial-500">{label}</p>
                <p className="text-lg font-bold tabular-nums text-industrial-200">{value}</p>
                <p className="text-[10px] text-industrial-500">{unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLiveMotor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          <TrendChart title="Temperature" data={chartHistory} dataKey="temperature" unit="°C" />
          <TrendChart title="RPM" data={chartHistory} dataKey="rpm" unit="RPM" />
          <TrendChart title="Vibration" data={chartHistory} dataKey="vibration" unit="mm/s" />
          <TrendChart title="Torque" data={chartHistory} dataKey="torque" unit="Nm" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLiveMotor ? (
          <>
            <ActiveAlerts />
            <SimulationControls />
          </>
        ) : (
          <div className="card-industrial p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-industrial-300 mb-3">Motor Alerts</h3>
            {motorAlerts.length === 0 ? (
              <p className="text-xs text-industrial-500">No active alerts for this motor.</p>
            ) : (
              <p className="text-xs text-industrial-400">{motorAlerts.length} alert(s) — view on MTR-001 live feed.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
