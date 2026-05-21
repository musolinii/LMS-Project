import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import './ManageCourses.css';

export default function ManageCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { courses: data } = await courseService.getCourses({ instructor_id: user.id });
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error('Deletion failed:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="manage-courses-page">
        <div className="manage-courses-page__header">
          <h2>Manage Courses</h2>
          <Link to="/instructor/courses/create">
            <Button>New Course</Button>
          </Link>
        </div>

        {loading ? (
          <Loader size="large" />
        ) : courses.length === 0 ? (
          <div className="instructor-dashboard__empty">
            <p>You have not created any courses yet.</p>
          </div>
        ) : (
          <div className="manage-courses-page__list">
            {courses.map((course) => (
              <div key={course.id} className="manage-courses-page__row">
                <div className="manage-courses-page__detail">
                  <h4>{course.title}</h4>
                  <span>Category: {course.category} | Price: ${course.price}</span>
                </div>
                <div className="manage-courses-page__status">
                  <span className={`badge badge--${course.status}`}>{course.status}</span>
                </div>
                <div className="manage-courses-page__actions">
                  <Link to={`/instructor/courses/${course.id}/edit`}>
                    <Button variant="secondary" size="small">Edit</Button>
                  </Link>
                  <Button variant="danger" size="small" onClick={() => handleDelete(course.id)}>
                    Delete
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
