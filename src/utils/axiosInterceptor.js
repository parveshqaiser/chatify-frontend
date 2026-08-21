
import axios from "axios";
import { BASE_URL } from "./constants.js";
import useLogout from "../hooks/useLogout.js";


let axiosInstance = axios.create({
    baseURL : BASE_URL,
    withCredentials : true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        // You can modify response data here
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh token
                let response = await axios.get(`${BASE_URL}/auth/generate/access-token`,{ withCredentials: true});
                if (response.data.data) {
                        localStorage.setItem('token', response.data.data);
                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${response.data.data}`;
                        return axiosInstance(originalRequest);
                    }
            } catch (refreshError) {
                // Handle refresh token failure (logout)
                localStorage.removeItem('token');
                localStorage.removeItem('token');
                useLogout();
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;

export const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) => 
    async ({ url, method, data, params, headers }) => {
        try {
            const result = await axiosInstance({
                url: `${baseUrl}${url}`,
                method,
                data,
                params,
                headers,
            });
            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };