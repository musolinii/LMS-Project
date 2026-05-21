import { useState, useCallback } from 'react';
import { quizService } from '../services/quizService';

export function useQuizzes(courseId) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizzes = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getQuizzesByCourse(courseId);
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const submitAttempt = async (quizId, answers) => {
    return quizService.submitQuizAttempt(quizId, answers);
  };

  return {
    quizzes,
    loading,
    error,
    refetch: fetchQuizzes,
    submitAttempt,
  };
}
