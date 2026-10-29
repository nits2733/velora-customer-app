/**
 * Form checks that mirror what the backend enforces, so a customer hears about a problem before the
 * round trip. The server stays the authority: these never replace its answer.
 */
import { strings } from '@/content/strings';
import { ApiError } from '@/services/apiClient';

const e = strings.auth.errors;

export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 255;

/** RegisterRequest: 8 to 100 characters with at least one letter and one digit. */
export const isValidPassword = (value: string): boolean =>
  value.length >= 8 && value.length <= 100 && /[A-Za-z]/.test(value) && /\d/.test(value);

/** Optional. The backend allows 20 characters; accept the usual ways of writing a number. */
export const isValidPhone = (value: string): boolean => {
  const v = value.trim();
  return v === '' || (v.length <= 20 && /^\+?[\d\s-]{7,}$/.test(v) && v.replace(/\D/g, '').length >= 7);
};

export const isCode = (value: string): boolean => /^\d{6}$/.test(value.trim());

export const digitsOnly = (value: string, max = 6): string => value.replace(/\D/g, '').slice(0, max);

export interface FieldErrors {
  [field: string]: string | undefined;
}

export const checkEmail = (value: string) => (isEmail(value) ? undefined : e.email);
export const checkNewPassword = (value: string) => (isValidPassword(value) ? undefined : e.passwordRule);
export const checkCode = (value: string) => (isCode(value) ? undefined : e.code);

export const hasErrors = (errors: FieldErrors): boolean => Object.values(errors).some(Boolean);

/**
 * A sentence the customer can act on, for any failure from a sign-in call. The server's own wording is
 * used for 400 to 403 answers (wrong password, wrong or expired code, unverified email), since those
 * are written for people; anything else gets a safe generic line.
 */
export function authErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'WrongAccountTypeError') return strings.auth.wrongAccount;
  if (error instanceof ApiError) {
    if (error.isNetwork) return strings.requests.error.offlineBody;
    if (error.status === 429) return e.tooMany;
    const fields = error.body?.fieldErrors?.map((f) => f.message).filter(Boolean);
    if (fields?.length) return fields.join(' ');
    if (error.status >= 400 && error.status < 500 && error.message) return error.message;
  }
  return strings.detail.genericError;
}

/** The backend refuses to log in an unverified address with this message; send the customer to the code screen. */
export const isUnverifiedEmailError = (error: unknown): boolean =>
  error instanceof ApiError && /not verified/i.test(error.message);
