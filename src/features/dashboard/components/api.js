import { axiosInstance } from '../../../services/fetch';


export const findStatsUser = async (id) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").get(`/questionask/api/v1/stats/users/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}