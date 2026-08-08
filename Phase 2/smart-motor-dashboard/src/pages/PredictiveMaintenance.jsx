import { useMemo } from 'react';
import { Brain, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import { getMotorPredictions } from '../services/mockPredictionService';
import PageHeader from '../components/layout/PageHeader';
import StatusBadge from '../components/common/StatusBadge';

export default function PredictiveMaintenance() {
  const { prediction, sensorData } = useMonitoring();
  const staticPredictions = getMotorPredictions();

  const livePrediction = useMemo(() => ({
    motorId: 'MTR-001',
    name: 'Main Production Motor',
    risk: prediction.risk,
    predictedFault: prediction.predictedFault,
    priority: prediction.priority,
    recommendation: prediction.recommendation,
    severity: prediction.severity,
  }), [prediction]);

  const allPredictions = [livePrediction, ...staticPredictions.slice(1)];

  return (
    <div>
      <PageHeader
        title="Predictive Maintenance"
        subtitle="AI-driven failure prediction and maintenance scheduling"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="card-industrial p-4 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto text-status-critical mb-2" />
          <p className="text-[10px] text-industrial-500">High Risk Motors</p>
          <p className="text-2xl font-bold text-status-critical">
            {allPredictions.filter((p) => p.risk >= 70).length}
          </p>
        </div>
        <div className="card-industrial p-4 text-center">
          <Brain className="w-5 h-5 mx-auto text-status-warning mb-2" />
          <p className="text-[10px] text-industrial-500">Medium Risk</p>
          <p className="text-2xl font-bold text-status-warning">
            {allPredictions.filter((p) => p.risk >= 30 && p.risk < 70).length}
          </p>
        </div>
        <div className="card-industrial p-4 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto text-status-normal mb-2" />
          <p className="text-[10px] text-industrial-500">Low Risk</p>
          <p className="text-2xl font-bold text-status-normal">
            {allPredictions.filter((p) => p.risk < 30).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPredictions.map((p) => {
          const isHigh = p.risk >= 70;
          const isMed = p.risk >= 30 && p.risk < 70;
          const borderColor = isHigh ? 'border-status-critical/30' : isMed ? 'border-status-warning/30' : 'border-status-normal/30';

          return (
            <div key={p.motorId} className={`card-industrial p-5 border ${borderColor}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-industrial-300">{p.motorId}</p>
                  <p className="text-[10px] text-industrial-500">{p.name}</p>
                </div>
                <StatusBadge status={p.priority?.toLowerCase() || p.severity} size="lg" />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-industrial-500">Risk Level</span>
                  <span className={`text-sm font-bold tabular-nums ${isHigh ? 'text-status-critical' : isMed ? 'text-status-warning' : 'text-status-normal'}`}>
                    {p.risk}%
                  </span>
                </div>
                <div className="h-2 bg-industrial-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-status-critical' : isMed ? 'bg-status-warning' : 'bg-status-normal'
                    }`}
                    style={{ width: `${p.risk}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-industrial-500">Predicted Issue</span>
                  <span className="text-industrial-300 font-medium">{p.predictedFault}</span>
                </div>
                <div className="p-2.5 bg-industrial-800/50 rounded border border-industrial-700">
                  <p className="text-[10px] text-industrial-500">Recommended Action</p>
                  <p className="text-xs text-industrial-300 mt-0.5">{p.recommendation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-industrial-500 mt-4 text-center">
        Live prediction for MTR-001 updates based on current sensor data (Health: {sensorData.health}%)
      </p>
    </div>
  );
}
