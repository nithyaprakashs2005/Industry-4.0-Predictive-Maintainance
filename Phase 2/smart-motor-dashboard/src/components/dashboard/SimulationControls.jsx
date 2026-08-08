import { FlaskConical, Play, Pause, RotateCcw } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';

export default function SimulationControls({ compact = false }) {
  const { scenario, changeScenario, faultScenarios, isDemoMode, toggleDemoMode, resetDemo } = useMonitoring();

  const scenarios = Object.values(faultScenarios);

  return (
    <div className={`card-industrial ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-status-warning" />
          <h3 className="text-sm font-semibold text-industrial-300">Simulation Controls</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              isDemoMode
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isDemoMode ? <Pause className="w-3.5 h-3.5 fill-emerald-600" /> : <Play className="w-3.5 h-3.5 fill-slate-600" />}
            <span>Demo: {isDemoMode ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={resetDemo}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
            title="Reset motor condition and sensors to healthy baseline"
          >
            <RotateCcw className="w-3 h-3 text-slate-600" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-industrial-500 mb-3">
        {isDemoMode
          ? 'Select a fault scenario to simulate abnormal motor conditions.'
          : 'Demo simulation is currently OFF. Turn ON Demo mode to start live functions.'}
      </p>

      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'} gap-2`}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            disabled={!isDemoMode}
            onClick={() => changeScenario(s.id)}
            className={`text-[10px] px-3 py-2 rounded border transition-all ${
              !isDemoMode
                ? 'bg-industrial-800/50 border-industrial-700 text-industrial-500 opacity-50 cursor-not-allowed'
                : scenario === s.id
                ? s.status === 'critical'
                  ? 'bg-status-critical/10 border-status-critical/40 text-status-critical font-medium'
                  : s.status === 'warning'
                  ? 'bg-status-warning/10 border-status-warning/40 text-status-warning font-medium'
                  : 'bg-status-normal/10 border-status-normal/40 text-status-normal font-medium'
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
