import { axiosInstance } from '../../services/fetch';

// Base URL del microservicio de shortlinks
const BASE_URL = 'http://localhost:3102';

export const getAllShortLinks = async ({ limit = 12, offset = 0 }) => {
    try {
        const res = await axiosInstance(BASE_URL).get(
            '/api/v1/shortlinks/',
            {
                params: { limit, offset }
            }
        );
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

export const getShortLinkById = async (id) => {
    try {
        const res = await axiosInstance(BASE_URL).get(`/api/v1/shortlinks/${id}`);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

export const updateShortLink = async (id, payload) => {
    try {
        const res = await axiosInstance(BASE_URL).put(`/api/v1/shortlinks/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

export const deleteShortLink = async (id) => {
    try {
        const res = await axiosInstance(BASE_URL).delete(`/api/v1/shortlinks/${id}`);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

export const addTagsToShortLink = async (id, tags) => {
    try {
        const res = await axiosInstance(BASE_URL).post(`/api/v1/shortlinks/${id}/tags`, { tags });
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

export const removeTagsFromShortLink = async (id, tags) => {
    try {
        const res = await axiosInstance(BASE_URL).delete(`/api/v1/shortlinks/${id}/tags`, { data: { tags } });
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};

export const createShortLink = async (payload) => {
    try {
        const res = await axiosInstance(BASE_URL).post('/api/v1/shortlinks/', payload);
        return res.data;
    } catch (error) {
        throw error?.response?.data || error;
    }
};