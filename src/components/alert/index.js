import React from "react";

export default function Alert({ type = "error", message, onClose }) {
    const colors = {
        error: {
            bg: "bg-red-50",
            border: "border-red-500",
            text: "text-red-700",
            icon: (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M18.364 17.364a9 9 0 11-12.728-12.728 9 9 0 0112.728 12.728zM10 12v2m0-8v4" />
                </svg>
            ),
        },
        warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-500",
            text: "text-yellow-700",
            icon: (
                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M10.293 2.293a1 1 0 011.414 0l7 7a1 1 0 01-1.414 1.414L10 4.414 3.707 10.707a1 1 0 01-1.414-1.414l7-7z" />
                </svg>
            ),
        },
        success: {
            bg: "bg-green-50",
            border: "border-green-500",
            text: "text-green-700",
            icon: (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M9 12l2 2 4-4m-6 2a7 7 0 1114 0 7 7 0 01-14 0z" />
                </svg>
            ),
        },
    }[type];

    return (
        <div className={`${colors.bg} border-l-4 ${colors.border} p-4 mb-4 flex items-center`}>
            <div className="mr-2">{colors.icon}</div>
            <p className={`text-sm ${colors.text} flex-1`}>
                {message}
                {onClose && (
                    <button onClick={onClose} className="ml-4 underline text-xs">
                        Ocultar
                    </button>
                )}
            </p>
        </div>
    );
}