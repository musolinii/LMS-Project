import './ProgressChart.css';

export default function ProgressChart({ value = 0, size = 120, strokeWidth = 8, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="progress-chart" style={{ width: size, height: size }}>
      <svg className="progress-chart__svg" width={size} height={size}>
        <circle
          className="progress-chart__bg"
          stroke="var(--color-border)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-chart__bar"
          stroke="var(--color-primary)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="progress-chart__content">
        <span className="progress-chart__value">{Math.round(value)}%</span>
        {label && <span className="progress-chart__label">{label}</span>}
      </div>
    </div>
  );
}
