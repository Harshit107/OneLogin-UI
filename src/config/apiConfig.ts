import { envStorage, type EnvironmentMode } from '../utils/storage';

export type { EnvironmentMode };

export const ENV_CONFIG = {
  development: {
    label: 'Development (Local)',
    url: 'http://localhost:5000',
    uiUrl: 'http://localhost:5173',
    description: 'Local Node.js OneLogin API instance',
    badgeClass: 'badge-dev',
  },
  production: {
    label: 'Production (Live)',
    url: 'https://onelogin-api.harshit107.online',
    uiUrl: 'https://account.harshit107.online',
    description: 'Cloud deployed OneLogin SSO Server',
    badgeClass: 'badge-prod',
  },
};

/**
 * Get currently selected environment from centralized envStorage
 */
export const getEnvironment = (): EnvironmentMode => {
  return envStorage.getMode();
};

/**
 * Get active Base URL
 */
export const getApiBaseUrl = (): string => {
  const env = getEnvironment();
  if (env === 'production') {
    return envStorage.getCustomUrl(ENV_CONFIG.production.url);
  }
  return ENV_CONFIG.development.url;
};

/**
 * Switch environment (Single source of truth)
 */
export const setEnvironment = (mode: EnvironmentMode) => {
  envStorage.setMode(mode);
  window.dispatchEvent(new CustomEvent('onelogin_env_change', { detail: { mode, url: getApiBaseUrl() } }));
};

/**
 * Update custom production URL
 */
export const setCustomProductionUrl = (url: string) => {
  envStorage.setCustomUrl(url.trim());
  window.dispatchEvent(new CustomEvent('onelogin_env_change', { detail: { mode: getEnvironment(), url: getApiBaseUrl() } }));
};

export const getCustomProductionUrl = (): string => {
  return envStorage.getCustomUrl(ENV_CONFIG.production.url);
};
