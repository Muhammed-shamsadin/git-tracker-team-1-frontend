import { setAuthTokenCookie } from "@/stores/cookieUtils";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh-token");
                const response = await axios.post(
                    "http://localhost:3001/api/auth/refresh",
                    {
                        refreshToken,
                    }
                );

                const access_token = response.data.data.access_token;

                localStorage.setItem("auth-token", access_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                setAuthTokenCookie(access_token);
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("auth-token");
                localStorage.removeItem("refresh-token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
