import axios from 'axios';
import { CustomError } from '../utils/custom-error';
import { AuthStore } from '../store/index';
const DEFAULT_API_BASE = "http://localhost:3000";
const buildAndThrowNewError = (error) => {
    console.error(error);
    if (error && error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
            AuthStore.logout();
        }
        console.error("data", error.response.data);
        console.error("status", error.response.status);
        console.error("headers", error.response.headers);
        return new CustomError(error.response.data["message"], error.response.data["code"], error.response.status, error);
    } else if (error.code === 'ERR_NETWORK') {
        return new CustomError("¡Lo sentimos! Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.", error.code, 500, error);
    } else {
        return new CustomError("¡Lo sentimos! Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.", error.code, 500, error);
    }
}

// object to store ongoing requests cancel tokens
const pendingRequests = new Map();

export const axiosInstance = (API_BASE = null) => {
    if (!API_BASE) {
        API_BASE = DEFAULT_API_BASE;
    }
    const axiosInstanceValue = axios.create({
        baseURL: API_BASE,
    });
    // next we set up the Request Interceptor, this logic triggers
    // before each request that we send
    axiosInstanceValue.interceptors.request.use(config => {
        // generate an identifier for each request
        const requestIdentifier = `${config.url}_${config.method}`;
        // check if there is already a pending request with the same identifier
        if (pendingRequests.has(requestIdentifier)) {
            const cancelTokenSource = pendingRequests.get(requestIdentifier);
            // cancel the previous request
            cancelTokenSource.cancel('Cancelled due to new request');
        }
        // Interceptor para incluir token automáticamente si existe
        const token = AuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // create a new CancelToken
        const newCancelTokenSource = axios.CancelToken.source();
        config.cancelToken = newCancelTokenSource.token;
        // store the new cancel token source in the map
        pendingRequests.set(requestIdentifier, newCancelTokenSource);
        return config;
    }, error => {
        // return the error if the request fails
        return Promise.reject(buildAndThrowNewError(error));
    });
    // here we set up the Response Interceptor, this logic triggers
    // before each response from the server comes
    axiosInstanceValue.interceptors.response.use(response => {
        // remove completed request from pending map
        const requestIdentifier = `${response.config.url}_${response.config.method}`;
        pendingRequests.delete(requestIdentifier);
        return response;
    }, error => {
        // remove failed request from pending map
        if (error.config) {
            const requestIdentifier = `${error.config.url}_${error.config.method}`;
            pendingRequests.delete(requestIdentifier);
        }
        return Promise.reject(buildAndThrowNewError(error));
    });
    return axiosInstanceValue;
}
