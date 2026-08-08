import { Brain, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import StatusBadge from '../common/StatusBadge';

export default function AIRecommendation() {
  const { prediction } = useMonitoring();
  const isHighRisk = prediction.risk >= 50;
  const Icon = isHighRisk ? ShieldAlert : ShieldCheck;

  return (
    <div className="card-industrial p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-status-info" />
        <h3 className="text-sm font-semibold text-industrial-300">AI Prediction</h3>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isHighRisk ? 'bg-status-critical/10 border border-status-critical/30' : 'bg-status-normal/10 border border-status-normal/30'
          }`}>
            <Icon className={`w-5 h-5 ${isHighRisk ? 'text-status-critical' : 'text-status-normal'}`} />
          </div>
          <div>
            <p className="text-xs text-industrial-500">Predicted Issue</p>
            <p className="text-sm font-semibold text-industrial-200">{prediction.predictedFault}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 bg-industrial-800 rounded border border-industrial-700">
            <p className="text-[10px] text-industrial-500">Risk Level</p>
            <p className={`text-lg font-bold tabular-nums ${isHighRisk ? 'text-status-critical' : 'text-status-normal'}`}>
              {prediction.risk}%
            </p>
          </div>
          <div className="p-2.5 bg-industrial-800 rounded border border-industrial-700">
            <p className="text-[10px] text-industrial-500">Priority</p>
            <div className="mt-1">
              <StatusBadge status={prediction.priority?.toLowerCase() || prediction.severity} size="lg" />
            </div>
          </div>
        </div>

        <div className="mt-auto p-3 bg-industrial-800/50 rounded border border-industrial-700">
          <p className="text-[10px] text-industrial-500 mb-1">Recommendation</p>
          <p className="text-xs text-industrial-300 leading-relaxed">{prediction.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
