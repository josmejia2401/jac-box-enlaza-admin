import React from 'react';
import './styles.css';

function Button({
    children,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    size = 'md',
    className = '',
    fullWidth = false,
    ...props
}) {

    const isDisabled = disabled || loading;

    const baseStyle =
        'inline-flex items-center justify-center font-medium rounded focus:outline-none transition';

    // Ajuste de estilos con la nueva paleta pastel elegante
    const variantStyles = {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-text hover:bg-secondary/90',
        tertiary: 'bg-transparent text-primary hover:underline',
        success: 'bg-success text-text hover:bg-success/90',
        warning: 'bg-warning text-text hover:bg-warning/90',
        error: 'bg-error text-text hover:bg-error/90',
        info: 'bg-info text-text hover:bg-info/90',
    };

    const sizeStyles = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : 'w-auto';
    const disabledStyle = 'opacity-50 cursor-not-allowed';

    const combinedStyles = [
        baseStyle,
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        widthStyle,
        isDisabled ? disabledStyle : '',
        className,
    ].join(' ');

    // Color del spinner: blanco para primary, color de texto para otros variantes
    const spinnerColorClass = variant === 'primary' ? 'text-white' : 'text-text';

    return (
        <button
            type={type}
            className={combinedStyles}
            disabled={isDisabled}
            {...props}
        >
            {loading && (
                <svg
                    className={`animate-spin h-5 w-5 mr-2 ${spinnerColorClass}`}
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
            )}
            {children}
        </button>
    );
}

export default Button;