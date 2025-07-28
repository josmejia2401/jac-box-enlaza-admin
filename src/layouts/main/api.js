import { axiosInstance } from '../../services/fetch';
import { AuthStore } from '../../store/index';

export const logout = async () => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").post(`/questionask/api/v1/auth/logout`);
        AuthStore.logout();
        return res.data;
    } catch (error) {
        console.log(">>>>>>>", error);
        AuthStore.logout();
    }
}

export const findById = async () => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").get(`/questionask/api/v1/users/${AuthStore.getState().tokenInfo.keyid}`);
        AuthStore.setUserInfo(res.data.data);
        return res.data;
    } catch (error) {
        console.log(">>>>>>>", error);
        //throw error;
    }
}
