import React from 'react';

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

    // Usa colores estándar de Tailwind
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        tertiary: 'bg-transparent text-blue-600 hover:underline',
        success: 'bg-green-500 text-white hover:bg-green-600',
        warning: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500',
        error: 'bg-red-500 text-white hover:bg-red-600',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
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

    // Spinner color
    const spinnerColorClass = (variant === 'primary' || variant === 'success' || variant === 'error') ? 'text-white' : 'text-gray-900';

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