import { request } from '@/services/apiClient';
import { authService } from '@/services/authService';
import { sessionStore } from '../sessionStore';
import { tokenStore } from '../tokenStore';

jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));

const user = { id: 7, email: 'anita@example.com', fullName: 'Anita Verma' };
const auth = (n: number) => ({
  accessToken: `access-${n}`,
  refreshToken: `refresh-${n}`,
  tokenType: 'Bearer',
  user: { ...user, role: 'CUSTOMER' as const },
});

const res = (status: number, body: unknown = {}) =>
  Promise.resolve({ ok: status < 400, status, text: () => Promise.resolve(JSON.stringify(body)) } as Response);

let fetchMock: jest.Mock;
let stored: { refreshToken: string; user: typeof user } | null;

beforeEach(() => {
  sessionStore.reset();
  stored = null;
  fetchMock = jest.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
  jest.spyOn(tokenStore, 'load').mockImplementation(async () => stored);
  jest.spyOn(tokenStore, 'save').mockImplementation(async (s) => {
    stored = s;
  });
  jest.spyOn(tokenStore, 'clear').mockImplementation(async () => {
    stored = null;
  });
});

afterEach(() => jest.restoreAllMocks());

const state = () => sessionStore.snapshot();
const authHeader = (call: number) => (fetchMock.mock.calls[call][1] as RequestInit).headers as Record<string, string>;

describe('launch', () => {
  it('is signed out when nothing is saved', async () => {
    await sessionStore.init();
    expect(state()).toEqual({ status: 'signedOut', user: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('restores a saved session by refreshing, and keeps the rotated refresh token', async () => {
    stored = { refreshToken: 'refresh-1', user };
    fetchMock.mockReturnValue(res(200, auth(2)));
    await sessionStore.init();
    expect(state()).toEqual({ status: 'signedIn', user });
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)).toEqual({ refreshToken: 'refresh-1' });
    expect(stored?.refreshToken).toBe('refresh-2');
  });

  it('signs out when the server refuses the saved refresh token', async () => {
    stored = { refreshToken: 'revoked', user };
    fetchMock.mockReturnValue(res(401, { message: 'Invalid refresh token' }));
    await sessionStore.init();
    expect(state().status).toBe('signedOut');
    expect(stored).toBeNull();
  });

  it('stays signed in when it simply cannot reach the server', async () => {
    stored = { refreshToken: 'refresh-1', user };
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await sessionStore.init();
    expect(state()).toEqual({ status: 'signedIn', user });
    expect(stored?.refreshToken).toBe('refresh-1');
  });
});

describe('signing in', () => {
  it('keeps only the refresh token and the user on the device, never the access token', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    expect(stored).toEqual({ refreshToken: 'refresh-1', user });
    expect(JSON.stringify(stored)).not.toContain('access-1');
    expect(state().status).toBe('signedIn');
  });
});

describe('an expired access token', () => {
  it('is refreshed once and the request is repeated with the new token', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    fetchMock
      .mockReturnValueOnce(res(401, { message: 'expired' }))
      .mockReturnValueOnce(res(200, auth(2)))
      .mockReturnValueOnce(res(200, { count: 3 }));

    const body = await request<{ count: number }>('/api/notifications/unread-count');

    expect(body.count).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(authHeader(0).Authorization).toBe('Bearer access-1');
    expect(fetchMock.mock.calls[1][0]).toContain('/api/auth/refresh');
    expect(authHeader(1).Authorization).toBeUndefined();
    expect(authHeader(2).Authorization).toBe('Bearer access-2');
    expect(stored?.refreshToken).toBe('refresh-2');
  });

  it('shares one refresh between requests that fail at the same moment', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    let refreshes = 0;
    fetchMock.mockImplementation((url: string, init: RequestInit) => {
      if (url.includes('/api/auth/refresh')) {
        refreshes += 1;
        return res(200, auth(2));
      }
      return (init.headers as Record<string, string>).Authorization === 'Bearer access-2' ? res(200, {}) : res(401, {});
    });

    await Promise.all([request('/api/a'), request('/api/b'), request('/api/c')]);

    expect(refreshes).toBe(1);
  });

  it('signs the customer out, and gives up on the request, when the refresh is refused', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    fetchMock.mockReturnValueOnce(res(401, {})).mockReturnValueOnce(res(401, { message: 'Invalid refresh token' }));

    await expect(request('/api/bookings')).rejects.toMatchObject({ status: 401 });

    expect(state().status).toBe('signedOut');
    expect(stored).toBeNull();
  });

  it('does not treat a wrong password on a sign-in call as an expired session', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    fetchMock.mockReturnValue(res(401, { message: 'Invalid email or password' }));

    await expect(authService.login('a@b.co', 'wrong')).rejects.toMatchObject({ status: 401, message: 'Invalid email or password' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(authHeader(0).Authorization).toBeUndefined();
    expect(state().status).toBe('signedIn');
  });
});

describe('signing out', () => {
  it('ends the session on the server, clears the device, and tells listeners to drop cached data', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    fetchMock.mockReturnValue(res(204));
    const cleared = jest.fn();
    const stop = sessionStore.onSignOut(cleared);

    await sessionStore.signOut();
    stop();

    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)).toEqual({ refreshToken: 'refresh-1' });
    expect(state()).toEqual({ status: 'signedOut', user: null });
    expect(stored).toBeNull();
    expect(cleared).toHaveBeenCalledTimes(1);
  });

  it('still signs out when the server cannot be reached', async () => {
    await sessionStore.signIn({ accessToken: 'access-1', refreshToken: 'refresh-1', user });
    fetchMock.mockRejectedValue(new TypeError('offline'));
    await sessionStore.signOut();
    expect(state().status).toBe('signedOut');
    expect(stored).toBeNull();
  });
});

describe('who may sign in', () => {
  it('refuses a professional or admin account in the customer app, and stores nothing', async () => {
    fetchMock.mockReturnValue(res(200, { ...auth(1), user: { ...user, role: 'PROFESSIONAL' } }));
    await expect(authService.verifyLoginCode('p@example.com', '123456')).rejects.toMatchObject({ name: 'WrongAccountTypeError' });
    expect(stored).toBeNull();
  });

  it('registers customers only, whatever the form says', async () => {
    fetchMock.mockReturnValue(res(201, { message: 'sent', requiresOtp: true }));
    await authService.register({ email: 'a@b.co', password: 'abcdefg1', fullName: 'A B' });
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string).role).toBe('CUSTOMER');
  });

  it('rejects a sign-in answer that is missing tokens', async () => {
    fetchMock.mockReturnValue(res(200, { user: { ...user, role: 'CUSTOMER' } }));
    await expect(authService.verifyLoginCode('a@b.co', '123456')).rejects.toMatchObject({ status: 502 });
  });
});
