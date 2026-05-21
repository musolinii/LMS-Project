import Card from '../common/Card';
import './StatsCard.css';

export default function StatsCard({ label, value, icon, trend, trendType = 'up' }) {
  return (
    <Card className="stats-card">
      <div className="stats-card__header">
        <span className="stats-card__label">{label}</span>
        <span className="stats-card__icon">{icon}</span>
      </div>
      <div className="stats-card__body">
        <h3 className="stats-card__value">{value}</h3>
        {trend && (
          <span className={`stats-card__trend stats-card__trend--${trendType}`}>
            {trendType === 'up' ? '↗' : '↘'} {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
