import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import './AuthForm.css';

export default function RegisterForm({ onSuccess }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const nameErr = validateRequired(fullName, 'Full name');
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (nameErr || emailErr || passErr) {
      setErrors({ fullName: nameErr, email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register({ email, password, fullName, role });
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {formError && <div className="auth-form__alert auth-form__alert--danger">{formError}</div>}

      <Input
        label="Full Name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        placeholder="John Doe"
        required
      />

      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="you@example.com"
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="•••••••• (min 6 characters)"
        required
      />

      <div className="auth-form__role-select">
        <span className="auth-form__role-label">Choose your Role</span>
        <div className="auth-form__role-options">
          <button
            type="button"
            className={`auth-form__role-button ${role === 'student' ? 'auth-form__role-button--active' : ''}`}
            onClick={() => setRole('student')}
          >
            <span className="auth-form__role-icon">🧑‍🎓</span>
            <span>Student</span>
          </button>
          <button
            type="button"
            className={`auth-form__role-button ${role === 'instructor' ? 'auth-form__role-button--active' : ''}`}
            onClick={() => setRole('instructor')}
          >
            <span className="auth-form__role-icon">👨‍🏫</span>
            <span>Instructor</span>
          </button>
        </div>
      </div>

      <Button type="submit" loading={loading} className="auth-form__submit">
        Create Account
      </Button>
    </form>
  );
}
