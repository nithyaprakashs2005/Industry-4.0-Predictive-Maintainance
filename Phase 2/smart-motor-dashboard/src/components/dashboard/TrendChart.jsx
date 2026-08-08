import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = {
  temperature: '#f59e0b',
  rpm: '#3b82f6',
  vibration: '#ef4444',
  torque: '#22c55e',
  health: '#a855f7',
};

export default function TrendChart({ title, data, dataKey, unit, color }) {
  const chartColor = color || COLORS[dataKey] || '#3b82f6';
  const latest = data.length > 0 ? data[data.length - 1][dataKey] : '--';

  const formatted = data.map((d) => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }),
  }));

  return (
    <div className="card-industrial p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-industrial-400">{title}</h3>
        <span className="text-xs font-semibold tabular-nums" style={{ color: chartColor }}>
          {latest}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: '#64748b' }}
              interval="preserveStartEnd"
              tickCount={4}
            />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} width={40} />
            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [`${value}${unit ? ` ${unit}` : ''}`, title]}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
