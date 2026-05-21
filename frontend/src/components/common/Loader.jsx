import './Loader.css';

export default function Loader({ size = 'medium', type = 'spinner', className = '' }) {
  if (type === 'skeleton') {
    return <div className={`skeleton-loader ${size} ${className}`} />;
  }

  return (
    <div className={`spinner-loader-container ${className}`}>
      <div className={`spinner-loader ${size}`} />
    </div>
  );
}
