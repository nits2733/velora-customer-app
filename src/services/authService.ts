import type { components } from '@/types/api.generated';
import type { SessionUser } from '@/session/tokenStore';
import { ApiError, request } from './apiClient';

type Schemas = components['schemas'];

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

/** This is the customer app: a professional or admin account cannot sign in here. */
export class WrongAccountTypeError extends Error {
  constructor() {
    super('This app is for homeowners. Please use the Velora professional app.');
    this.name = 'WrongAccountTypeError';
  }
}

export function parseAuth(dto: Schemas['AuthResponse']): AuthTokens {
  const { accessToken, refreshToken, user } = dto;
  if (!accessToken || !refreshToken || user?.id === undefined || !user.email) {
    throw new ApiError('Unexpected response from the server.', 502);
  }
  if (user.role !== 'CUSTOMER') throw new WrongAccountTypeError();
  return { accessToken, refreshToken, user: { id: user.id, email: user.email, fullName: user.fullName ?? '' } };
}

// Every call here is public (a password, a code or a refresh token is the credential), so none of
// them send an access token or trigger a token refresh.
const post = <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body, auth: false });

export const authService = {
  /** Creates a customer account and emails a verification code. The role is always CUSTOMER here. */
  register: (input: { email: string; password: string; fullName: string; phone?: string }) =>
    post<Schemas['OtpResponse']>('/api/auth/register', { ...input, role: 'CUSTOMER' satisfies Schemas['RegisterRequest']['role'] }),

  verifyEmail: async (email: string, otp: string) =>
    parseAuth(await post<Schemas['AuthResponse']>('/api/auth/verify-email', { email, otp })),

  resendVerificationCode: (email: string) => post<Schemas['MessageResponse']>('/api/auth/resend-verification-otp', { email }),

  /** Step one of sign-in: checks the password and emails a one-time code. */
  login: (email: string, password: string) => post<Schemas['OtpResponse']>('/api/auth/login', { email, password }),

  /** Step two of sign-in: the code from the email. */
  verifyLoginCode: async (email: string, otp: string) =>
    parseAuth(await post<Schemas['AuthResponse']>('/api/auth/verify-login-otp', { email, otp })),

  google: async (idToken: string) => parseAuth(await post<Schemas['AuthResponse']>('/api/auth/google', { idToken })),

  forgotPassword: (email: string) => post<Schemas['ForgotPasswordResponse']>('/api/auth/forgot-password', { email }),

  /** Returns the reset token that `resetPassword` needs. */
  verifyResetCode: async (email: string, otp: string) => {
    const dto = await post<Schemas['ResetTokenResponse']>('/api/auth/verify-reset-otp', { email, otp });
    if (!dto.resetToken) throw new ApiError('Unexpected response from the server.', 502);
    return dto.resetToken;
  },

  resetPassword: (resetToken: string, newPassword: string) =>
    post<Schemas['MessageResponse']>('/api/auth/reset-password', { resetToken, newPassword }),

  async refresh(refreshToken: string): Promise<AuthTokens> {
    return parseAuth(await post<Schemas['AuthResponse']>('/api/auth/refresh', { refreshToken }));
  },

  /** Ends this device's session on the server. Safe to call with an unknown token. */
  logout: (refreshToken: string) => post<void>('/api/auth/logout', { refreshToken }),

  /** Needs a signed-in session, so unlike the rest it carries the access token. */
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/api/auth/password/change', { method: 'POST', body: { currentPassword, newPassword } }),
};
