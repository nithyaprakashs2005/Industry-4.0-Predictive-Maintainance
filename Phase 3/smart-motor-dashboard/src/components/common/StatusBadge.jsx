export default function StatusBadge({ status, size = 'sm' }) {
  const config = {
    healthy: { label: 'Normal', color: 'text-status-normal bg-status-normal/10 border-status-normal/30' },
    normal: { label: 'Normal', color: 'text-status-normal bg-status-normal/10 border-status-normal/30' },
    excellent: { label: 'Excellent', color: 'text-status-normal bg-status-normal/10 border-status-normal/30' },
    good: { label: 'Good', color: 'text-status-info bg-status-info/10 border-status-info/30' },
    stable: { label: 'Stable', color: 'text-status-info bg-status-info/10 border-status-info/30' },
    warning: { label: 'Warning', color: 'text-status-warning bg-status-warning/10 border-status-warning/30' },
    critical: { label: 'Critical', color: 'text-status-critical bg-status-critical/10 border-status-critical/30' },
    running: { label: 'Running', color: 'text-status-normal bg-status-normal/10 border-status-normal/30' },
    resolved: { label: 'Resolved', color: 'text-status-normal bg-status-normal/10 border-status-normal/30' },
    active: { label: 'Active', color: 'text-status-critical bg-status-critical/10 border-status-critical/30' },
    low: { label: 'LOW', color: 'text-status-normal bg-status-normal/10 border-status-normal/30' },
    medium: { label: 'MEDIUM', color: 'text-status-warning bg-status-warning/10 border-status-warning/30' },
    high: { label: 'HIGH', color: 'text-status-critical bg-status-critical/10 border-status-critical/30' },
  };

  const key = (status || 'normal').toLowerCase();
  const { label, color } = config[key] || config.normal;
  const sizeClass = size === 'lg' ? 'text-xs px-2.5 py-1' : 'text-[10px] px-1.5 py-0.5';

  return (
    <span className={`inline-flex items-center font-medium border rounded ${sizeClass} ${color}`}>
      {label}
    </span>
  );
}
