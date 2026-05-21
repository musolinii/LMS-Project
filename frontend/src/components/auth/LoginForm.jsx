import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateEmail, validatePassword } from '../../utils/validators';
import './AuthForm.css';

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login({ email, password });
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {formError && <div className="auth-form__alert auth-form__alert--danger">{formError}</div>}
      
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
        placeholder="••••••••"
        required
      />

      <Button type="submit" loading={loading} className="auth-form__submit">
        Sign In
      </Button>
    </form>
  );
}
