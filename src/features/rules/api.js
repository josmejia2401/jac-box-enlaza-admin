import { axiosInstance } from '../../services/fetch';

const BASE_URL = 'http://localhost:3103';

// Crear una regla
export const createRule = async (payload) => {
    try {
        const res = await axiosInstance(BASE_URL).post('/api/v1/linkrules/', payload);
        return res.data;
    } catch (err) {
        throw err?.response?.data || err;
    }
};

// Obtener una regla por ID
export const getRuleById = async (id) => {
    try {
        const res = await axiosInstance(BASE_URL).get(`/api/v1/linkrules/${id}`);
        return res.data;
    } catch (err) {
        throw err?.response?.data || err;
    }
};

// Actualizar una regla
export const updateRule = async (id, payload) => {
    try {
        const res = await axiosInstance(BASE_URL).put(`/api/v1/linkrules/${id}`, payload);
        return res.data;
    } catch (err) {
        throw err?.response?.data || err;
    }
};

// Eliminar una regla
export const deleteRule = async (id) => {
    try {
        const res = await axiosInstance(BASE_URL).delete(`/api/v1/linkrules/${id}`);
        return res.data;
    } catch (err) {
        throw err?.response?.data || err;
    }
};

// Listar todas las reglas de un shortlink
export const getRulesByShortlink = async (shortLinkId) => {
    try {
        const res = await axiosInstance(BASE_URL).get(`/api/v1/linkrules/shortlink/${shortLinkId}`);
        return res.data;
    } catch (err) {
        throw err?.response?.data || err;
    }
};