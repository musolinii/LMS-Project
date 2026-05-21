import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { CATEGORIES } from '../../utils/constants';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('beginner');
  const [price, setPrice] = useState('0.00');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await courseService.getCourseById(courseId);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setDifficulty(course.difficulty);
        setPrice(course.price.toString());
        setStatus(course.status);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await courseService.updateCourse(courseId, {
        title,
        description,
        category,
        difficulty,
        price: parseFloat(price),
        status,
      });
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Failed to update course:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader size="large" className="page-loader" />;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Edit Course</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Course Description"
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="course-filters__select"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="course-filters__select"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="course-filters__select"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <Button type="submit" loading={updating} style={{ width: '100%' }}>
            Save Changes
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
