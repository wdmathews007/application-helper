import axios from 'axios';

// Automatically use localhost in dev, and the Azure API in the production .exe
const API_URL = import.meta.env.PROD 
  ? 'https://wdmat-apptracker-api.azurewebsites.net/api' // Replace with your actual Azure App Service URL
  : 'http://localhost:5224/api';

// 1. Create the Axios instance with your backend's base URL
const api = axios.create({
  baseURL: API_URL,
});

// 2. Add a Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Look for a token in the browser's localStorage
    const token = localStorage.getItem('token');
    
    // If we have one, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;