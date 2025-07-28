import { axiosInstance } from '../../../services/fetch';
export const findById = async (id) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").get(`/questionask/api/v1/users/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").put(`/questionask/api/v1/users/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}