import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
}

function SeverityIcon({ severity }) {
  if (severity === 'critical') return <AlertCircle className="w-4 h-4 text-status-critical" />;
  if (severity === 'warning') return <AlertTriangle className="w-4 h-4 text-status-warning" />;
  return <CheckCircle className="w-4 h-4 text-status-normal" />;
}

export default function AlertCard({ alert, onAcknowledge }) {
  return (
    <div className="p-3 bg-industrial-800/50 border border-industrial-700 rounded animate-slide-in">
      <div className="flex items-start gap-2">
        <SeverityIcon severity={alert.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-industrial-200 uppercase tracking-wide">
              {alert.type}
            </p>
            <StatusBadge status={alert.severity} size="sm" />
          </div>
          <p className="text-[10px] text-industrial-500 mt-0.5">Motor {alert.motorId}</p>
          <p className="text-xs text-industrial-400 mt-1">{alert.value}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-industrial-500">{timeAgo(alert.timestamp)}</span>
            {onAcknowledge && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="text-[10px] px-2 py-1 rounded bg-industrial-700 hover:bg-industrial-600 text-industrial-300 transition-colors"
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
