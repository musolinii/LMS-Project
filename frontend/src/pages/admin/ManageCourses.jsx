import { useEffect, useState } from 'react';
import { courseService } from '../../services/courseService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import './ManageCourses.css'; // Reuses styles from instructor/ManageCourses

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const { courses: data } = await courseService.getCourses({ status: null }); // get all statuses
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, []);

  const handleToggleStatus = async (courseId, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await courseService.updateCourse(courseId, { status: nextStatus });
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, status: nextStatus } : c))
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="manage-courses-page">
        <h2>Global Course Audits</h2>

        {loading ? (
          <Loader size="large" />
        ) : (
          <div className="manage-courses-page__list">
            {courses.map((course) => (
              <div key={course.id} className="manage-courses-page__row">
                <div className="manage-courses-page__detail">
                  <h4>{course.title}</h4>
                  <span>Instructor Reference: {course.instructor_id}</span>
                </div>
                <div className="manage-courses-page__status">
                  <span className={`badge badge--${course.status}`}>{course.status}</span>
                </div>
                <div className="manage-courses-page__actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleToggleStatus(course.id, course.status)}
                  >
                    {course.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
