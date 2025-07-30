import React, { useRef, useState, useEffect } from "react";
import { updateShortLink, getShortLinkById } from "./api";
import Alert from "../../components/alert";
import TextInputField from '../../components/form-builder/fields/text-input-field';
import ButtonIcon from '../../components/button-icon';
import { CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const statusOptions = [
    { value: "", label: "Selecciona estado" },
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
    { value: "expired", label: "Expirado" },
];

const initialForm = {
    originalUrl: "",
    shortCode: "",
    customCode: "",
    expiresAt: "",
    password: "",
    isOneTime: false,
    branding: "",
    status: "",
    tags: [],
};

const ShortLinkEdit = ({ shortLinkId, onUpdated, onCancel }) => {
    const [form, setForm] = useState(initialForm);
    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(true);
    const topRef = useRef(null);

    // Cargar datos actuales
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getShortLinkById(shortLinkId);
                const data = res.data;
                setForm({
                    originalUrl: data.originalUrl || "",
                    shortCode: data.shortCode || "",
                    customCode: data.customCode || "",
                    expiresAt: data.expiresAt ? data.expiresAt.slice(0, 16) : "",
                    password: data.password || "",
                    isOneTime: !!data.isOneTime,
                    branding: data.branding?.name || "",
                    status: data.status || "",
                    tags: data.tags ? data.tags.map(t => t.name) : [],
                });
            } catch (err) {
                setError("No se pudo cargar el enlace.");
                setShowError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shortLinkId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleTagAdd = () => {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t)) {
            setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
        }
        setTagInput("");
    };

    const handleTagRemove = (t) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== t),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowError(true);
        setSuccessMsg(null);
        try {
            const payload = {
                originalUrl: form.originalUrl,
                shortCode: form.shortCode || undefined,
                customCode: form.customCode || undefined,
                expiresAt: form.expiresAt || undefined,
                password: form.password || undefined,
                isOneTime: form.isOneTime,
                branding: form.branding ? { name: form.branding } : undefined,
                status: form.status || undefined,
                tags: form.tags,
            };
            await updateShortLink(shortLinkId, payload);
            setSuccessMsg("¡Enlace actualizado exitosamente!");
            setLoading(false);
            if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            // Espera 1.5 segundos y cierra el modal
            setTimeout(() => {
                if (onUpdated) onUpdated();
            }, 2500);
        } catch (err) {
            setError(err.message || "No se pudo actualizar el enlace.");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={topRef}
            className="max-w-xl mx-auto mt-8 bg-white/95 rounded-2xl shadow-lg p-8 border border-primary-100">
            {error && showError && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => setShowError(false)}
                />
            )}
            {successMsg && (
                <div className="flex items-center gap-2 mb-4 bg-primary-50 border-l-4 border-primary-500 p-3 rounded">
                    <CheckCircleIcon className="h-5 w-5 text-primary-500" />
                    <div>
                        <div className="text-primary-700">{successMsg}</div>
                        <div className="text-xs text-primary-600 mt-1">
                            Esta ventana se cerrará automáticamente.
                        </div>
                    </div>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-6 text-primary-800">Editar enlace corto</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                {/* URL destino */}
                <TextInputField
                    name="originalUrl"
                    label="URL destino"
                    type="url"
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm focus:ring-2 focus:ring-primary-400"
                    placeholder="https://ejemplo.com/..."
                    value={form.originalUrl}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                {/* shortCode */}
                <TextInputField
                    name="shortCode"
                    label="Código corto (opcional)"
                    maxLength={15}
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm"
                    value={form.shortCode}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* customCode */}
                <TextInputField
                    name="customCode"
                    label="Código personalizado (opcional)"
                    maxLength={15}
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm"
                    value={form.customCode}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* expiresAt */}
                <label className="block text-sm font-medium mb-1 text-primary-700">
                    Expiración (opcional)
                </label>
                <input
                    type="datetime-local"
                    name="expiresAt"
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm"
                    value={form.expiresAt}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* password */}
                <TextInputField
                    name="password"
                    label="Contraseña (opcional)"
                    type="password"
                    maxLength={128}
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* isOneTime */}
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="isOneTime"
                        id="isOneTime"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={form.isOneTime}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <label htmlFor="isOneTime" className="ml-2 block text-sm text-primary-700">
                        Uso único (solo se podrá utilizar una vez)
                    </label>
                </div>

                {/* Branding (simple) */}
                <TextInputField
                    name="branding"
                    label="Marca/Branding (opcional)"
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm"
                    value={form.branding}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* status */}
                <label className="block text-sm font-medium mb-1 text-primary-700">
                    Estado (opcional)
                </label>
                <select
                    name="status"
                    className="w-full px-3 py-2 mb-4 rounded border border-primary-200 shadow-sm"
                    value={form.status}
                    onChange={handleChange}
                    disabled={loading}
                >
                    {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Tags */}
                <label className="block text-sm font-medium mb-1 text-primary-700">
                    Etiquetas (opcional)
                </label>
                <div className="flex mb-2 gap-2">
                    <TextInputField
                        type="text"
                        className="flex-1 px-2 py-1 rounded border border-primary-200"
                        placeholder="agrega una etiqueta"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleTagAdd();
                            }
                        }}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        onClick={handleTagAdd}
                        disabled={loading || !tagInput.trim()}
                        title="Agregar etiqueta"
                    >
                        +
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {form.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-xs font-medium">
                            {tag}
                            <ButtonIcon
                                type="button"
                                onClick={() => handleTagRemove(tag)}
                                className="ml-1 text-primary-500 hover:text-red-500"
                                title="Quitar"
                                disabled={loading}
                            >
                                &times;
                            </ButtonIcon>
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-6 gap-2">
                    <ButtonIcon
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-200 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Cancelar
                    </ButtonIcon>
                    <ButtonIcon
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
                        disabled={loading || !form.originalUrl}
                    >
                        <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </ButtonIcon>
                </div>
            </form>
        </div>
    );
};

export default ShortLinkEdit;