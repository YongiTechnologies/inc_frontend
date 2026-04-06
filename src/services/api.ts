import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

const ACCESS_TOKEN_KEY = 'access_token';

// Persist access token in localStorage so it survives page reloads
const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const setStoredToken = (token: string | null): void => {
    if (typeof window === 'undefined') return;
    if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
};

export const setAccessToken = (token: string | null) => {
    setStoredToken(token);
};

export const getAccessToken = (): string | null => {
    return getStoredToken();
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Crucial for sending httpOnly refresh cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Variables to handle multiple simultaneous requests when token expires
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token as string);
        }
    });
    failedQueue = [];
};

// Request interceptor to attach access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Debug: log requests without tokens to protected endpoints
        if (!token && config.url && (config.url.includes('/api/shipments') || config.url.includes('/api/admin') || config.url.includes('/api/dashboard'))) {
            console.warn('⚠️ Request to protected endpoint without token:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized errors and automatically refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401, we haven't retried yet, and it's not a request to login/refresh itself
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/login' && originalRequest.url !== '/api/auth/refresh') {
            
            if (isRefreshing) {
                // If already refreshing, put the request in a queue to wait
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Manually call refresh endpoint using standard axios to bypass interceptors
                // The refresh token is automatically sent as an httpOnly cookie via withCredentials
                const response = await axios.post(
                    `${api.defaults.baseURL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                
                // Backend returns { success, message, data: { accessToken } }
                const newToken = response.data?.data?.accessToken || response.data?.accessToken;
                
                if (newToken) {
                    setAccessToken(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    // Re-dispatch original request
                    return api(originalRequest);
                } else {
                    throw new Error("No token received from refresh endpoint");
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                setAccessToken(null);
                // We do NOT forcefully redirect here, because public pages might trigger 401 on /me.
                // The AuthContext will catch the failed /me call and set user state to logged out.
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status === 500) {
            console.error("API 500 Error Body:", error.response.data);
            console.error("API 500 Request URL:", originalRequest?.url);
        }

        // Silent 401 for /me — unexpected auth failure on a known protected route 
        // that will be handled by ProtectedRoute component
        if (error.response?.status === 401 && originalRequest?.url?.includes('/api/auth/me')) {
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
