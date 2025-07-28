import React from 'react';

function RadioGroupField({
    label,
    name,
    options = [],
    value,
    onChange,
    required,
    error,
    disabled,
    className
}) {
    return (
        <div className="mb-4">
            <span className="block font-medium mb-1 text-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </span>
            <div
                role="radiogroup"
                aria-label={label}
                className="flex flex-col space-y-2"
            >
                {options.map(({ label: optionLabel, value: optionValue }) => (
                    <label
                        key={optionValue}
                        className={`${className || ''} inline-flex items-center cursor-pointer transition ${
                            disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={optionValue}
                            checked={value === optionValue}
                            onChange={onChange}
                            disabled={disabled}
                            className={`form-radio text-primary focus:ring-primary border-muted ${
                                error ? 'ring-2 ring-error border-error' : ''
                            }`}
                            required={required}
                        />
                        <span className="ml-2 text-text">{optionLabel}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}

export default RadioGroupField;