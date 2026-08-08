import { Cpu, Calendar, Clock, Factory } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import StatusBadge from '../common/StatusBadge';

export default function MotorInfo() {
  const { sensorData } = useMonitoring();

  const info = [
    { label: 'Motor ID', value: 'MTR-001', icon: Cpu },
    { label: 'Motor Name', value: 'Main Production Motor', icon: Factory },
    { label: 'Manufacturer', value: 'Industrial Motor' },
    { label: 'Model', value: 'IM-001' },
    { label: 'Rated RPM', value: '1500 RPM' },
    { label: 'Operating Hours', value: '4,280 hrs', icon: Clock },
    { label: 'Installation Date', value: '12 Aug 2025', icon: Calendar },
  ];

  return (
    <div className="card-industrial p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-industrial-300 mb-3">Motor Information</h3>
      <div className="space-y-2 flex-1">
        {info.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-industrial-800 last:border-0">
            <span className="text-[10px] text-industrial-500 flex items-center gap-1.5">
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </span>
            <span className="text-xs text-industrial-300 font-medium">{value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-[10px] text-industrial-500">Current Status</span>
          <StatusBadge status={sensorData.status === 'healthy' ? 'running' : sensorData.status} size="lg" />
        </div>
      </div>
    </div>
  );
}
