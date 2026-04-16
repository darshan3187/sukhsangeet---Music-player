import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from './tokens';

const FALLBACK_API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000/api'
  : 'https://sukhsangeet-api.onrender.com/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL).replace(/\/+$/, '');
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 30000);
const AUTH_TIMEOUT_MS = Number(import.meta.env.VITE_AUTH_TIMEOUT_MS || Math.max(API_TIMEOUT_MS, 45000));

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: AUTH_TIMEOUT_MS,
});

let isRefreshing = false;
let refreshPromise = null;
let subscribers = [];
let authFailureHandler = null;

const notifySubscribers = (token) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const registerSubscriber = (callback) => {
  subscribers.push(callback);
};

const redirectToLogin = () => {
  if (typeof authFailureHandler === 'function') {
    authFailureHandler();
    return;
  }

  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

const isInvalidRefreshStatus = (status) => status === 401 || status === 403;

const isRetryableRefreshError = (error) => {
  const status = error?.response?.status;
  const code = error?.code;

  if (!status) {
    return code === 'ECONNABORTED' || code === 'ERR_NETWORK' || code === 'ERR_BAD_RESPONSE';
  }

  return status >= 500;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();

  if (!refreshToken || !accessToken) {
    throw new Error('Missing tokens');
  }

  let response;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await refreshClient.post(
        '/auth/refresh/',
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      break;
    } catch (error) {
      const shouldRetry = attempt === 0 && isRetryableRefreshError(error);
      if (!shouldRetry) {
        throw error;
      }
    }
  }

  const newAccessToken = response.data?.access;
  if (!newAccessToken) {
    throw new Error('Missing access token');
  }

  setAccessToken(newAccessToken);
  return newAccessToken;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? '';

    const isAuthMutation =
      requestUrl.includes('/auth/login/') ||
      requestUrl.includes('/auth/register/') ||
      requestUrl.includes('/auth/refresh/') ||
      requestUrl.includes('/auth/logout/');

    if (!originalRequest || status !== 401 || originalRequest._retry || isAuthMutation) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing && refreshPromise) {
      return new Promise((resolve, reject) => {
        registerSubscriber((token) => {
          if (!token) {
            reject(error);
            return;
          }

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    refreshPromise = refreshAccessToken()
      .then((token) => {
        notifySubscribers(token);
        return token;
      })
      .catch((refreshError) => {
        const statusCode = refreshError?.response?.status;

        if (isInvalidRefreshStatus(statusCode)) {
          clearTokens();
          redirectToLogin();
        }

        notifySubscribers(null);
        throw refreshError;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

    try {
      const newToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export const setAuthFailureHandler = (handler) => {
  authFailureHandler = handler;
};

export default api;
