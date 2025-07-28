import { axiosInstance } from '../../../services/fetch';


export const requestResetPassword = async (payload) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").post(`/questionask/api/v1/auth/request-password-reset`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const resetPassword = async (payload) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").post(`/questionask/api/v1/auth/reset-password`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}