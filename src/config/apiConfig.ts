export type EnvironmentMode = 'development' | 'production';

const STORAGE_KEY_ENV = 'onelogin_active_env';
const STORAGE_KEY_CUSTOM_URL = 'onelogin_custom_prod_url';

export const ENV_CONFIG = {
  development: {
    label: 'Development (Local)',
    url: 'http://localhost:5000',
    description: 'Local Node.js OneLogin API instance',
    badgeClass: 'badge-dev',
  },
  production: {
    label: 'Production (Live)',
    url: 'https://onelogin.harshit.dev', // Can be customized by user
    description: 'Cloud deployed OneLogin SSO Server',
    badgeClass: 'badge-prod',
  },
};

/**
 * Get currently selected environment
 */
export const getEnvironment = (): EnvironmentMode => {
  const saved = localStorage.getItem(STORAGE_KEY_ENV);
  if (saved === 'production' || saved === 'development') {
    return saved;
  }
  return 'development';
};

/**
 * Get active Base URL
 */
export const getApiBaseUrl = (): string => {
  const env = getEnvironment();
  if (env === 'production') {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_URL);
    return custom ? custom.trim() : ENV_CONFIG.production.url;
  }
  return ENV_CONFIG.development.url;
};

/**
 * Switch environment (Single source of truth)
 */
export const setEnvironment = (mode: EnvironmentMode) => {
  localStorage.setItem(STORAGE_KEY_ENV, mode);
  window.dispatchEvent(new CustomEvent('onelogin_env_change', { detail: { mode, url: getApiBaseUrl() } }));
};

/**
 * Update custom production URL
 */
export const setCustomProductionUrl = (url: string) => {
  localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url);
  window.dispatchEvent(new CustomEvent('onelogin_env_change', { detail: { mode: getEnvironment(), url: getApiBaseUrl() } }));
};

export const getCustomProductionUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_CUSTOM_URL) || ENV_CONFIG.production.url;
};
