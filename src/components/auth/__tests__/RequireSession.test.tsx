import { render, screen } from '@testing-library/react-native';
import { Text, Text as mockText } from 'react-native';
import { sessionStore } from '@/session/sessionStore';
import { tokenStore } from '@/session/tokenStore';
import { RequireSession } from '../RequireSession';

jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: unknown }) => {
    const T = mockText;
    return <T>{`REDIRECT ${JSON.stringify(href)}`}</T>;
  },
}));

const user = { id: 7, email: 'anita@example.com', fullName: 'Anita Verma' };

beforeEach(() => {
  sessionStore.reset();
  jest.spyOn(tokenStore, 'save').mockResolvedValue();
  jest.spyOn(tokenStore, 'clear').mockResolvedValue();
  jest.spyOn(tokenStore, 'load').mockResolvedValue(null);
});
afterEach(() => jest.restoreAllMocks());

const guarded = () => (
  <RequireSession next="/request/42">
    <Text>PRIVATE</Text>
  </RequireSession>
);

describe('RequireSession', () => {
  it('shows nothing private while the saved session is being restored', async () => {
    await render(guarded());
    expect(screen.queryByText('PRIVATE')).toBeNull();
    expect(screen.queryByText(/REDIRECT/)).toBeNull();
  });

  it('sends a guest to log in, then back to where they were going', async () => {
    await sessionStore.init();
    await render(guarded());
    expect(screen.queryByText('PRIVATE')).toBeNull();
    expect(screen.getByText(/REDIRECT/).props.children).toBe(
      'REDIRECT ' + JSON.stringify({ pathname: '/login', params: { next: '/request/42' } }),
    );
  });

  it('shows the screen to a signed-in customer', async () => {
    await sessionStore.signIn({ accessToken: 'a', refreshToken: 'r', user });
    await render(guarded());
    expect(screen.getByText('PRIVATE')).toBeTruthy();
    expect(screen.queryByText(/REDIRECT/)).toBeNull();
  });
});
