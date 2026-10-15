export interface UserToken {
  _id?: string;
  token: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: number;
  isVerified: boolean;
  isAdmin?: boolean;
  userImage?: string;
  tokens: UserToken[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OAuthClient {
  _id?: string;
  client_id: string;
  client_secret?: string; // Only returned on registration
  app_name: string;
  redirect_uris: string[];
  allowed_scopes: string[];
  createdAt?: string;
}

export interface ProjectDetails {
  api: string;
  admin: string;
  name: string;
  maintenance: boolean;
  verification: boolean;
  developer: string[];
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
}

export interface UserInfoResponse {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  email_verified: boolean;
}

export interface QRCodeData {
  code: string;
  token?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  user?: User;
  token?: string;
  API_KEY?: string;
  error?: string;
  code?: number;
  data?: T;
}
