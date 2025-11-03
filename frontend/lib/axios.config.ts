import axios from 'axios';

const api = axios.create({
  baseURL: "http://212.86.104.213",
  withCredentials: true, 
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post('/api/v1/auth/refresh');
        return api(original); 
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
