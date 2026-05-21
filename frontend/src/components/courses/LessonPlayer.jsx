import { useState } from 'react';
import Button from '../common/Button';
import './LessonPlayer.css';

export default function LessonPlayer({ lesson, onComplete, isCompleted }) {
  const { title, content, video_url, duration_minutes } = lesson;
  const [videoEnded, setVideoEnded] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube embed logic
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo embed logic
    const vimeoMatch = url.match(/(?:vimeo\.com\/)\s*([^"&?\/\s]+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(video_url);

  return (
    <div className="lesson-player">
      <div className="lesson-player__media">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="lesson-player__video"
          />
        ) : (
          <div className="lesson-player__no-video">
            <span>📹</span>
            <p>No video lecture available for this lesson.</p>
          </div>
        )}
      </div>

      <div className="lesson-player__header">
        <h2 className="lesson-player__title">{title}</h2>
        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          onClick={onComplete}
        >
          {isCompleted ? '✓ Completed' : 'Mark as Complete'}
        </Button>
      </div>

      <div className="lesson-player__body">
        <div className="lesson-player__content">
          <h3>Lesson Notes</h3>
          <p>{content || 'This lesson has no written content.'}</p>
        </div>
      </div>
    </div>
  );
}
