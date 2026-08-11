import { useState } from 'react';
import { FileText, Download, Printer, Eye } from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';

const REPORTS = [
  { id: 'performance', title: 'Motor Performance Report', description: 'RPM, temperature, torque and vibration analysis across all motors.' },
  { id: 'maintenance', title: 'Maintenance Summary', description: 'Scheduled and completed maintenance activities overview.' },
  { id: 'fault', title: 'Fault Summary', description: 'Fault frequency, severity distribution and resolution status.' },
  { id: 'health', title: 'Health Summary', description: 'Motor health scores, trends and degradation analysis.' },
];

function generateCSV(data, type) {
  let headers, rows;

  if (type === 'performance') {
    headers = ['Motor ID', 'RPM', 'Temperature', 'Torque', 'Vibration', 'Health'];
    rows = data.motors.map((m) => [m.id, m.rpm, m.temperature, '-', m.vibration, m.health]);
  } else if (type === 'fault') {
    headers = ['Date', 'Time', 'Motor ID', 'Fault', 'Parameter', 'Value', 'Severity', 'Status'];
    rows = data.faults.map((f) => [f.date, f.time, f.motorId, f.fault, f.parameter, f.value, f.severity, f.status]);
  } else if (type === 'health') {
    headers = ['Motor ID', 'Name', 'Health', 'Status'];
    rows = data.motors.map((m) => [m.id, m.name, m.health, m.status]);
  } else {
    headers = ['Motor ID', 'Operating Hours', 'Last Maintenance', 'Status'];
    rows = data.motors.map((m) => [m.id, m.operatingHours, '2026-07-01', m.status]);
  }

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportPreview({ type, motors, faultHistory, sensorData }) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (type === 'performance') {
    return (
      <div className="space-y-4 text-xs">
        <p className="text-industrial-500">Generated: {date}</p>
        <table className="w-full">
          <thead>
            <tr className="text-industrial-500 border-b border-industrial-700">
              <th className="text-left py-2">Motor</th>
              <th className="text-left py-2">RPM</th>
              <th className="text-left py-2">Temp</th>
              <th className="text-left py-2">Vibration</th>
              <th className="text-left py-2">Health</th>
            </tr>
          </thead>
          <tbody>
            {motors.map((m) => (
              <tr key={m.id} className="border-b border-industrial-800">
                <td className="py-2 text-industrial-300">{m.id}</td>
                <td className="py-2 tabular-nums">{m.id === 'MTR-001' ? sensorData.rpm : m.rpm}</td>
                <td className="py-2 tabular-nums">{m.id === 'MTR-001' ? sensorData.temperature : m.temperature}°C</td>
                <td className="py-2 tabular-nums">{m.vibration} mm/s</td>
                <td className="py-2">{m.health}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'fault') {
    return (
      <div className="space-y-4 text-xs max-h-96 overflow-y-auto">
        <p className="text-industrial-500">Generated: {date} — {faultHistory.length} total faults</p>
        {faultHistory.slice(0, 10).map((f) => (
          <div key={f.id} className="flex items-center justify-between p-2 bg-industrial-800/50 rounded border border-industrial-700">
            <div>
              <p className="text-industrial-300 font-medium">{f.fault}</p>
              <p className="text-industrial-500">{f.motorId} • {f.date} {f.time}</p>
            </div>
            <StatusBadge status={f.severity} size="sm" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'health') {
    return (
      <div className="space-y-3 text-xs">
        <p className="text-industrial-500">Generated: {date}</p>
        {motors.map((m) => (
          <div key={m.id} className="p-3 bg-industrial-800/50 rounded border border-industrial-700">
            <div className="flex justify-between mb-2">
              <span className="text-industrial-300 font-medium">{m.id} — {m.name}</span>
              <StatusBadge status={m.status === 'healthy' ? 'normal' : m.status} size="sm" />
            </div>
            <div className="h-2 bg-industrial-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${m.health >= 75 ? 'bg-status-normal' : m.health >= 50 ? 'bg-status-warning' : 'bg-status-critical'}`}
                style={{ width: `${m.health}%` }}
              />
            </div>
            <p className="text-industrial-500 mt-1">{m.health}% health • {m.operatingHours} operating hours</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs">
      <p className="text-industrial-500">Generated: {date}</p>
      {motors.map((m) => (
        <div key={m.id} className="flex justify-between p-3 bg-industrial-800/50 rounded border border-industrial-700">
          <div>
            <p className="text-industrial-300 font-medium">{m.id}</p>
            <p className="text-industrial-500">{m.operatingHours} hrs • Last maintenance: 2026-07-01</p>
          </div>
          <StatusBadge status={m.status === 'healthy' ? 'normal' : m.status} size="sm" />
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const { motors, faultHistory, sensorData } = useMonitoring();
  const [viewReport, setViewReport] = useState(null);

  const handleExport = (type) => {
    generateCSV({ motors, faults: faultHistory, sensor: sensorData }, type);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeReport = REPORTS.find((r) => r.id === viewReport);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and export motor monitoring reports" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((report) => (
          <div key={report.id} className="card-industrial p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-status-info/10 border border-status-info/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-status-info" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-industrial-300">{report.title}</h3>
                <p className="text-[10px] text-industrial-500 mt-1">{report.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewReport(report.id)}
                className="flex items-center gap-1.5 text-[10px] px-3 py-2 rounded bg-industrial-800 text-industrial-300 border border-industrial-700 hover:bg-industrial-700 transition-colors"
              >
                <Eye className="w-3 h-3" /> View Report
              </button>
              <button
                onClick={() => handleExport(report.id)}
                className="flex items-center gap-1.5 text-[10px] px-3 py-2 rounded bg-status-info/10 text-status-info border border-status-info/20 hover:bg-status-info/20 transition-colors"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-[10px] px-3 py-2 rounded bg-industrial-800 text-industrial-400 border border-industrial-700 hover:bg-industrial-700 transition-colors"
              >
                <Printer className="w-3 h-3" /> Print Report
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card-industrial p-5 mt-6">
        <h3 className="text-sm font-semibold text-industrial-300 mb-3">Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[10px] text-industrial-500">Total Motors</p>
            <p className="text-xl font-bold text-industrial-200">{motors.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-industrial-500">Total Faults</p>
            <p className="text-xl font-bold text-status-warning">{faultHistory.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-industrial-500">Active Faults</p>
            <p className="text-xl font-bold text-status-critical">
              {faultHistory.filter((f) => f.status === 'Active').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-industrial-500">Avg Health</p>
            <p className="text-xl font-bold text-status-normal">
              {Math.round(motors.reduce((a, m) => a + m.health, 0) / motors.length)}%
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!viewReport}
        onClose={() => setViewReport(null)}
        title={activeReport?.title ?? 'Report'}
        size="lg"
      >
        {viewReport && (
          <ReportPreview
            type={viewReport}
            motors={motors}
            faultHistory={faultHistory}
            sensorData={sensorData}
          />
        )}
      </Modal>
    </div>
  );
}
