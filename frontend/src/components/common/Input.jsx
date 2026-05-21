import './Input.css';

export default function Input({
  label,
  type = 'text',
  error,
  icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && <label htmlFor={inputId} className="input-group__label">{label}</label>}
      <div className="input-group__wrapper">
        {icon && <span className="input-group__icon">{icon}</span>}
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            className={`input-group__input input-group__textarea ${icon ? 'input-group__input--with-icon' : ''}`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            className={`input-group__input ${icon ? 'input-group__input--with-icon' : ''}`}
            {...props}
          />
        )}
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
