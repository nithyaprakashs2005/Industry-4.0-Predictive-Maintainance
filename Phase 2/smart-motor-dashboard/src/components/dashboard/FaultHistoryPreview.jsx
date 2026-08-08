import { useNavigate } from 'react-router-dom';
import { useMonitoring } from '../../context/MonitoringContext';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { History } from 'lucide-react';

export default function FaultHistoryPreview({ limit = 4 }) {
  const { faultHistory } = useMonitoring();
  const navigate = useNavigate();
  const items = faultHistory.slice(0, limit);

  return (
    <div className="card-industrial p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-industrial-300">Fault History</h3>
        <button
          onClick={() => navigate('/fault-history')}
          className="text-[10px] px-2 py-1 rounded bg-status-info/10 text-status-info border border-status-info/20 hover:bg-status-info/20 transition-colors"
        >
          View All
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={History} title="No fault history" description="No faults recorded yet." />
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-industrial-500 border-b border-industrial-700">
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-left py-2 font-medium">Fault</th>
                <th className="text-left py-2 font-medium">Motor</th>
                <th className="text-left py-2 font-medium">Severity</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((fault) => (
                <tr key={fault.id} className="border-b border-industrial-800 hover:bg-industrial-800/30">
                  <td className="py-2 text-industrial-400">
                    {new Date(fault.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                  </td>
                  <td className="py-2 text-industrial-300">{fault.fault}</td>
                  <td className="py-2 text-industrial-400">{fault.motorId}</td>
                  <td className="py-2"><StatusBadge status={fault.severity} size="sm" /></td>
                  <td className="py-2"><StatusBadge status={fault.status.toLowerCase()} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
