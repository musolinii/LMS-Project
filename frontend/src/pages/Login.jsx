import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/common/Card';
import './AuthPages.css';

export default function Login() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="auth-page">
      <Card className="auth-page__card">
        <div className="auth-page__header">
          <Link to="/" className="auth-page__logo">🎓</Link>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>
        
        <LoginForm onSuccess={handleSuccess} />

        <div className="auth-page__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </Card>
    </div>
  );
}
