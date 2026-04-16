import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthFailureHandler } from '../api/axios';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../api/tokens';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const normalizeUser = (user) => ({
  id: user?.id ?? null,
  username: user?.username ?? '',
  email: user?.email ?? '',
  avatar_url: user?.avatar_url ?? null,
});

const isAuthErrorStatus = (status) => status === 401 || status === 403;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((payload) => {
    if (!payload?.access || !payload?.refresh || !payload?.user) {
      throw new Error('Invalid auth payload');
    }

    setAccessToken(payload.access);
    setRefreshToken(payload.refresh);
    setUser(normalizeUser(payload.user));
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    applySession(response.data);
    return response.data;
  }, [applySession]);

  const register = useCallback(async (username, email, password) => {
    const response = await api.post('/auth/register/', { username, email, password });
    applySession(response.data);
    return response.data;
  }, [applySession]);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } finally {
      clearSession();
      navigate('/login', { replace: true });
    }
  }, [clearSession, navigate]);

  useEffect(() => {
    setAuthFailureHandler(() => {
      clearSession();
      navigate('/login', { replace: true });
    });

    return () => {
      setAuthFailureHandler(null);
    };
  }, [clearSession, navigate]);

  useEffect(() => {
    let isActive = true;

    const hydrateUser = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        if (isActive) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await api.get('/auth/me/');
        if (!isActive) {
          return;
        }
        setUser(normalizeUser(response.data));
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (isAuthErrorStatus(error?.response?.status)) {
          clearSession();
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    hydrateUser();

    return () => {
      isActive = false;
    };
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user || getAccessToken() || getRefreshToken()),
    isLoading,
  }), [isLoading, login, logout, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
