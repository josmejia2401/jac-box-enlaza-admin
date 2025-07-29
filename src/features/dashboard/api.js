import { axiosInstance } from '../../services/fetch';

/**
 * Registrar un clic en un shortlink
 * @param {string} shortLinkId - UUID del shortlink
 * @param {object} payload - Información adicional del clic (puede incluir userAgent, referrer, etc)
 */
export const registerClick = async (shortLinkId, payload = {}) => {
    try {
        const res = await axiosInstance('http://localhost:3105').post('/api/v1/analytics/click', {
            shortLinkId,
            ...payload,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener estadísticas por shortlink o usuario
 * @param {'shortLink'|'user'} type - Tipo de entidad ('shortLink' o 'user')
 * @param {string} id - UUID de la entidad (shortlink o usuario)
 * @param {object} [params] - Parámetros opcionales (from, to)
 */
export const getStats = async (type, id, params = {}) => {
    try {
        const res = await axiosInstance('http://localhost:3105').get(`/api/v1/analytics/stats/${type}/${id}`, { params });
        return res.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Listar eventos analíticos detallados por shortlink o usuario
 * @param {'shortLink'|'user'} type - Tipo de entidad ('shortLink' o 'user')
 * @param {string} id - UUID de la entidad (shortlink o usuario)
 * @param {object} [params] - Parámetros opcionales (from, to, limit)
 */
export const listEvents = async (type, id, params = {}) => {
    try {
        const res = await axiosInstance('http://localhost:3105').get(`/api/v1/analytics/events/${type}/${id}`, { params });
        return res.data;
    } catch (error) {
        throw error;
    }
};