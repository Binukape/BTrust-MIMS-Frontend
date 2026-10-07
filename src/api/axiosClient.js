import axios from 'axios';

let token = null;
let onUnauthorized = () => {};

export function setAuthToken(value) {
  token = value;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLogin) onUnauthorized();
    return Promise.reject(error);
  },
);

export default axiosClient;
