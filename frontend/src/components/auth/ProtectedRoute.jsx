import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader size="large" className="page-loader" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    // Redirect if role is not allowed
    const fallbackPath =
      profile?.role === 'admin'
        ? '/admin/dashboard'
        : profile?.role === 'instructor'
        ? '/instructor/dashboard'
        : '/student/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
