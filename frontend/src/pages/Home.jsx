import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      
      <header className="hero-section">
        <div className="hero-section__container">
          <div className="hero-section__content">
            <h1 className="hero-section__title">
              Learn anything, <br />
              <span>Anytime, Anywhere.</span>
            </h1>
            <p className="hero-section__subtitle">
              Join Musolinii LMS and start your learning journey today. Get access to premium quality video courses, interact with quizzes, and earn certificates.
            </p>
            <div className="hero-section__actions">
              <Link to="/register">
                <Button size="large">Join for Free</Button>
              </Link>
              <Link to="/login">
                <Button size="large" variant="secondary">View Dashboard</Button>
              </Link>
            </div>
          </div>
          <div className="hero-section__visual">
            <span className="hero-section__emoji">🎓</span>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="features-section__container">
          <h2 className="features-section__title">Why Choose Musolinii LMS?</h2>
          <div className="features-section__grid">
            <div className="feature-card">
              <span className="feature-card__icon">👨‍🏫</span>
              <h3>Expert Instructors</h3>
              <p>Learn from certified industry professionals with hands-on real-world expertise.</p>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon">⏱️</span>
              <h3>Self-paced Study</h3>
              <p>Study on your schedule. Stop, review, and skip topics when you want.</p>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon">📜</span>
              <h3>Verified Credentials</h3>
              <p>Earn verified, shareable digital completion certificates for every course you pass.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
