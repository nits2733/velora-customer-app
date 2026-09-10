import { api } from './client'
import type {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  GoogleLoginRequest,
  AuthResponse,
  OtpResponse,
  ForgotPasswordResponse,
  ResetTokenResponse,
  MessageResponse,
} from './types'

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<OtpResponse>('/api/auth/register', data),

  verifyEmail: (data: VerifyOtpRequest) =>
    api.post<AuthResponse>('/api/auth/verify-email', data),

  resendVerificationOtp: (data: ForgotPasswordRequest) =>
    api.post<MessageResponse>('/api/auth/resend-verification-otp', data),

  login: (data: LoginRequest) =>
    api.post<OtpResponse>('/api/auth/login', data),

  verifyLoginOtp: (data: VerifyOtpRequest) =>
    api.post<AuthResponse>('/api/auth/verify-login-otp', data),

  // No OTP step — Google already verified the user's email. Response is a
  // full AuthResponse, same shape as verify-login-otp/verify-email.
  google: (data: GoogleLoginRequest) =>
    api.post<AuthResponse>('/api/auth/google', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ForgotPasswordResponse>('/api/auth/forgot-password', data),

  verifyResetOtp: (data: VerifyResetOtpRequest) =>
    api.post<ResetTokenResponse>('/api/auth/verify-reset-otp', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<MessageResponse>('/api/auth/reset-password', data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<void>('/api/auth/password/change', data),

  refresh: (data: RefreshTokenRequest) =>
    api.post<AuthResponse>('/api/auth/refresh', data),

  logout: (data: RefreshTokenRequest) =>
    api.post<void>('/api/auth/logout', data),

  logoutAll: () =>
    api.post<void>('/api/auth/logout-all'),
}
