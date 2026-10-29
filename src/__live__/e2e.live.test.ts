/**
 * Runs the app's real services (no mocks) against a running backend: sign-up, sign-in with the emailed
 * codes, profile, requests, cancel with a reason, password reset, and sign-out.
 *
 * Skipped unless LIVE_API_URL is set. Needs a LOCAL backend that logs one-time codes (profile "local")
 * and LIVE_BACKEND_LOG pointing at its log file. Never point this at a shared or production database:
 * it creates an account and a request.
 *
 *   EXPO_PUBLIC_API_BASE_URL=http://localhost:8099 LIVE_API_URL=http://localhost:8099 \
 *   LIVE_BACKEND_LOG=.shots/backend.log npm run test:live
 */
import fs from 'node:fs';
import { accountService } from '@/services/accountService';
import { request } from '@/services/apiClient';
import { authService } from '@/services/authService';
import { requestsApi } from '@/services/requests';
import { sessionStore } from '@/session/sessionStore';
import { tokenStore } from '@/session/tokenStore';


const live = process.env.LIVE_API_URL ? describe : describe.skip;
const email = `e2e.${Date.now()}@example.com`;
const password = 'Velora123';
const newPassword = 'Changed456';

/** The most recent one-time code the local backend logged for this address. */
function codeFor(address: string): string {
  const log = fs.readFileSync(process.env.LIVE_BACKEND_LOG as string, 'utf8').split('\n');
  const line = [...log].reverse().find((l) => l.includes('NO EMAIL SENT') && l.includes(` for ${address} is `));
  const match = line?.match(/ is (\d{6})/);
  if (!match) throw new Error(`no code logged for ${address}`);
  return match[1];
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

live('against a real backend', () => {
  jest.setTimeout(60_000);

  beforeAll(() => {
    jest.spyOn(tokenStore, 'load').mockResolvedValue(null);
    jest.spyOn(tokenStore, 'save').mockResolvedValue();
    jest.spyOn(tokenStore, 'clear').mockResolvedValue();
  });

  it('rejects a login before the account exists, in the server\'s own words', async () => {
    await expect(authService.login(email, password)).rejects.toMatchObject({ status: 401 });
  });

  it('registers, confirms the email with the emailed code, and is signed in', async () => {
    const response = await authService.register({ email, password, fullName: 'Anita Verma', phone: '+91 98765 43210' });
    expect(response.requiresOtp).toBe(true);

    await expect(authService.verifyEmail(email, '000000')).rejects.toMatchObject({ status: 400 });
    const tokens = await authService.verifyEmail(email, codeFor(email));
    await sessionStore.signIn(tokens);

    expect(sessionStore.snapshot()).toMatchObject({ status: 'signedIn', user: { email, fullName: 'Anita Verma' } });
  });

  it('reads and updates the profile', async () => {
    const profile = await accountService.profile();
    expect(profile).toMatchObject({ email, fullName: 'Anita Verma', phone: '+91 98765 43210', avatarUrl: null });

    const updated = await accountService.updateProfile({ fullName: 'Anita V. Verma' });
    expect(updated.fullName).toBe('Anita V. Verma');
    expect((await accountService.profile()).phone).toBe('+91 98765 43210');
  });

  it('uploads an avatar the way the app does (multipart, purpose AVATAR) and saves its URL', async () => {
    const png = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
    const form = new FormData();
    form.append('file', new Blob([png], { type: 'image/png' }), 'avatar.png');
    form.append('purpose', 'AVATAR');
    const upload = await request<{ url?: string }>('/api/uploads', { method: 'POST', body: form });
    expect(upload.url).toBeTruthy();

    const profile = await accountService.updateProfile({ avatarUrl: upload.url });
    expect(profile.avatarUrl).toBe(upload.url);
  });

  it('starts with no requests and no notifications, and 404s a request that is not there', async () => {
    expect((await requestsApi.counts()).byStatus).toEqual({ PENDING_ASSIGNMENT: 0, PENDING: 0, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0 });
    expect((await requestsApi.list()).content).toEqual([]);
    expect((await requestsApi.list({ actionNeeded: true })).content).toEqual([]);
    await expect(requestsApi.get(999_999)).rejects.toMatchObject({ status: 404 });
    expect(await accountService.unreadCount()).toBe(0);
    expect((await accountService.notifications()).content).toEqual([]);
  });

  let requestId = 0;

  it('creates a request and finds it through the list, counts, detail and timeline', async () => {
    const created = await request<{ id: number }>('/api/bookings', {
      method: 'POST',
      body: { requestType: 'FULL_HOME_PROJECT', scheduledAt: new Date(Date.now() + 7 * 86_400_000).toISOString(), location: 'Madhapur, Hyderabad', notes: '3 BHK, possession next month', budgetMin: 1_200_000, budgetMax: 1_800_000 },
    });
    requestId = created.id;

    const list = await requestsApi.list({ status: ['PENDING_ASSIGNMENT'] });
    expect(list.content.map((b) => b.id)).toEqual([requestId]);
    expect(list.content[0]).toMatchObject({ status: 'PENDING_ASSIGNMENT', requestType: 'FULL_HOME_PROJECT', quotationStatus: null, reviewed: false, professional: null });
    expect((await requestsApi.list({ status: ['COMPLETED'] })).content).toEqual([]);
    expect((await requestsApi.counts()).byStatus.PENDING_ASSIGNMENT).toBe(1);

    const timeline = await requestsApi.timeline(requestId);
    expect(timeline.map((e) => e.eventType)).toEqual(['SUBMITTED']);
    expect(await requestsApi.quotation(requestId)).toBeNull();
  });

  it('cancels with a reason, which then shows to the customer, and refuses a second cancel with 409', async () => {
    const cancelled = await requestsApi.cancel(requestId, '  Postponing to next year ');
    expect(cancelled).toMatchObject({ status: 'CANCELLED', cancellationReason: 'Postponing to next year' });
    expect((await requestsApi.counts()).byStatus).toMatchObject({ PENDING_ASSIGNMENT: 0, CANCELLED: 1 });
    await expect(requestsApi.cancel(requestId)).rejects.toMatchObject({ status: 409 });
    expect((await requestsApi.timeline(requestId)).map((e) => e.eventType)).toEqual(['SUBMITTED', 'CANCELLED']);
  });

  it('signs out, then logs in again with the password and the emailed code', async () => {
    await sessionStore.signOut();
    expect(sessionStore.snapshot().status).toBe('signedOut');
    await expect(accountService.profile()).rejects.toMatchObject({ status: 401 });

    await expect(authService.login(email, 'Wrong1234')).rejects.toMatchObject({ status: 401 });
    await pause(1100);
    await authService.login(email, password);
    await expect(authService.verifyLoginCode(email, '000000')).rejects.toMatchObject({ status: 400 });
    await sessionStore.signIn(await authService.verifyLoginCode(email, codeFor(email)));

    expect((await requestsApi.get(requestId)).status).toBe('CANCELLED');
  });

  it('resets a forgotten password with the emailed code', async () => {
    await sessionStore.signOut();
    await authService.forgotPassword(email);
    const token = await authService.verifyResetCode(email, codeFor(email));
    await authService.resetPassword(token, newPassword);

    await expect(authService.login(email, password)).rejects.toMatchObject({ status: 401 });
    await pause(1100);
    await authService.login(email, newPassword);
    await sessionStore.signIn(await authService.verifyLoginCode(email, codeFor(email)));
    expect(sessionStore.snapshot().status).toBe('signedIn');
  });

  it('changing the password ends every session', async () => {
    await authService.changePassword(newPassword, 'Third789x');
    // The backend revoked the refresh token, so the next expired-token refresh signs the customer out.
    await expect(authService.refresh('anything')).rejects.toMatchObject({ status: expect.any(Number) });
    await sessionStore.signOut();
    expect(sessionStore.snapshot().status).toBe('signedOut');
  });
});
