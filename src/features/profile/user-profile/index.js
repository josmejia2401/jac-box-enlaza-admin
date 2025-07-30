import React, { useEffect, useState } from 'react';
import { findById, updateById } from './api';
import { AuthStore } from '../../../store';
import TextInputField from '../../../components/form-builder/fields/text-input-field';
import EmailTextField from '../../../components/form-builder/fields/email-input-field';
import ButtonIcon from '../../../components/button-icon';
import { UserCircleIcon, PencilSquareIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const UserProfile = () => {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await findById(AuthStore.getState().tokenInfo.keyid);
                if (res.code === 200) {
                    setFormData(res.data);
                }
            } catch (err) {
                setError(err.message || 'No se pudo cargar la información del usuario.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        try {
            const res = await updateById(AuthStore.getState().tokenInfo.keyid, formData);
            if (res.code === 200) {
                setFormData(res.data);
                setEditing(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 1700);
            }
        } catch (err) {
            setError(err.message || 'No se pudo actualizar la información del usuario.');
        } finally {
            setLoading(false);
        }
    };

    const hideError = () => setError(null);

    if (loading && !editing) {
        return (
            <div className="flex flex-col items-center justify-center h-80">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <div className="mt-4 text-indigo-800 font-medium animate-pulse">Cargando tu perfil...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 p-8 rounded-3xl shadow-2xl relative">
            {/* Feedback Saved */}
            {saved && (
                <div className="absolute top-4 right-4 flex items-center bg-green-50 rounded-lg px-3 py-2 text-green-700 shadow animate-fade-in-out z-10">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Cambios guardados
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow">
                    <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                    <span className="text-sm text-red-700 flex-1">
                        {error}
                    </span>
                    <button onClick={hideError} className="ml-3 text-red-600 hover:underline font-bold">Cerrar</button>
                </div>
            )}

            {/* Header with avatar */}
            <div className="flex items-center gap-4 mb-8">
                <div className="rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 p-1">
                    <UserCircleIcon className="h-16 w-16 text-white drop-shadow-xl" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-neutral-800 mb-1">Perfil de Usuario</h2>
                    <div className="text-neutral-500">{formData.email}</div>
                </div>
            </div>

            <div className={`transition-opacity duration-300 ${editing ? "opacity-100" : "opacity-90"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <TextInputField
                        id="firstName"
                        name="firstName"
                        label="Nombres"
                        required
                        value={formData.firstName || ''}
                        maxLength={100}
                        onChange={handleChange}
                        disabled={!editing}
                        className={!editing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
                    />
                    <TextInputField
                        id="lastName"
                        name="lastName"
                        label="Apellidos"
                        required
                        value={formData.lastName || ''}
                        maxLength={100}
                        onChange={handleChange}
                        disabled={!editing}
                        className={!editing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
                    />
                    <EmailTextField
                        id="email"
                        name="email"
                        label="Correo electrónico"
                        required
                        value={formData.email || ''}
                        maxLength={150}
                        onChange={handleChange}
                        disabled={!editing}
                        type="email"
                        className={!editing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
                    />
                    <TextInputField
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Teléfono"
                        required
                        value={formData.phoneNumber || ''}
                        maxLength={20}
                        onChange={handleChange}
                        disabled={!editing}
                        className={!editing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
                    />
                    <TextInputField
                        id="username"
                        name="username"
                        label="Nombre de usuario"
                        required
                        value={formData.username || ''}
                        maxLength={50}
                        disabled
                        className={'bg-gray-100 text-gray-500 cursor-not-allowed'}
                    />
                    <TextInputField
                        id="created_at"
                        name="created_at"
                        label="Fecha de creación"
                        value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : ''}
                        disabled
                        className={'bg-gray-100 text-gray-500 cursor-not-allowed'}
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 mt-8">
                {!editing ? (
                    <ButtonIcon
                        onClick={() => setEditing(true)}
                        className="flex items-center px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 gap-2"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Editar
                    </ButtonIcon>
                ) : (
                    <>
                        <ButtonIcon
                            onClick={() => setEditing(false)}
                            disabled={loading}
                            loading={loading}
                            className="flex items-center px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition gap-2"
                        >
                            Cancelar
                        </ButtonIcon>
                        <ButtonIcon
                            onClick={handleSave}
                            disabled={loading}
                            loading={loading}
                            className="flex items-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 gap-2 disabled:opacity-50"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                            {loading ? "Guardando..." : "Guardar"}
                        </ButtonIcon>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;