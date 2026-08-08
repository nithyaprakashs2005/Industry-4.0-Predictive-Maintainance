export default function HealthGauge({ health, label, size = 'md' }) {
  const radius = size === 'lg' ? 70 : size === 'sm' ? 28 : 50;
  const stroke = size === 'lg' ? 10 : size === 'sm' ? 5 : 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (health / 100) * circumference;

  const getColor = (h) => {
    if (h >= 90) return '#22c55e';
    if (h >= 75) return '#3b82f6';
    if (h >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor(health);
  const svgSize = (radius + stroke) * 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-industrial-200 tabular-nums ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-xs' : 'text-xl'}`}>
            {Math.round(health)}%
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs mt-2 font-medium" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}
