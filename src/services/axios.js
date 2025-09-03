import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9009/api/loans', // Your Spring Boot backend
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
