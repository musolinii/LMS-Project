import './Avatar.css';

export default function Avatar({ src, name = 'User', size = 'medium', className = '' }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  const backgroundColor = stringToColor(name);

  return (
    <div className={`avatar-container avatar--${size} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="avatar-image" onError={(e) => { e.target.style.display = 'none'; }} />
      ) : (
        <div
          className="avatar-fallback"
          style={{ backgroundColor, color: '#fff' }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
