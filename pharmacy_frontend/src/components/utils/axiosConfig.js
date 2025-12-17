// src/utils/axiosConfig.js
import axios from 'axios';
import { getCurrentUser } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8082/',
  withCredentials: true, // Include cookies if applicable
});

api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;