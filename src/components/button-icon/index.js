import React from 'react';
import './styles.css';

class Component extends React.Component {
    render() {
        const {
            className = '',
            type = 'button',
            disabled = false,
            loading = false,
            showText = false,
            textLoading = 'Cargando...',
            children = null,
            variant = 'primary', // Nuevo: permite variantes
            ...props
        } = this.props;

        // Define pastel variantes según la nueva paleta
        const pastelVariant = {
            primary: 'bg-primary text-white hover:bg-primary/90',
            secondary: 'bg-secondary text-text hover:bg-secondary/90',
            success: 'bg-success text-text hover:bg-success/90',
            warning: 'bg-warning text-text hover:bg-warning/90',
            error: 'bg-error text-text hover:bg-error/90',
            info: 'bg-info text-text hover:bg-info/90',
        };

        const disabledStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

        return (
            <button
                className={[
                    'inline-flex items-center justify-center font-medium rounded focus:outline-none transition',
                    pastelVariant[variant] || pastelVariant.primary,
                    disabledStyle,
                    className,
                ].join(' ')}
                type={type}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <span className="flex items-center">
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
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
                        <span
                            className={`${showText ? '' : 'sr-only'}`}
                            role="status"
                            style={{ marginLeft: '5px' }}
                        >
                            {textLoading}
                        </span>
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
}

export default Component;