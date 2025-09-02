import { axiosInstance } from '../../services/fetch';

export const getRedirect = async (code, payload) => {
    try {
        const res = await axiosInstance('http://localhost:3104').post(`/api/v1/redirect/r/${code}`, payload);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// Nueva función para buscar reglas
export const getRulesByCode = async (code) => {
    try {
        const res = await axiosInstance('http://localhost:3104').get(`/api/v1/redirect/rules/${encodeURIComponent(code)}`);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

// Nueva función para buscar reglas
export const getShortLinkByCode = async (code) => {
    try {
        const res = await axiosInstance('http://localhost:3104').get(`/api/v1/redirect/shortlink/${encodeURIComponent(code)}`);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};