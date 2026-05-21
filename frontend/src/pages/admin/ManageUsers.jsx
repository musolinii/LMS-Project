import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import './ManageUsers.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="manage-users-page">
        <h2>Manage Users</h2>

        {loading ? (
          <Loader size="large" />
        ) : (
          <div className="manage-users-page__table-container">
            <table className="manage-users-page__table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>ID / Reference</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.full_name || 'No Name'}</strong></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{u.id}</td>
                    <td>
                      <span className={`badge badge--role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="manage-users-page__select"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
