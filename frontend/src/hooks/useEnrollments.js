import { useState, useEffect, useCallback } from 'react';
import { enrollmentService } from '../services/enrollmentService';
import { useAuth } from './useAuth';

export function useEnrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await enrollmentService.getEnrollmentsByStudent(user.id);
      setEnrollments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enroll = async (courseId) => {
    const enrollment = await enrollmentService.enrollStudent(courseId);
    setEnrollments((prev) => [enrollment, ...prev]);
    return enrollment;
  };

  const unenroll = async (enrollmentId) => {
    await enrollmentService.unenrollStudent(enrollmentId);
    setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
  };

  const checkEnrollment = async (courseId) => {
    if (!user) return null;
    return enrollmentService.checkEnrollment(user.id, courseId);
  };

  return {
    enrollments,
    loading,
    error,
    refetch: fetchEnrollments,
    enroll,
    unenroll,
    checkEnrollment,
  };
}
