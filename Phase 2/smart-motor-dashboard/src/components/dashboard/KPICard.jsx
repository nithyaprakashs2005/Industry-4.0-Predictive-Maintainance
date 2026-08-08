import { Gauge, Thermometer, Wrench, Vibrate, HeartPulse, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import StatusBadge from '../common/StatusBadge';

const iconMap = {
  rpm: Gauge,
  temperature: Thermometer,
  torque: Wrench,
  vibration: Vibrate,
  health: HeartPulse,
};

export default function KPICard({ title, value, unit, status, trend, dataKey, history, icon }) {
  const Icon = icon || iconMap[dataKey] || Gauge;
  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = dataKey === 'health'
    ? (isPositive ? 'text-status-normal' : 'text-status-critical')
    : (isPositive ? 'text-status-warning' : 'text-status-info');

  const sparkData = history?.slice(-20).map((h, i) => ({ i, v: h[dataKey] })) || [];

  const statusMap = {
    healthy: 'normal',
    excellent: 'excellent',
    stable: 'stable',
    warning: 'warning',
    critical: 'critical',
  };

  return (
    <div className="card-industrial p-4 hover:border-industrial-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-industrial-800 border border-industrial-700 flex items-center justify-center">
            <Icon className="w-4 h-4 text-status-info" />
          </div>
          <span className="text-xs text-industrial-500">{title}</span>
        </div>
        <StatusBadge status={statusMap[status] || status} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-industrial-200 tabular-nums">{value}</span>
            {unit && <span className="text-xs text-industrial-500">{unit}</span>}
          </div>
          <div className={`flex items-center gap-1 mt-1 text-[10px] ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{isPositive ? '+' : ''}{trend}%</span>
          </div>
        </div>
        {sparkData.length > 1 && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
