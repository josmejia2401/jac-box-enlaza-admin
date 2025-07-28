import React, { useEffect, useState } from 'react';
import { findById, updateById } from './api';
import { AuthStore } from '../../../store';
import Input from '../../../components/form-builder/fields/text-input-field';

const UserProfile = () => {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        try {
            const res = await updateById(AuthStore.getState().tokenInfo.keyid, formData);
            if (res.code === 200) {
                setFormData(res.data);
                setEditing(false);
            }
        } catch (err) {
            setError(err.message || 'No se pudo actualizar la información del usuario.');
        } finally {
            setLoading(false);
        }
    };

    const hideError = () => setError(null);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">
                    Error al cargar el formulario: {error}
                    <button onClick={hideError} className="ml-2 underline">
                        Ocultar
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Perfil de Usuario</h2>

            <Input
                id="firstName"
                name="firstName"
                label="Nombres"
                required={true}
                value={formData.firstName || ''}
                maxLength={100}
                onChange={handleChange}
                disabled={!editing}
            />
            <Input
                id="lastName"
                name="lastName"
                label="Apellidos"
                required={true}
                value={formData.lastName || ''}
                maxLength={100}
                onChange={handleChange}
                disabled={!editing}
            />
            <Input
                id="email"
                name="email"
                label="Correo electrónico"
                required={true}
                value={formData.email || ''}
                maxLength={150}
                onChange={handleChange}
                disabled={!editing}
                type="email"
            />
            <Input
                id="phoneNumber"
                name="phoneNumber"
                label="Teléfono"
                required={true}
                value={formData.phoneNumber || ''}
                maxLength={20}
                onChange={handleChange}
                disabled={!editing}
            />
            <Input
                id="username"
                name="username"
                label="Nombre de usuario"
                required={true}
                value={formData.username || ''}
                maxLength={50}
                disabled={true}
            />
            <Input
                id="created_at"
                name="created_at"
                label="Fecha de creación"
                value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : ''}
                disabled={true}
            />

            <div className="flex justify-end space-x-2 mt-6">
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Editar
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Guardar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
