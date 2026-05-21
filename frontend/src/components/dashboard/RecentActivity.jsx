import { formatRelativeTime } from '../../utils/formatDate';
import './RecentActivity.css';

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="recent-activity">
      <h4 className="recent-activity__title">Recent Activity</h4>
      
      {activities.length === 0 ? (
        <p className="recent-activity__empty">No recent activity found.</p>
      ) : (
        <ul className="recent-activity__list">
          {activities.map((act) => (
            <li key={act.id} className="recent-activity__item">
              <span className="recent-activity__icon">{act.icon || '🔔'}</span>
              <div className="recent-activity__details">
                <p className="recent-activity__text">{act.text}</p>
                <span className="recent-activity__time">{formatRelativeTime(act.timestamp)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
