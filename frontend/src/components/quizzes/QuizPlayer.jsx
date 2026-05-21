import { useState, useEffect } from 'react';
import Button from '../common/Button';
import './QuizPlayer.css';

export default function QuizPlayer({ quiz, questions, onSubmit, loading }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null
  );

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleQuizSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleTextAnswerChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleQuizSubmit = () => {
    // Format answers as expected by backend Function (Array of {question_id, answer})
    const formattedAnswers = questions.map((q) => ({
      question_id: q.id,
      answer: answers[q.id] || '',
    }));
    onSubmit(formattedAnswers);
  };

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="quiz-player">
      <div className="quiz-player__header">
        <h2 className="quiz-player__title">{quiz.title}</h2>
        {timeLeft !== null && (
          <div className={`quiz-player__timer ${timeLeft < 60 ? 'quiz-player__timer--urgent' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="quiz-player__progress">
        <div
          className="quiz-player__progress-bar"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
        <span className="quiz-player__progress-text">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <div className="quiz-player__body">
        <h3 className="quiz-player__question-text">{currentQuestion.question_text}</h3>

        <div className="quiz-player__answer-section">
          {currentQuestion.question_type === 'multiple_choice' ||
          currentQuestion.question_type === 'true_false' ? (
            <div className="quiz-player__options">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`quiz-player__option ${
                    answers[currentQuestion.id] === opt ? 'quiz-player__option--selected' : ''
                  }`}
                  onClick={() => handleSelectOption(currentQuestion.id, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="quiz-player__text-answer"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="quiz-player__footer">
        <Button
          variant="secondary"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((prev) => prev - 1)}
        >
          Previous
        </Button>

        {currentIdx < questions.length - 1 ? (
          <Button onClick={() => setCurrentIdx((prev) => prev + 1)}>
            Next
          </Button>
        ) : (
          <Button variant="primary" loading={loading} onClick={handleQuizSubmit}>
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
