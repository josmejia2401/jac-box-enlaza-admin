import React from 'react';

function SelectField({
    label,
    required,
    name,
    value,
    onChange,
    error,
    options = [],
    multiple = false,
    size,
    disabled,
    placeholder,
    className
}) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1 text-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                multiple={multiple}
                size={size}
                disabled={disabled}
                className={`${className || ''} w-full p-2 rounded-lg shadow-sm focus:outline-none transition border ${
                    error
                        ? 'bg-error/10 border-error text-error focus:ring-2 focus:ring-error'
                        : 'bg-surface border-muted text-text focus:ring-2 focus:ring-primary'
                }`}
            >
                {placeholder && !multiple && (
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

export default SelectField;