import axios from 'axios';
import { getTokenSync, hydrateTokenFromStorage, setToken, clearToken, getRefreshTokenSync, hydrateRefreshTokenFromStorage, setRefreshToken } from './token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  // No cookies; use Authorization and X-Refresh-Token headers
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  let token = getTokenSync();
  if (!token) {
    token = await hydrateTokenFromStorage();
  }
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // If the original request had no Authorization header, try hydrating and retrying once
        const hadAuthHeader = Boolean(original?.headers?.Authorization || original?.headers?.authorization);
        if (!hadAuthHeader) {
          const hydrated = await hydrateTokenFromStorage();
          if (hydrated) {
            original.headers = original.headers || {};
            original.headers['Authorization'] = `Bearer ${hydrated}`;
            return api(original);
          }
        }

        let refreshToken = getRefreshTokenSync();
        if (!refreshToken) {
          refreshToken = await hydrateRefreshTokenFromStorage();
        }
        const refreshRes = await api.post('/api/v1/auth/refresh', undefined, {
          headers: refreshToken ? { 'X-Refresh-Token': `Bearer ${refreshToken}` } : undefined,
        });
        const newToken = refreshRes?.data?.data?.accessToken || refreshRes?.data?.accessToken;
        const newRefresh = refreshRes?.data?.data?.refreshToken || refreshRes?.data?.refreshToken;
        if (newToken) {
          await setToken(newToken, true);
          if (newRefresh) {
            await setRefreshToken(newRefresh, true);
          }
          original.headers = original.headers || {};
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        }
        throw new Error('No access token in refresh response');
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
