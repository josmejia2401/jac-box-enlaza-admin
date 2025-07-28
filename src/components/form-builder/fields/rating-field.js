import React, { useState } from 'react';

function RatingField({
    label,
    name,
    value = 0,
    onChange,
    maxRating = 5,
    error,
    required,
    className
}) {
    const [hoverValue, setHoverValue] = useState(0);

    const handleClick = (val) => {
        onChange({ target: { name, value: val } });
    };

    return (
        <div className="mb-4">
            <label className="block font-medium mb-1 text-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>
            <div
                className={`flex space-x-1 transition ${
                    error ? 'border border-error rounded-md p-1' : ''
                }`}
                role="radiogroup"
                aria-label={label}
            >
                {[...Array(maxRating)].map((_, i) => {
                    const starValue = i + 1;
                    const isFilled = hoverValue
                        ? starValue <= hoverValue
                        : starValue <= value;

                    return (
                        <button
                            key={starValue}
                            type="button"
                            className={`${className || ''} text-2xl focus:outline-none transition ${
                                isFilled
                                    ? 'text-yellow-400'
                                    : error
                                    ? 'text-error/60'
                                    : 'text-muted'
                            }`}
                            onClick={() => handleClick(starValue)}
                            onMouseEnter={() => setHoverValue(starValue)}
                            onMouseLeave={() => setHoverValue(0)}
                            aria-checked={starValue === value}
                            role="radio"
                            aria-label={`${starValue} estrella${starValue > 1 ? 's' : ''}`}
                        >
                            ★
                        </button>
                    );
                })}
            </div>
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}

export default RatingField;