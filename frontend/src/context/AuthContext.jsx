import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const userProfile = await authService.getProfile(currentUser.id);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          try {
            const userProfile = await authService.getProfile(session.user.id);
            setProfile(userProfile);
          } catch (err) {
            console.error('Profile fetch error:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.signIn({ email, password });
    setUser(data.user);
    const userProfile = await authService.getProfile(data.user.id);
    setProfile(userProfile);
    return data;
  };

  const register = async ({ email, password, fullName, role }) => {
    const data = await authService.signUp({ email, password, fullName, role });
    return data;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const isRole = (role) => profile?.role === role;
  const isAdmin = () => isRole('admin');
  const isInstructor = () => isRole('instructor');
  const isStudent = () => isRole('student');

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    isRole,
    isAdmin,
    isInstructor,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
