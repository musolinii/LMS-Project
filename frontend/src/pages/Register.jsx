import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/common/Card';
import './AuthPages.css';

export default function Register() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <Card className="auth-page__card">
        <div className="auth-page__header">
          <Link to="/" className="auth-page__logo">🎓</Link>
          <h2>Create Account</h2>
          <p>Get started with Musolinii LMS today</p>
        </div>

        <RegisterForm onSuccess={handleSuccess} />

        <div className="auth-page__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </Card>
    </div>
  );
}
