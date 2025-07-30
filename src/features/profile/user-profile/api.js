import { axiosInstance } from '../../../services/fetch';
export const findById = async (id) => {
    try {
        const res = await axiosInstance('http://localhost:3101').get(`/api/v1/users/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance('http://localhost:3101').put(`/api/v1/users/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}