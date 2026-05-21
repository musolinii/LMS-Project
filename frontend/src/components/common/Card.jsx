import './Card.css';

export default function Card({ children, className = '', onClick, hover = false, ...props }) {
  const isClickable = !!onClick;
  return (
    <div
      className={`card ${hover ? 'card--hover' : ''} ${isClickable ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
