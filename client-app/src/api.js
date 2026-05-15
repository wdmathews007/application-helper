import axios from 'axios';

// 1. Create the Axios instance with your backend's base URL
const api = axios.create({
  baseURL: 'http://localhost:5224/api', // Make sure this matches your .NET port!
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