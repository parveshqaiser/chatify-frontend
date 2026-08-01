
import axios from "axios";
import { BASE_URL } from "./constants.js";
import { useDispatch } from "react-redux";

let dispatch = useDispatch();

let axiosInstance = axios.create({
    baseURL : BASE_URL,
    withCredentials : true,
    // headers : {
    //     "Content-Type": "application/json",
    // }
});

axiosInstance.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/auth/generate/access-token"
        ) {
            originalRequest._retry = true;

            try {
                await axiosInstance.post("/auth/generate/access-token");

                // Retry the request that originally failed
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh token is invalid/expired
                dispatch(logout());

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;