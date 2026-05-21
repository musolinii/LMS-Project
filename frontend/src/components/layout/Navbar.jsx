import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import styles from '../../styles/components/Navbar.module.css';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__container}>
        <Link to="/" className={styles.navbar__brand}>
          <span className={styles.navbar__logo}>🎓</span>
          <span className={styles.navbar__title}>Musolinii LMS</span>
        </Link>

        <nav className={styles.navbar__nav}>
          {user ? (
            <div className={styles.navbar__userSection}>
              <Link
                to={
                  profile?.role === 'admin'
                    ? '/admin/dashboard'
                    : profile?.role === 'instructor'
                    ? '/instructor/dashboard'
                    : '/student/dashboard'
                }
                className={styles.navbar__dashboardLink}
              >
                Dashboard
              </Link>
              <div className={styles.navbar__userMenu}>
                <Avatar name={profile?.full_name || user.email} src={profile?.avatar_url} size="small" />
                <span className={styles.navbar__userName}>{profile?.full_name || 'User'}</span>
              </div>
              <Button variant="secondary" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className={styles.navbar__authSection}>
              <Link to="/login" className={styles.navbar__loginLink}>
                Sign In
              </Link>
              <Link to="/register">
                <Button size="small">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
