import { BellOff } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import AlertCard from '../alerts/AlertCard';
import EmptyState from '../common/EmptyState';

export default function ActiveAlerts({ limit }) {
  const { activeAlerts, acknowledgeAlert } = useMonitoring();
  const displayAlerts = limit ? activeAlerts.slice(0, limit) : activeAlerts;

  return (
    <div className="card-industrial p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-industrial-300">Active Alerts</h3>
        {activeAlerts.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 bg-status-critical/10 text-status-critical rounded border border-status-critical/20">
            {activeAlerts.length} active
          </span>
        )}
      </div>

      {displayAlerts.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No active alerts"
          description="All monitored motors are operating normally."
        />
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {displayAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
          ))}
        </div>
      )}
    </div>
  );
}
