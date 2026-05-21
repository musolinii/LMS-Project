import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { formatDuration } from '../../utils/formatDate';
import styles from '../../styles/components/CourseCard.module.css';

export default function CourseCard({ course, enrolled = false, progress = 0 }) {
  const { id, title, description, thumbnail_url, difficulty, price, profiles } = course;

  return (
    <Card hover className={styles.courseCard}>
      <div className={styles.courseCard__thumbnail}>
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} />
        ) : (
          <div className={styles.courseCard__placeholder}>
            <span>📚</span>
          </div>
        )}
        <span className={`${styles.courseCard__tag} ${styles[`courseCard__tag--${difficulty}`]}`}>
          {difficulty}
        </span>
      </div>

      <div className={styles.courseCard__body}>
        <h4 className={styles.courseCard__title}>{title}</h4>
        <p className={styles.courseCard__description}>{description}</p>

        <div className={styles.courseCard__instructor}>
          <Avatar name={profiles?.full_name} src={profiles?.avatar_url} size="small" />
          <span className={styles.courseCard__instructorName}>{profiles?.full_name || 'Instructor'}</span>
        </div>

        {enrolled ? (
          <div className={styles.courseCard__progressSection}>
            <div className={styles.courseCard__progressBar}>
              <div
                className={styles.courseCard__progressValue}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.courseCard__progressText}>{Math.round(progress)}% Completed</span>
          </div>
        ) : (
          <div className={styles.courseCard__footer}>
            <span className={styles.courseCard__price}>
              {price === 0 ? 'Free' : `$${price}`}
            </span>
            <Link to={`/student/courses/${id}`} className={styles.courseCard__link}>
              View Details
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
