/**
 * Centralized API Endpoints & Route Constants for OneLogin Platform
 * All network calls in the frontend MUST reference these constants.
 */

export const API_ENDPOINTS = {
  AUTH: {
    CREATE_USER: '/users/create',
    LOGIN: '/users/login',
    PROFILE: '/users/profile',
    IS_VERIFIED: '/users/isVerified',
    SEND_VERIFICATION_EMAIL: '/users/verification/email',
    VERIFY_EMAIL: (tokenId: string) => `/users/verification/email/${tokenId}`,
    LOGOUT: '/users/logout',
    LOGOUT_ALL: '/users/logout/all',
    LOGOUT_ALL_EXCEPT_CURRENT: '/users/logout/all/current',
    LOGOUT_DEVICE: '/users/logout/device',
    QR_GENERATE: '/users/login/qr/store',
    QR_VALIDATE: '/users/login/qr/validate',
    QR_STORE_TOKEN: '/users/login/qr/storetoken',
    FORGOT_PASSWORD: '/users/password/forgot',
    RESET_PASSWORD: '/users/password/reset',
  },
  OAUTH: {
    AUTHORIZE: '/oauth/authorize',
    REGISTER_CLIENT: '/oauth/register-client',
    TOKEN: '/oauth/token',
    USERINFO: '/oauth/userinfo',
    REVOKE_TOKEN: '/oauth/revoke-token',
  },
  DEVELOPER: {
    CREATE_PROJECT: '/developer/project/create',
    GET_PROJECT: '/developer/project/get',
    UPDATE_PROJECT: '/developer/project/update/general',
  },
  SYSTEM: {
    HEALTH_CHECK: '/checkserver',
  },
} as const;
