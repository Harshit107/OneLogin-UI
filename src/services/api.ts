import { getApiBaseUrl } from '../config/apiConfig';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import type { User, OAuthClient, ProjectDetails, TokenResponse, UserInfoResponse } from '../types';
import { authStorage } from '../utils/storage';

class ApiService {
  private getHeaders(token?: string, extraHeaders: Record<string, string> = {}): HeadersInit {
    const activeToken = token || authStorage.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        credentials: 'include', // Ensures sso_session cookies are sent and received
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.message || data.error || `HTTP error ${response.status}`;
        throw new Error(errorMsg);
      }

      return data as T;
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error(`Cannot reach OneLogin server at ${baseUrl}. Ensure backend is running.`);
      }
      throw err;
    }
  }

  /* ------------------------------- USER AUTH ------------------------------ */

  async registerUser(userData: { name: string; email: string; password: string; phone?: number; userImage?: string }) {
    return this.request<{ user: User; token: string; message: string }>(API_ENDPOINTS.AUTH.CREATE_USER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: { email: string; password: string }) {
    return this.request<{ user: User; token: string; message: string }>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(token: string) {
    return this.request<{ message: User }>(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
  }

  async checkIsVerified(token: string) {
    return this.request<{ message: boolean }>(API_ENDPOINTS.AUTH.IS_VERIFIED, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
  }

  async sendVerificationEmail(email: string) {
    return this.request<{ msg: string }>(API_ENDPOINTS.AUTH.SEND_VERIFICATION_EMAIL, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmailToken(tokenId: string) {
    return this.request<{ msg: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL(tokenId), {
      method: 'GET',
    });
  }

  async logoutCurrent(token: string) {
    return this.request<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
  }

  async logoutAll(token: string) {
    return this.request<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT_ALL, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
  }

  async logoutAllExceptCurrent(token: string) {
    return this.request<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT_ALL_EXCEPT_CURRENT, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
  }

  async logoutDevice(token: string, tokenToRemove: string) {
    return this.request<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT_DEVICE, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ token: tokenToRemove }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ msg: string; resetToken?: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(params: { token: string; newPassword: string }) {
    return this.request<{ msg: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /* ------------------------------- QR AUTH -------------------------------- */

  async generateQRCode() {
    return this.request<{ message: string }>(API_ENDPOINTS.AUTH.QR_GENERATE, {
      method: 'POST',
    });
  }

  async validateQRCode(code: string) {
    return this.request<{ message: string; token: string }>(API_ENDPOINTS.AUTH.QR_VALIDATE, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async storeQRToken(code: string, token: string) {
    return this.request<{ message: string }>(API_ENDPOINTS.AUTH.QR_STORE_TOKEN, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ code }),
    });
  }

  /* --------------------------------- OAUTH --------------------------------- */

  async registerClient(clientData: { app_name: string; redirect_uris: string[]; allowed_scopes?: string[] }, adminSecret: string) {
    return this.request<OAuthClient>(API_ENDPOINTS.OAUTH.REGISTER_CLIENT, {
      method: 'POST',
      headers: {
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify(clientData),
    });
  }

  async exchangeToken(params: {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri: string;
    code_verifier?: string;
  }) {
    return this.request<TokenResponse>(API_ENDPOINTS.OAUTH.TOKEN, {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'authorization_code',
        ...params,
      }),
    });
  }

  async refreshToken(params: { client_id: string; client_secret: string; refresh_token: string }) {
    return this.request<TokenResponse>(API_ENDPOINTS.OAUTH.TOKEN, {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        ...params,
      }),
    });
  }

  async getUserInfo(accessToken: string) {
    return this.request<UserInfoResponse>(API_ENDPOINTS.OAUTH.USERINFO, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async revokeToken(tokenToRevoke: string, hint?: 'access_token' | 'refresh_token') {
    return this.request<{ message: string }>(API_ENDPOINTS.OAUTH.REVOKE_TOKEN, {
      method: 'POST',
      body: JSON.stringify({
        token: tokenToRevoke,
        token_type_hint: hint,
      }),
    });
  }

  /* ------------------------------- PROJECTS -------------------------------- */

  async createProject(name: string, token: string) {
    return this.request<{ message: string; API_KEY: string }>(API_ENDPOINTS.DEVELOPER.CREATE_PROJECT, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ name }),
    });
  }

  async getProject(projectId: string, token: string) {
    return this.request<{ message: ProjectDetails }>(API_ENDPOINTS.DEVELOPER.GET_PROJECT, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ projectId }),
    });
  }

  async updateProject(
    data: { projectId: string; name?: string; email?: string; maintenance?: boolean; verification?: boolean },
    token?: string
  ) {
    return this.request<{ message: string }>(API_ENDPOINTS.DEVELOPER.UPDATE_PROJECT, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
  }

  async listProjects(token?: string) {
    return this.request<{ message: string; projects: ProjectDetails[] }>('/developer/project/list', {
      method: 'GET',
      headers: this.getHeaders(token),
    });
  }

  async checkIsAdmin(token?: string) {
    return this.request<{ isAdmin: boolean; email: string }>('/users/check/admin', {
      method: 'GET',
      headers: this.getHeaders(token),
    });
  }
}

export const api = new ApiService();
