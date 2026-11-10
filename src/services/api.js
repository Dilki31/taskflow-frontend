import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8083/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// An expired or invalid token on a protected call sends the user back to login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthCall = error.config?.url?.startsWith('/auth/');
        if (error.response?.status === 401 && !isAuthCall) {
            localStorage.removeItem('token');
            localStorage.removeItem('fullName');
            window.location.assign('/login');
        }
        return Promise.reject(error);
    }
);

/** Turns an Axios error into a message that is safe to show to the user. */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    if (!error.response) return 'Cannot reach the server. Is the backend running?';
    return error.response.data?.message || fallback;
}

export default api;
