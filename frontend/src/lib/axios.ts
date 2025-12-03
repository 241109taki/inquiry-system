import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, 
  headers: {
    'Content-Type' : 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('api/auth/refresh')) {
        window.location.href = '/login';
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('access_token unavailable, trying to refresh...');
        await apiClient.post('/api/auth/refresh');
        return apiClient(originalRequest);
      }  catch (refreshError) {
        console.error('Invalid refresh token, redirect to login page now...')
        window.location.href = '/login';
        return window.Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
)