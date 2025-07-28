import React from 'react';

function MultiSelectField({
    label,
    name,
    value = [],
    onChange,
    options = [],
    required,
    error,
    size = 5,
    disabled,
    placeholder,
    className
}) {
    const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
        );
        onChange({ target: { name, value: selectedOptions } });
    };

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1 text-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                multiple
                size={size}
                value={value}
                onChange={handleChange}
                required={required}
                disabled={disabled}
                className={`${className || ''} w-full p-2 border rounded-lg shadow-sm focus:outline-none transition ${
                    error
                        ? 'bg-error/10 border-error text-error focus:ring-2 focus:ring-error'
                        : 'bg-surface border-muted text-text focus:ring-2 focus:ring-primary'
                }`}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map(({ label: optionLabel, value: optionValue }) => (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}

export default MultiSelectField;