import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          users: usersRes.count || 0,
          courses: coursesRes.count || 0,
          enrollments: enrollmentsRes.count || 0,
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <Loader size="large" className="page-loader" />;

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <div className="admin-dashboard__header">
          <h2>Admin Control Center</h2>
          <p>Global oversight of profiles, courses catalog, and registration metrics.</p>
        </div>

        <div className="admin-dashboard__stats">
          <StatsCard label="Total Users" value={stats.users} icon="👥" />
          <StatsCard label="Total Courses" value={stats.courses} icon="📚" />
          <StatsCard label="Total Enrollments" value={stats.enrollments} icon="🎓" />
        </div>

        <div className="admin-dashboard__grid">
          <div className="admin-dashboard__card">
            <h3>Quick Actions</h3>
            <div className="admin-dashboard__actions-list">
              <Link to="/admin/users" className="admin-dashboard__action-btn">
                <span>👥</span> Manage Platform Users
              </Link>
              <Link to="/admin/courses" className="admin-dashboard__action-btn">
                <span>📚</span> Audit Platform Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
