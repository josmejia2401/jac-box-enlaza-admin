import { axiosInstance } from '../../../services/fetch';
import { AuthStore } from '../../../store/index';

export const register = async (payload) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").post(`/questionask/api/v1/users`, payload);
        AuthStore.logout();
        return res.data;
    } catch (error) {
        throw error;
    }
}
