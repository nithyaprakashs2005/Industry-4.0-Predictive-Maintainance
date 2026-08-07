import { FlaskConical } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';

export default function SimulationControls({ compact = false }) {
  const { scenario, changeScenario, faultScenarios } = useMonitoring();

  const scenarios = Object.values(faultScenarios);

  return (
    <div className={`card-industrial ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical className="w-4 h-4 text-status-warning" />
        <h3 className="text-sm font-semibold text-industrial-300">Simulation Controls</h3>
      </div>
      <p className="text-[10px] text-industrial-500 mb-3">
        Select a fault scenario to simulate abnormal motor conditions.
      </p>
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'} gap-2`}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => changeScenario(s.id)}
            className={`text-[10px] px-3 py-2 rounded border transition-all ${
              scenario === s.id
                ? s.status === 'critical'
                  ? 'bg-status-critical/10 border-status-critical/40 text-status-critical'
                  : s.status === 'warning'
                  ? 'bg-status-warning/10 border-status-warning/40 text-status-warning'
                  : 'bg-status-normal/10 border-status-normal/40 text-status-normal'
                : 'bg-industrial-800 border-industrial-700 text-industrial-400 hover:border-industrial-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
