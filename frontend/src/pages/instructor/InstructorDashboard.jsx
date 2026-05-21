import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import './InstructorDashboard.css';

export default function InstructorDashboard() {
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

  if (loading) return <Loader size="large" className="page-loader" />;

  const publishedCount = courses.filter((c) => c.status === 'published').length;
  const draftCount = courses.filter((c) => c.status === 'draft').length;

  return (
    <DashboardLayout>
      <div className="instructor-dashboard">
        <div className="instructor-dashboard__header">
          <div>
            <h2>Instructor Dashboard</h2>
            <p>Manage your courses, lectures, and track your content performance.</p>
          </div>
          <Link to="/instructor/courses/create">
            <Button>Create New Course</Button>
          </Link>
        </div>

        <div className="instructor-dashboard__stats">
          <StatsCard label="Total Courses" value={courses.length} icon="📚" />
          <StatsCard label="Published" value={publishedCount} icon="🟢" />
          <StatsCard label="Drafts" value={draftCount} icon="📝" />
        </div>

        <div className="instructor-dashboard__courses">
          <div className="instructor-dashboard__section-header">
            <h3>My Courses</h3>
            <Link to="/instructor/courses" className="instructor-dashboard__link">
              Manage All
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="instructor-dashboard__empty">
              <p>You have not created any courses yet.</p>
              <Link to="/instructor/courses/create">
                <Button variant="secondary" size="small">Create Your First Course</Button>
              </Link>
            </div>
          ) : (
            <div className="instructor-dashboard__list">
              {courses.map((course) => (
                <div key={course.id} className="instructor-dashboard__row">
                  <div className="instructor-dashboard__info">
                    <h4>{course.title}</h4>
                    <span className="instructor-dashboard__category">{course.category}</span>
                  </div>
                  <div className="instructor-dashboard__status-cell">
                    <span className={`badge badge--${course.status}`}>{course.status}</span>
                  </div>
                  <div className="instructor-dashboard__actions">
                    <Link to={`/instructor/courses/${course.id}/edit`}>
                      <Button variant="secondary" size="small">Edit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
