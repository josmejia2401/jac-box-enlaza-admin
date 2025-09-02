import { axiosInstance } from '../../../services/fetch';
export const findById = async (id) => {
    try {
        const res = await axiosInstance('http://localhost:8080').get(`/enlaza/api/v1/users/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance('http://localhost:8080').put(`/enlaza/api/v1/users/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}