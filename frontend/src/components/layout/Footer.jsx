import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p>&copy; {new Date().getFullYear()} Musolinii LMS. All rights reserved.</p>
        <div className="footer__links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
