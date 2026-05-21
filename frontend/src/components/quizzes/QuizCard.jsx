import Card from '../common/Card';
import Button from '../common/Button';
import './QuizCard.css';

export default function QuizCard({ quiz, onStart, attempts = [] }) {
  const { title, description, time_limit_minutes, pass_percentage } = quiz;
  const bestAttempt = attempts.reduce(
    (best, current) => (current.score > (best?.score || 0) ? current : best),
    null
  );

  return (
    <Card className="quiz-card">
      <div className="quiz-card__header">
        <h4 className="quiz-card__title">{title}</h4>
        <span className="quiz-card__meta">⏱️ {time_limit_minutes ? `${time_limit_minutes}m` : 'No limit'}</span>
      </div>
      <p className="quiz-card__description">{description || 'No description provided.'}</p>
      
      <div className="quiz-card__stats">
        <div>Pass score: <strong>{pass_percentage}%</strong></div>
        {bestAttempt && (
          <div className="quiz-card__score">
            Best Attempt: <strong className={bestAttempt.passed ? 'text-success' : 'text-danger'}>
              {bestAttempt.score}/{bestAttempt.total_points} ({bestAttempt.passed ? 'Passed' : 'Failed'})
            </strong>
          </div>
        )}
      </div>

      <Button onClick={onStart} className="quiz-card__start-btn">
        {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}
      </Button>
    </Card>
  );
}
