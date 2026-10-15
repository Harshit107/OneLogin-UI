import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import { getEnvironment, setEnvironment, getApiBaseUrl } from '../config/apiConfig';
import type { EnvironmentMode } from '../config/apiConfig';
import { authStorage, adminStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  adminSecret: string;
  environment: EnvironmentMode;
  apiBaseUrl: string;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateAdminSecret: (secret: string) => void;
  toggleEnvironment: (env: EnvironmentMode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [user, setUser] = useState<User | null>(() => authStorage.getUser());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const cached = authStorage.getUser();
    return Boolean(cached?.isAdmin);
  });
  const [adminSecret, setAdminSecretState] = useState<string>(() => adminStorage.getSecret());
  const [environment, setEnvState] = useState<EnvironmentMode>(getEnvironment());
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(getApiBaseUrl());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Listen for environment changes
  useEffect(() => {
    const handleEnvChange = (e: any) => {
      setEnvState(e.detail.mode);
      setApiBaseUrlState(e.detail.url);
    };
    window.addEventListener('onelogin_env_change', handleEnvChange);
    return () => window.removeEventListener('onelogin_env_change', handleEnvChange);
  }, []);

  // Verify admin status on token load
  useEffect(() => {
    if (token) {
      api.checkIsAdmin(token)
        .then((res) => {
          if (res && typeof res.isAdmin === 'boolean') {
            setIsAdmin(res.isAdmin);
            const cached = authStorage.getUser();
            if (cached && cached.isAdmin !== res.isAdmin) {
              const updated = { ...cached, isAdmin: res.isAdmin };
              setUser(updated);
              authStorage.setUser(updated);
            }
          }
        })
        .catch(() => {
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setIsAdmin(Boolean(newUser.isAdmin));
    authStorage.setAuthSession(newToken, newUser);

    // Verify admin status in background
    api.checkIsAdmin(newToken)
      .then((res) => {
        if (res && typeof res.isAdmin === 'boolean') {
          setIsAdmin(res.isAdmin);
          const updated = { ...newUser, isAdmin: res.isAdmin };
          setUser(updated);
          authStorage.setUser(updated);
        }
      })
      .catch(() => {});
  };

  const logout = async () => {
    if (token) {
      try {
        await api.logoutCurrent(token);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    authStorage.clearAuthSession();
  };

  const logoutAll = async () => {
    if (token) {
      try {
        await api.logoutAll(token);
      } catch (err) {
        console.error('Logout all error:', err);
      }
    }
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    authStorage.clearAuthSession();
  };

  const refreshProfile = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.getProfile(token);
      if (res && res.message) {
        setUser(res.message);
        setIsAdmin(Boolean(res.message.isAdmin));
        authStorage.setUser(res.message);
      }
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminSecret = (secret: string) => {
    setAdminSecretState(secret);
    adminStorage.setSecret(secret);
  };

  const toggleEnvironment = (env: EnvironmentMode) => {
    setEnvironment(env);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        adminSecret,
        environment,
        apiBaseUrl,
        isLoading,
        login,
        logout,
        logoutAll,
        refreshProfile,
        updateAdminSecret,
        toggleEnvironment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
