import Button from '../common/Button';
import './QuizResults.css';

export default function QuizResults({ result, onRetake, onBackToCourse }) {
  const { score, total_points, passed, percentage, message } = result;

  return (
    <div className="quiz-results">
      <div className="quiz-results__graphic">
        {passed ? (
          <span className="quiz-results__emoji quiz-results__emoji--pass">🎉</span>
        ) : (
          <span className="quiz-results__emoji quiz-results__emoji--fail">👎</span>
        )}
      </div>

      <h2 className="quiz-results__title">
        {passed ? 'Quiz Passed!' : 'Quiz Failed'}
      </h2>
      <p className="quiz-results__message">{message}</p>

      <div className="quiz-results__score-box">
        <span className="quiz-results__score-label">Your Score</span>
        <span className={`quiz-results__score-value ${passed ? 'pass' : 'fail'}`}>
          {score} / {total_points}
        </span>
        <span className="quiz-results__score-percentage">
          {percentage}% (Pass Mark: {result.attempt?.quiz?.pass_percentage || 60}%)
        </span>
      </div>

      <div className="quiz-results__actions">
        {!passed && onRetake && (
          <Button onClick={onRetake} className="quiz-results__btn">
            Try Again
          </Button>
        )}
        <Button variant="secondary" onClick={onBackToCourse} className="quiz-results__btn">
          Back to Course
        </Button>
      </div>
    </div>
  );
}
