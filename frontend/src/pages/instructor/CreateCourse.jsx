import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { CATEGORIES, COURSE_DIFFICULTY } from '../../utils/constants';

export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('beginner');
  const [price, setPrice] = useState('0.00');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await courseService.createCourse({
        instructor_id: user.id,
        title,
        description,
        category,
        difficulty,
        price: parseFloat(price),
        status: 'draft',
      });
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Failed to create course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Create New Course</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Course Title"
            placeholder="e.g. Complete Web Developer Roadmap"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Course Description"
            type="textarea"
            placeholder="Describe what students will learn in this course..."
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

          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            Create Course
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
