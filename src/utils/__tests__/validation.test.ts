import { ApiError } from '@/services/apiClient';
import { WrongAccountTypeError } from '@/services/authService';
import { authErrorMessage, digitsOnly, isCode, isEmail, isUnverifiedEmailError, isValidPassword, isValidPhone } from '../validation';

describe('password rule (same as the backend: 8 to 100 characters, a letter and a digit)', () => {
  it.each([
    ['abcdefg1', true],
    ['Passw0rdOK', true],
    ['short1', false],
    ['allletters', false],
    ['12345678', false],
    ['a'.repeat(99) + '1', true],
    ['a'.repeat(100) + '1', false],
    ['', false],
  ])('%s', (password, ok) => expect(isValidPassword(password)).toBe(ok));
});

describe('email, phone and code', () => {
  it('accepts normal addresses and rejects obvious mistakes', () => {
    expect(isEmail('anita.verma@example.com')).toBe(true);
    expect(isEmail(' anita@example.com ')).toBe(true);
    expect(['anita', 'anita@', '@example.com', 'a b@example.com', ''].some(isEmail)).toBe(false);
  });

  it('treats the phone number as optional and allows the usual formats', () => {
    expect(isValidPhone('')).toBe(true);
    expect(isValidPhone('+91 98765 43210')).toBe(true);
    expect(isValidPhone('98765-43210')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('call me')).toBe(false);
    expect(isValidPhone('9'.repeat(21))).toBe(false);
  });

  it('wants exactly six digits for a code, and strips everything else as you type', () => {
    expect(isCode('123456')).toBe(true);
    expect(['12345', '1234567', '12a456', ''].some(isCode)).toBe(false);
    expect(digitsOnly('12 34-56789')).toBe('123456');
  });
});

describe('authErrorMessage', () => {
  it('says plainly when offline', () => {
    expect(authErrorMessage(new ApiError('x', 0))).toMatch(/offline|connection/i);
  });

  it("uses the server's own words for a refused sign-in, code or password", () => {
    expect(authErrorMessage(new ApiError('Invalid email or password', 401))).toBe('Invalid email or password');
    expect(authErrorMessage(new ApiError('OTP has expired', 400))).toBe('OTP has expired');
  });

  it('lists field problems from a 400', () => {
    const error = new ApiError('Validation failed', 400, { fieldErrors: [{ field: 'newPassword', message: 'Password must contain at least one letter and one digit' }] });
    expect(authErrorMessage(error)).toBe('Password must contain at least one letter and one digit');
  });

  it('tells the customer to wait after too many attempts', () => {
    expect(authErrorMessage(new ApiError('slow down', 429))).toMatch(/wait a minute/i);
  });

  it('never shows a server-error message or an unknown failure verbatim', () => {
    expect(authErrorMessage(new ApiError('NullPointerException at line 4', 500))).not.toContain('NullPointer');
    expect(authErrorMessage(new Error('boom'))).not.toContain('boom');
  });

  it('explains when a professional account tries the customer app', () => {
    expect(authErrorMessage(new WrongAccountTypeError())).toMatch(/homeowners/i);
  });

  it('recognises the unverified-email refusal so the app can offer the code screen', () => {
    expect(isUnverifiedEmailError(new ApiError('Email not verified. Check your inbox', 401))).toBe(true);
    expect(isUnverifiedEmailError(new ApiError('Invalid email or password', 401))).toBe(false);
  });
});
