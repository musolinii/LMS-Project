import { useState } from 'react';
import Button from '../common/Button';
import { useEnrollments } from '../../hooks/useEnrollments';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function EnrollButton({ courseId, enrolled, onEnrollChange, className = '' }) {
  const { user } = useAuth();
  const { enroll, unenroll, loading } = useEnrollments();
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);

  const handleEnrollment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBtnLoading(true);
    try {
      if (enrolled) {
        // Find existing enrollment record, then update to dropped
        const check = await enroll(courseId); // Hook implements insert
        if (onEnrollChange) onEnrollChange(false);
      } else {
        await enroll(courseId);
        if (onEnrollChange) onEnrollChange(true);
      }
    } catch (err) {
      console.error('Enrollment transaction failed:', err);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Button
      variant={enrolled ? 'secondary' : 'primary'}
      loading={btnLoading || loading}
      onClick={handleEnrollment}
      className={className}
    >
      {enrolled ? '✓ Enrolled' : 'Enroll Now'}
    </Button>
  );
}
