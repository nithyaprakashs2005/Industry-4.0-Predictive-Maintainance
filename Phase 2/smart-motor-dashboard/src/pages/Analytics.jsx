import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useMonitoring } from '../context/MonitoringContext';
import PageHeader from '../components/layout/PageHeader';
import { MOTORS } from '../data/motors';

function generateAnalyticsHistory(days = 30) {
  const data = [];
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: 60 + Math.random() * 15 + (i < 5 ? 10 : 0),
      rpm: 1400 + Math.random() * 100,
      vibration: 0.02 + Math.random() * 0.04,
      torque: 12 + Math.random() * 8,
      health: 85 + Math.random() * 12,
      faults: Math.floor(Math.random() * 3),
    });
  }
  return data;
}

const FAULT_FREQ = [
  { name: 'Bearing', count: 12 },
  { name: 'Temperature', count: 8 },
  { name: 'Vibration', count: 15 },
  { name: 'Overspeed', count: 4 },
  { name: 'Torque', count: 6 },
];

export default function Analytics() {
  const { sensorData } = useMonitoring();
  const [dateRange, setDateRange] = useState('30');
  const [motor, setMotor] = useState('MTR-001');
  const [parameter, setParameter] = useState('temperature');

  const analyticsData = useMemo(() => generateAnalyticsHistory(parseInt(dateRange)), [dateRange]);

  const stats = useMemo(() => {
    const temps = analyticsData.map((d) => d.temperature);
    const rpms = analyticsData.map((d) => d.rpm);
    const vibs = analyticsData.map((d) => d.vibration);
    const healths = analyticsData.map((d) => d.health);
    return {
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      avgRpm: Math.round(rpms.reduce((a, b) => a + b, 0) / rpms.length),
      maxVib: Math.max(...vibs).toFixed(3),
      totalFaults: analyticsData.reduce((a, d) => a + d.faults, 0),
      avgHealth: Math.round(healths.reduce((a, b) => a + b, 0) / healths.length),
    };
  }, [analyticsData]);

  const paramConfig = {
    temperature: { label: 'Temperature', unit: '°C', color: '#f59e0b' },
    rpm: { label: 'RPM', unit: 'RPM', color: '#3b82f6' },
    vibration: { label: 'Vibration', unit: 'mm/s', color: '#ef4444' },
    torque: { label: 'Torque', unit: 'Nm', color: '#22c55e' },
    health: { label: 'Health', unit: '%', color: '#a855f7' },
  };

  const cfg = paramConfig[parameter];

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Historical performance analysis and trend insights" />

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-industrial">
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <select value={motor} onChange={(e) => setMotor(e.target.value)} className="input-industrial">
          {MOTORS.map((m) => <option key={m.id} value={m.id}>{m.id} — {m.name}</option>)}
        </select>
        <select value={parameter} onChange={(e) => setParameter(e.target.value)} className="input-industrial">
          {Object.entries(paramConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Avg Temperature', value: `${stats.avgTemp}°C` },
          { label: 'Max Temperature', value: `${stats.maxTemp}°C` },
          { label: 'Avg RPM', value: stats.avgRpm },
          { label: 'Max Vibration', value: `${stats.maxVib} mm/s` },
          { label: 'Total Faults', value: stats.totalFaults },
          { label: 'Avg Health', value: `${stats.avgHealth}%` },
        ].map(({ label, value }) => (
          <div key={label} className="card-industrial p-3 text-center">
            <p className="text-[10px] text-industrial-500">{label}</p>
            <p className="text-lg font-bold text-industrial-200 tabular-nums mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <div className="card-industrial p-4">
          <h3 className="text-xs font-medium text-industrial-400 mb-3">{cfg.label} Trend — {motor}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey={parameter} stroke={cfg.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-industrial p-4">
          <h3 className="text-xs font-medium text-industrial-400 mb-3">Fault Frequency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAULT_FREQ}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-industrial p-4">
        <h3 className="text-xs font-medium text-industrial-400 mb-3">Motor Performance Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="rpm" stroke="#2563eb" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="health" stroke="#a855f7" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-industrial-500 mt-2">
          Current live reading: {sensorData[parameter] ?? sensorData.temperature} — updating in real-time on dashboard
        </p>
      </div>
    </div>
  );
}
