import { useState } from 'react';
import CourseCard from './CourseCard';
import Input from '../common/Input';
import { CATEGORIES } from '../../utils/constants';
import './CourseList.css';

export default function CourseList({ courses, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? course.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="course-list-container">
      <div className="course-filters">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="course-filters__search"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="course-filters__select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="course-filters__select"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {loading ? (
        <div className="course-list-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="course-card-skeleton" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="course-list-empty">
          <p>No courses found matching your criteria.</p>
        </div>
      ) : (
        <div className="course-list-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
