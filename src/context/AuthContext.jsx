/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import api, { setAuthFailureHandler } from '../api/axios';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../api/tokens';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const normalizeUser = (user) => ({
  id: user?.id ?? null,
  username: user?.username || user?.firstName || user?.emailAddress || 'User',
  email: user?.email || user?.primaryEmailAddress?.emailAddress || '',
  avatar_url: user?.avatar_url || user?.imageUrl || null,
});

const isAuthErrorStatus = (status) => status === 401 || status === 403;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { getToken: getClerkToken } = useClerkAuth();

  const [localUser, setLocalUser] = useState(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  const applySession = useCallback((payload) => {
    if (!payload?.access || !payload?.refresh || !payload?.user) {
      throw new Error('Invalid auth payload');
    }

    setAccessToken(payload.access);
    setRefreshToken(payload.refresh);
    setLocalUser(normalizeUser(payload.user));
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setLocalUser(null);
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
    if (isClerkSignedIn) {
      await clerkSignOut();
    }
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch {
      // Ignore
    } finally {
      clearSession();
      navigate('/', { replace: true });
    }
  }, [clearSession, isClerkSignedIn, clerkSignOut, navigate]);

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
          setIsLoadingLocal(false);
        }
        return;
      }

      try {
        const response = await api.get('/auth/me/');
        if (!isActive) return;
        setLocalUser(normalizeUser(response.data));
      } catch (error) {
        if (!isActive) return;
        if (isAuthErrorStatus(error?.response?.status)) {
          clearSession();
        }
      } finally {
        if (isActive) {
          setIsLoadingLocal(false);
        }
      }
    };

    hydrateUser();

    return () => {
      isActive = false;
    };
  }, [clearSession]);

  const activeUser = isClerkSignedIn && clerkUser ? normalizeUser(clerkUser) : localUser;
  const isAuthenticated = Boolean(isClerkSignedIn || localUser || getAccessToken() || getRefreshToken());
  const isLoading = !isClerkLoaded || (isLoadingLocal && !isClerkSignedIn);

  const value = useMemo(() => ({
    user: activeUser,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    getClerkToken,
  }), [activeUser, isAuthenticated, isLoading, login, logout, register, getClerkToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
