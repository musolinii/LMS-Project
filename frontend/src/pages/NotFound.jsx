import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__content">
        <span className="not-found-page__emoji">🔍</span>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/">
          <Button size="large">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
