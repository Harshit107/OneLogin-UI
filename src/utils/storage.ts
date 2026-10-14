/**
 * OneLogin Centralized Storage Utilities & Helpers
 * Type-safe, exception-proof localStorage manager for authentication, user profiles, and app configuration.
 */

import type { User } from '../types';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'onelogin_token',
  USER_PROFILE: 'onelogin_user',
  ACTIVE_ENV: 'onelogin_active_env',
  CUSTOM_PROD_URL: 'onelogin_custom_prod_url',
  ADMIN_SECRET: 'onelogin_admin_secret',
  REMEMBERED_EMAIL: 'onelogin_remembered_email',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Checks whether localStorage is available and operational
 */
const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const testKey = '__onelogin_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generic safe getItem with JSON deserialization and fallback
 */
export const getItem = <T>(key: StorageKey | string, fallback: T | null = null): T | null => {
  if (!isStorageAvailable()) return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return fallback;

    // Attempt JSON parse
    try {
      return JSON.parse(item) as T;
    } catch {
      // If parsing fails, return as string primitive
      return item as unknown as T;
    }
  } catch (err) {
    console.warn(`[storage] Error reading key "${key}":`, err);
    return fallback;
  }
};

/**
 * Generic safe setItem with JSON serialization
 */
export const setItem = <T>(key: StorageKey | string, value: T): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.error(`[storage] Error writing key "${key}":`, err);
    return false;
  }
};

/**
 * Safe removeItem
 */
export const removeItem = (key: StorageKey | string): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[storage] Error removing key "${key}":`, err);
    return false;
  }
};

/**
 * Safe clear all app storage keys
 */
export const clearAppStorage = (): void => {
  if (!isStorageAvailable()) return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
};

/**
 * Check if a specific key exists in localStorage
 */
export const hasItem = (key: StorageKey | string): boolean => {
  if (!isStorageAvailable()) return false;
  return window.localStorage.getItem(key) !== null;
};

/* ==========================================================================
   Dedicated Business Helpers for User Authentication & Profile
   ========================================================================== */

export const authStorage = {
  /**
   * Retrieve the active authentication JWT token
   */
  getToken: (): string | null => {
    return getItem<string>(STORAGE_KEYS.AUTH_TOKEN, null);
  },

  /**
   * Save the authentication JWT token
   */
  setToken: (token: string): boolean => {
    return setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Delete the authentication JWT token
   */
  removeToken: (): boolean => {
    return removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Retrieve the cached User Profile object
   */
  getUser: (): User | null => {
    return getItem<User>(STORAGE_KEYS.USER_PROFILE, null);
  },

  /**
   * Save the User Profile object
   */
  setUser: (user: User): boolean => {
    return setItem(STORAGE_KEYS.USER_PROFILE, user);
  },

  /**
   * Delete the User Profile object
   */
  removeUser: (): boolean => {
    return removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  /**
   * Atomically save full session (token + user)
   */
  setAuthSession: (token: string, user: User): void => {
    setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setItem(STORAGE_KEYS.USER_PROFILE, user);
  },

  /**
   * Atomically clear full session on logout
   */
  clearAuthSession: (): void => {
    removeItem(STORAGE_KEYS.AUTH_TOKEN);
    removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  /**
   * Quick check for presence of auth token
   */
  isAuthenticated: (): boolean => {
    const token = authStorage.getToken();
    return Boolean(token && token.trim().length > 0);
  },
};

/* ==========================================================================
   Dedicated Helpers for API Environment Configuration
   ========================================================================== */

export type EnvironmentMode = 'development' | 'production';

export const envStorage = {
  getMode: (): EnvironmentMode => {
    const mode = getItem<string>(STORAGE_KEYS.ACTIVE_ENV);
    if (mode === 'production' || mode === 'development') {
      return mode;
    }
    return 'development';
  },

  setMode: (mode: EnvironmentMode): boolean => {
    return setItem(STORAGE_KEYS.ACTIVE_ENV, mode);
  },

  getCustomUrl: (fallback: string): string => {
    return getItem<string>(STORAGE_KEYS.CUSTOM_PROD_URL, fallback) || fallback;
  },

  setCustomUrl: (url: string): boolean => {
    return setItem(STORAGE_KEYS.CUSTOM_PROD_URL, url);
  },
};

/* ==========================================================================
   Dedicated Helpers for Admin & Developer Preferences
   ========================================================================== */

export const adminStorage = {
  getSecret: (fallback = 'super_secret_admin_key'): string => {
    return getItem<string>(STORAGE_KEYS.ADMIN_SECRET, fallback) || fallback;
  },

  setSecret: (secret: string): boolean => {
    return setItem(STORAGE_KEYS.ADMIN_SECRET, secret);
  },

  removeSecret: (): boolean => {
    return removeItem(STORAGE_KEYS.ADMIN_SECRET);
  },
};

export const preferenceStorage = {
  getRememberedEmail: (): string => {
    return getItem<string>(STORAGE_KEYS.REMEMBERED_EMAIL, '') || '';
  },

  setRememberedEmail: (email: string): boolean => {
    return setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
  },

  removeRememberedEmail: (): boolean => {
    return removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
  },
};
