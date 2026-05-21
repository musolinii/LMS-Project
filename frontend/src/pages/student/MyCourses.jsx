import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { enrollmentService } from '../../services/enrollmentService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CourseCard from '../../components/courses/CourseCard';
import Loader from '../../components/common/Loader';

export default function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await enrollmentService.getEnrollmentsByStudent(user.id);
        setEnrollments(data);
      } catch (err) {
        console.error('Failed to fetch enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="my-courses-page">
        <h2 style={{ marginBottom: '1.5rem' }}>My Enrolled Courses</h2>
        
        {loading ? (
          <Loader size="large" />
        ) : enrollments.length === 0 ? (
          <div className="student-dashboard__no-courses">
            <p>You have not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="student-dashboard__courses-grid">
            {enrollments.map((e) => (
              <CourseCard key={e.id} course={e.courses} enrolled progress={40} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
