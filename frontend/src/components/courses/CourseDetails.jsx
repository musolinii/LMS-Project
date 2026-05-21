import { useState } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import EnrollButton from './EnrollButton';
import { formatDuration } from '../../utils/formatDate';
import './CourseDetails.css';

export default function CourseDetails({ course, lessons, enrolled, onEnrollChange }) {
  const { title, description, thumbnail_url, difficulty, category, price, profiles } = course;
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div className="course-details">
      <div className="course-details__header">
        <div className="course-details__meta">
          <span className="course-details__category">{category}</span>
          <span className={`course-details__difficulty course-details__difficulty--${difficulty}`}>
            {difficulty}
          </span>
        </div>
        <h1 className="course-details__title">{title}</h1>
        <p className="course-details__desc">{description}</p>
        
        <div className="course-details__instructor">
          <Avatar name={profiles?.full_name} src={profiles?.avatar_url} />
          <div>
            <div className="course-details__instructor-name">Created by {profiles?.full_name || 'Instructor'}</div>
            <div className="course-details__instructor-bio">{profiles?.bio || 'No bio available.'}</div>
          </div>
        </div>
      </div>

      <div className="course-details__layout">
        <div className="course-details__content">
          <div className="course-details__tabs">
            <button
              className={`course-details__tab ${activeTab === 'lessons' ? 'course-details__tab--active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              Lessons ({lessons.length})
            </button>
            <button
              className={`course-details__tab ${activeTab === 'about' ? 'course-details__tab--active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About the Instructor
            </button>
          </div>

          <div className="course-details__tab-content">
            {activeTab === 'lessons' ? (
              <div className="course-details__lessons-list">
                {lessons.length === 0 ? (
                  <p className="course-details__no-lessons">No lessons have been added to this course yet.</p>
                ) : (
                  lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="course-details__lesson-row">
                      <div className="course-details__lesson-idx">{idx + 1}</div>
                      <div className="course-details__lesson-info">
                        <div className="course-details__lesson-title">{lesson.title}</div>
                        <div className="course-details__lesson-duration">
                          ⏱️ {formatDuration(lesson.duration_minutes)}
                        </div>
                      </div>
                      {lesson.is_free && !enrolled && (
                        <span className="course-details__free-badge">Preview</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="course-details__instructor-section">
                <h3>{profiles?.full_name || 'Instructor'}</h3>
                <p>{profiles?.bio || 'This instructor hasn\'t provided a bio yet.'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="course-details__sidebar">
          <div className="course-details__card">
            {thumbnail_url ? (
              <img src={thumbnail_url} alt={title} className="course-details__card-img" />
            ) : (
              <div className="course-details__card-placeholder">📚</div>
            )}
            <div className="course-details__card-body">
              <div className="course-details__card-price">
                {price === 0 ? 'Free' : `$${price}`}
              </div>
              <EnrollButton
                courseId={course.id}
                enrolled={enrolled}
                onEnrollChange={onEnrollChange}
                className="course-details__enroll-btn"
              />
              <ul className="course-details__features">
                <li>⏱️ Full lifetime access</li>
                <li>📱 Access on mobile and desktop</li>
                <li>📜 Certificate of completion (when completed)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
