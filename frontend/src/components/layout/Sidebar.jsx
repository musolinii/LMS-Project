import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/components/Sidebar.module.css';

export default function Sidebar() {
  const { profile } = useAuth();
  const role = profile?.role;

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Overview', icon: '📊' },
          { to: '/admin/users', label: 'Users', icon: '👥' },
          { to: '/admin/courses', label: 'Courses', icon: '📚' },
        ];
      case 'instructor':
        return [
          { to: '/instructor/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/instructor/courses', label: 'My Courses', icon: '📚' },
          { to: '/instructor/courses/create', label: 'New Course', icon: '➕' },
        ];
      case 'student':
      default:
        return [
          { to: '/student/dashboard', label: 'My Dashboard', icon: '🏠' },
          { to: '/student/courses', label: 'Enrolled Courses', icon: '📖' },
        ];
    }
  };

  const links = getLinks();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebar__nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${styles.sidebar__link} ${isActive ? styles['sidebar__link--active'] : ''}`
            }
          >
            <span className={styles.sidebar__icon}>{link.icon}</span>
            <span className={styles.sidebar__label}>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
