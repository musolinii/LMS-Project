import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LessonPlayer from '../../components/courses/LessonPlayer';
import Loader from '../../components/common/Loader';
import './CourseView.css';

export default function CourseView() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const isEnrolled = await enrollmentService.checkEnrollment(user.id, courseId);
        if (!isEnrolled) {
          navigate(`/student/courses`);
          return;
        }

        const courseData = await courseService.getCourseById(courseId);
        const lessonsData = await courseService.getLessonsByCourse(courseId);
        const progressData = await enrollmentService.getCourseProgress(user.id, courseId);
        
        setCourse(courseData);
        setLessons(lessonsData);
        setProgress(progressData);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, user, navigate]);

  const handleLessonComplete = async (lessonId) => {
    try {
      const isCompleted = progress.some((p) => p.lesson_id === lessonId && p.completed);
      const updated = await enrollmentService.updateProgress(user.id, lessonId, courseId, {
        completed: !isCompleted,
        completed_at: !isCompleted ? new Date().toISOString() : null,
      });

      setProgress((prev) => {
        const filtered = prev.filter((p) => p.lesson_id !== lessonId);
        return [...filtered, updated];
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  if (loading) return <Loader size="large" className="page-loader" />;
  if (!course) return <div>Course not found</div>;

  const currentLesson = lessons[currentLessonIdx];

  return (
    <DashboardLayout>
      <div className="course-view">
        <div className="course-view__sidebar">
          <div className="course-view__sidebar-header">
            <h3>{course.title}</h3>
            <span>{lessons.length} Lessons</span>
          </div>
          <div className="course-view__lessons-list">
            {lessons.map((lesson, idx) => {
              const isCompleted = progress.some((p) => p.lesson_id === lesson.id && p.completed);
              return (
                <button
                  key={lesson.id}
                  className={`course-view__lesson-btn ${
                    currentLessonIdx === idx ? 'course-view__lesson-btn--active' : ''
                  }`}
                  onClick={() => setCurrentLessonIdx(idx)}
                >
                  <span className="course-view__lesson-status">
                    {isCompleted ? '✅' : '📄'}
                  </span>
                  <div className="course-view__lesson-info">
                    <span className="course-view__lesson-title">{lesson.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="course-view__content">
          {currentLesson ? (
            <LessonPlayer
              lesson={currentLesson}
              onComplete={() => handleLessonComplete(currentLesson.id)}
              isCompleted={progress.some((p) => p.lesson_id === currentLesson.id && p.completed)}
            />
          ) : (
            <div className="course-view__empty">
              <p>No lessons available for this course.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
