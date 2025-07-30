import React from "react";

const ConfirmDialog = ({ open, title, description, onCancel, onConfirm, loading }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-bold mb-2">{title || "Confirmar acción"}</h3>
                {description && <p className="text-gray-600 mb-4">{description}</p>}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;