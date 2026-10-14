import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import { getEnvironment, setEnvironment, getApiBaseUrl } from '../config/apiConfig';
import type { EnvironmentMode } from '../config/apiConfig';
import { authStorage, adminStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
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

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    authStorage.setAuthSession(newToken, newUser);
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
    authStorage.clearAuthSession();
  };

  const refreshProfile = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.getProfile(token);
      if (res && res.message) {
        setUser(res.message);
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
