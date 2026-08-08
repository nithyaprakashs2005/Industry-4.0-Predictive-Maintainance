import { useMonitoring } from '../context/MonitoringContext';
import PageHeader from '../components/layout/PageHeader';
import MotorCard from '../components/motors/MotorCard';
import MotorTable from '../components/motors/MotorTable';

export default function Motors() {
  const { motors } = useMonitoring();

  const healthy = motors.filter((m) => m.status === 'healthy').length;
  const warning = motors.filter((m) => m.status === 'warning').length;
  const critical = motors.filter((m) => m.status === 'critical').length;

  return (
    <div>
      <PageHeader
        title="Motors"
        subtitle="Overview of all monitored industrial motors"
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-industrial p-3 text-center">
          <p className="text-[10px] text-industrial-500">Healthy</p>
          <p className="text-xl font-bold text-status-normal">{healthy}</p>
        </div>
        <div className="card-industrial p-3 text-center">
          <p className="text-[10px] text-industrial-500">Warning</p>
          <p className="text-xl font-bold text-status-warning">{warning}</p>
        </div>
        <div className="card-industrial p-3 text-center">
          <p className="text-[10px] text-industrial-500">Critical</p>
          <p className="text-xl font-bold text-status-critical">{critical}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {motors.map((motor) => (
          <MotorCard key={motor.id} motor={motor} />
        ))}
      </div>

      <MotorTable motors={motors} />
    </div>
  );
}
