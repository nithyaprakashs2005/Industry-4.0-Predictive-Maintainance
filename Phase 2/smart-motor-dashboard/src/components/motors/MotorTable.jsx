import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

export default function MotorTable({ motors }) {
  const navigate = useNavigate();

  return (
    <div className="card-industrial overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-industrial-800/50 text-industrial-500 border-b border-industrial-700">
              <th className="text-left px-4 py-3 font-medium">Motor ID</th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">RPM</th>
              <th className="text-left px-4 py-3 font-medium">Temperature</th>
              <th className="text-left px-4 py-3 font-medium">Vibration</th>
              <th className="text-left px-4 py-3 font-medium">Health</th>
              <th className="text-left px-4 py-3 font-medium">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {motors.map((motor) => (
              <tr
                key={motor.id}
                onClick={() => navigate(`/live-monitoring?motor=${motor.id}`)}
                className="border-b border-industrial-800 hover:bg-industrial-800/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-industrial-300">{motor.id}</td>
                <td className="px-4 py-3 text-industrial-400">{motor.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={motor.status === 'healthy' ? 'normal' : motor.status} />
                </td>
                <td className="px-4 py-3 tabular-nums text-industrial-300">{motor.rpm}</td>
                <td className="px-4 py-3 tabular-nums text-industrial-300">{motor.temperature}°C</td>
                <td className="px-4 py-3 tabular-nums text-industrial-300">{motor.vibration} mm/s</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold tabular-nums ${
                    motor.health >= 75 ? 'text-status-normal' : motor.health >= 50 ? 'text-status-warning' : 'text-status-critical'
                  }`}>
                    {motor.health}%
                  </span>
                </td>
                <td className="px-4 py-3 text-industrial-500 text-[10px]">
                  {new Date(motor.lastUpdate).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
