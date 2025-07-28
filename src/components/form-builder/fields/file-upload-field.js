import React from 'react';

function FileUploadField({
    label,
    name,
    onChange,
    multiple = false,
    accept,
    required,
    error,
    disabled,
    className
}) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block font-medium mb-1 text-text cursor-pointer"
            >
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>
            <input
                type="file"
                id={name}
                name={name}
                onChange={onChange}
                multiple={multiple}
                accept={accept}
                required={required}
                disabled={disabled}
                className={`${className || ''} block w-full text-sm focus:outline-none transition border
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-surface file:text-primary
                    hover:file:bg-primary/10
                    focus:ring-2 ${
                        error
                            ? 'border-error focus:ring-error file:bg-error/10 file:text-error'
                            : 'border-muted focus:ring-primary file:bg-primary/10 file:text-primary'
                    }`}
            />
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}

export default FileUploadField;