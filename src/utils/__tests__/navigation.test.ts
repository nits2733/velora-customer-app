import { router } from 'expo-router';
import { finishSignIn, safeNext } from '../navigation';

jest.mock('expo-router', () => ({ router: { canDismiss: jest.fn(), dismissAll: jest.fn(), replace: jest.fn() } }));

const canDismiss = router.canDismiss as jest.Mock;
const dismissAll = router.dismissAll as jest.Mock;
const replace = router.replace as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe('safeNext: where a customer lands after logging in', () => {
  it.each(['/requests', '/profile', '/request/42', '/notifications', '/edit-profile'])('follows the in-app path %s', (path) => {
    expect(safeNext(path)).toBe(path);
  });

  it.each([
    undefined,
    '',
    'https://evil.example/phish',
    '//evil.example',
    'javascript:alert(1)',
    '/../etc/passwd',
    '/request/42?x=1',
    '/request/%2e%2e',
    'requests',
  ])('falls back to Profile for %s', (value) => {
    expect(safeNext(value)).toBe('/profile');
  });
});

describe('finishSignIn', () => {
  it('closes the sign-in screens, then goes to where the customer was heading', () => {
    canDismiss.mockReturnValue(true);
    finishSignIn('/request/42');
    expect(dismissAll).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith('/request/42');
  });

  it('does not try to close screens when there are none to close', () => {
    canDismiss.mockReturnValue(false);
    finishSignIn('/requests');
    expect(dismissAll).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/requests');
  });

  it('ignores a crafted destination', () => {
    canDismiss.mockReturnValue(false);
    finishSignIn('//evil.example');
    expect(replace).toHaveBeenCalledWith('/profile');
  });
});
