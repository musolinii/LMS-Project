import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService';

export function useCourses(filters = {}) {
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { courses: data, total: count } = await courseService.getCourses(filters);
      setCourses(data);
      setTotal(count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (courseData) => {
    const newCourse = await courseService.createCourse(courseData);
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = async (courseId, updates) => {
    const updated = await courseService.updateCourse(courseId, updates);
    setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    return updated;
  };

  const deleteCourse = async (courseId) => {
    await courseService.deleteCourse(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  return {
    courses,
    total,
    loading,
    error,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
