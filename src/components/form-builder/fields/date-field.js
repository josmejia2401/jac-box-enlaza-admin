import React from 'react';

function DateField({
    label,
    required,
    name,
    value,
    onChange,
    error,
    min,
    max,
    disabled,
    placeholder,
    autoComplete,
    className
}) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1 text-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                max={max}
                disabled={disabled}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`${className || ''} w-full p-2 border rounded-lg shadow-sm focus:outline-none transition ${
                    error
                        ? 'bg-error/10 border-error text-error placeholder:text-error/60 focus:ring-2 focus:ring-error'
                        : 'bg-surface border-muted text-text placeholder:text-muted focus:ring-2 focus:ring-primary'
                }`}
            />
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}

export default DateField;