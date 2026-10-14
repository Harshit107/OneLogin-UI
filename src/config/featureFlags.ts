/**
 * UI Hardcoded Feature Flags
 * Controls feature accessibility directly from the UI.
 */
export const FEATURE_FLAGS = {
  // Move admin functionality behind UI feature flag
  ENABLE_ADMIN_PORTAL: false,

  // Move playground / sandbox behind UI feature flag
  ENABLE_PLAYGROUND: false,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlagKey): boolean => {
  return Boolean(FEATURE_FLAGS[flag]);
};
