import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import { getEnvironment, setEnvironment, getApiBaseUrl } from '../config/apiConfig';
import type { EnvironmentMode } from '../config/apiConfig';

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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('onelogin_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('onelogin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [adminSecret, setAdminSecretState] = useState<string>(
    () => localStorage.getItem('onelogin_admin_secret') || 'super_secret_admin_key'
  );
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
    localStorage.setItem('onelogin_token', newToken);
    localStorage.setItem('onelogin_user', JSON.stringify(newUser));
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
    localStorage.removeItem('onelogin_token');
    localStorage.removeItem('onelogin_user');
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
    localStorage.removeItem('onelogin_token');
    localStorage.removeItem('onelogin_user');
  };

  const refreshProfile = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.getProfile(token);
      if (res && res.message) {
        setUser(res.message);
        localStorage.setItem('onelogin_user', JSON.stringify(res.message));
      }
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminSecret = (secret: string) => {
    setAdminSecretState(secret);
    localStorage.setItem('onelogin_admin_secret', secret);
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
