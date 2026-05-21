import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { enrollmentService } from '../../services/enrollmentService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import ProgressChart from '../../components/dashboard/ProgressChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import CourseCard from '../../components/courses/CourseCard';
import Loader from '../../components/common/Loader';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await enrollmentService.getEnrollmentsByStudent(user.id);
        setEnrollments(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <Loader size="large" className="page-loader" />;
  }

  const completedCourses = enrollments.filter((e) => e.status === 'completed');
  const activeCourses = enrollments.filter((e) => e.status === 'active');
  
  // Hardcoded mock activities for aesthetics
  const activities = [
    { id: 1, text: 'Enrolled in Introduction to React', timestamp: new Date(Date.now() - 3600000).toISOString(), icon: '📖' },
    { id: 2, text: 'Passed Quiz: React Basics with 90%', timestamp: new Date(Date.now() - 86400000).toISOString(), icon: '🏆' },
    { id: 3, text: 'Completed lesson "What is React?"', timestamp: new Date(Date.now() - 172800000).toISOString(), icon: '✅' },
  ];

  return (
    <DashboardLayout>
      <div className="student-dashboard">
        <div className="student-dashboard__welcome">
          <h2>Welcome back, {profile?.full_name || 'Student'}! 👋</h2>
          <p>Here is what is happening with your courses today.</p>
        </div>

        <div className="student-dashboard__stats">
          <StatsCard label="Enrolled Courses" value={enrollments.length} icon="📚" />
          <StatsCard label="Active Courses" value={activeCourses.length} icon="⏳" />
          <StatsCard label="Completed Courses" value={completedCourses.length} icon="🏆" />
        </div>

        <div className="student-dashboard__grid">
          <div className="student-dashboard__courses-section">
            <h3>My Active Courses</h3>
            {activeCourses.length === 0 ? (
              <div className="student-dashboard__no-courses">
                <p>You are not currently enrolled in any active courses.</p>
              </div>
            ) : (
              <div className="student-dashboard__courses-grid">
                {activeCourses.map((enrollment) => (
                  <CourseCard
                    key={enrollment.id}
                    course={enrollment.courses}
                    enrolled
                    progress={50} // Placeholder progress for mockup
                  />
                ))}
              </div>
            )}
          </div>

          <div className="student-dashboard__activity-section">
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
