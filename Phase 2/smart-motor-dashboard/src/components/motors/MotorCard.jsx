import { useNavigate } from 'react-router-dom';
import { Gauge, Thermometer, Vibrate } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import HealthGauge from '../dashboard/HealthGauge';

export default function MotorCard({ motor }) {
  const navigate = useNavigate();

  const statusDot = {
    healthy: 'bg-status-normal',
    warning: 'bg-status-warning',
    critical: 'bg-status-critical',
  }[motor.status] || 'bg-industrial-500';

  return (
    <button
      onClick={() => navigate(`/live-monitoring?motor=${motor.id}`)}
      className="card-industrial p-4 text-left hover:border-status-info/30 transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusDot}`} />
            <span className="text-xs font-semibold text-industrial-300">{motor.id}</span>
          </div>
          <p className="text-[10px] text-industrial-500 mt-0.5">{motor.name}</p>
        </div>
        <HealthGauge health={motor.health} size="sm" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-1.5 bg-industrial-800 rounded">
          <Gauge className="w-3 h-3 mx-auto text-status-info mb-0.5" />
          <p className="text-[10px] text-industrial-500">RPM</p>
          <p className="text-xs font-medium tabular-nums">{motor.rpm}</p>
        </div>
        <div className="text-center p-1.5 bg-industrial-800 rounded">
          <Thermometer className="w-3 h-3 mx-auto text-status-warning mb-0.5" />
          <p className="text-[10px] text-industrial-500">Temp</p>
          <p className="text-xs font-medium tabular-nums">{motor.temperature}°C</p>
        </div>
        <div className="text-center p-1.5 bg-industrial-800 rounded">
          <Vibrate className="w-3 h-3 mx-auto text-status-critical mb-0.5" />
          <p className="text-[10px] text-industrial-500">Vib</p>
          <p className="text-xs font-medium tabular-nums">{motor.vibration}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge status={motor.status === 'healthy' ? 'normal' : motor.status} />
        <span className="text-[10px] text-status-info opacity-0 group-hover:opacity-100 transition-opacity">
          View Details →
        </span>
      </div>
    </button>
  );
}
