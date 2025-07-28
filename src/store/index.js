// src/store/index.js

import { parseJwt } from "../utils/utils";

export class AuthStore {
    static data = {
        status: "unset",
        token: null,
        isAuthenticated: false,
        tokenInfo: '',
        userInfo: {}
    };

    static getState() {
        if (AuthStore.data.status === "set") {
            return AuthStore.data;
        }
        const stored = localStorage.getItem("state");
        return stored ? JSON.parse(stored) : { ...AuthStore.data };
    }

    static setToken(token) {
        const data = AuthStore.getState();
        data.status = "set";
        data.isAuthenticated = true;
        data.token = token;
        data.tokenInfo = parseJwt(token);
        localStorage.setItem("state", JSON.stringify(data));
        AuthStore.data = data;
    }

    static setUserInfo(data1) {
        const data = AuthStore.getState();
        data.status = "set";
        data.userInfo = data1;
        localStorage.setItem("state", JSON.stringify(data));
        AuthStore.data = data;
    }

    static logout() {
        const data = AuthStore.getState();
        data.status = "unset";
        data.isAuthenticated = false;
        data.token = null;
        data.tokenInfo = null;
        data.userInfo = null;
        localStorage.removeItem("state");
        localStorage.clear();
        AuthStore.data = data;
    }
}


/*export const useUIStore = create((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
}));*/
