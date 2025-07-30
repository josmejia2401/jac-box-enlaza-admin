import React from 'react';
import './styles.css';

const pastelVariant = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  success: 'bg-success text-success-foreground hover:bg-success/90',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  error: 'bg-error text-error-foreground hover:bg-error/90',
  info: 'bg-info text-info-foreground hover:bg-info/90',
};

function ButtonIcon({
  className = '',
  type = 'button',
  disabled = false,
  loading = false,
  showText = false,
  textLoading = 'Cargando...',
  children = null,
  variant = 'primary',
  iconClassName = '',
  ...props
}) {
  const disabledStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium rounded focus:outline-none transition px-3 py-1 gap-2',
        pastelVariant[variant] || pastelVariant.primary,
        disabledStyle,
        className,
      ].join(' ').trim()}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className={`animate-spin h-5 w-5 ${iconClassName || (variant === 'primary' ? 'text-white' : '')}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {showText && (
            <span role="status">{textLoading}</span>
          )}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
}

export default ButtonIcon;