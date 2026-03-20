import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
api.interceptors.request.use((config) => {
  const rawToken = localStorage.getItem('token');
  const token = rawToken?.trim();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 204 No Content é sucesso, não erro
    if (error.response?.status === 204) {
      return Promise.resolve({
        status: 204,
        data: null,
        statusText: 'No Content',
      });
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);
export default api;
