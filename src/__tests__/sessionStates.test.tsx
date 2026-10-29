import { act, render, screen } from '@testing-library/react-native';
import { strings } from '@/content/strings';
import { sessionStore } from '@/session/sessionStore';
import { tokenStore } from '@/session/tokenStore';
import ProfileScreen from '@/app/(tabs)/profile';
import RequestsScreen from '@/app/(tabs)/requests';

jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(() => Promise.resolve()), selectionAsync: jest.fn(() => Promise.resolve()), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn() } }));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { version: '1.2.3' } } }));
jest.mock('@/components/layout/FloatingTabBar', () => ({ useTabBarSpace: () => 80 }));
jest.mock('@/hooks/useTopPad', () => ({ useTopPad: () => 16 }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

// The data hooks are replaced with empty answers: these tests are about which screen shows for which
// session, and that a guest or a loading session never reaches the data.
const mockEmptyCounts = { PENDING_ASSIGNMENT: 0, PENDING: 0, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0 };
const mockEnabledArgs: Record<string, boolean | undefined> = {};
jest.mock('@/hooks/useRequests', () => ({
  useIsOffline: () => false,
  useRequestCounts: (enabled?: boolean) => {
    mockEnabledArgs.counts = enabled;
    return { data: { byStatus: mockEmptyCounts, awaitingQuotationResponse: 0 }, refetch: jest.fn() };
  },
  useRequestList: (_tab: string, enabled?: boolean) => {
    mockEnabledArgs.list = enabled;
    return {
      data: { pages: [{ content: [], page: 0, totalElements: 0, last: true }] },
      isPending: false, isError: false, isFetching: false, isFetchingNextPage: false, hasNextPage: false,
      fetchNextPage: jest.fn(), refetch: jest.fn(),
    };
  },
  usePinnedRequests: (enabled?: boolean) => {
    mockEnabledArgs.pinned = enabled;
    return { data: { content: [] }, isPending: false, refetch: jest.fn() };
  },
}));
jest.mock('@/hooks/useAccount', () => ({
  useProfile: () => ({ data: { id: 7, email: 'anita@example.com', fullName: 'Anita Verma', phone: null, avatarUrl: null, createdAt: null }, isPending: false, isError: false, refetch: jest.fn() }),
  useUnreadCount: () => ({ data: 0, refetch: jest.fn() }),
}));

const user = { id: 7, email: 'anita@example.com', fullName: 'Anita Verma' };
const g = strings.guest;

beforeEach(() => {
  sessionStore.reset();
  for (const key of Object.keys(mockEnabledArgs)) delete mockEnabledArgs[key];
  jest.spyOn(tokenStore, 'load').mockResolvedValue(null);
  jest.spyOn(tokenStore, 'save').mockResolvedValue();
  jest.spyOn(tokenStore, 'clear').mockResolvedValue();
});
afterEach(() => jest.restoreAllMocks());

const signedOut = () => sessionStore.init();
const signedIn = () => sessionStore.signIn({ accessToken: 'a', refreshToken: 'r', user });

describe('Requests tab by session', () => {
  it('loading: a placeholder, with no guest screen and no data fetched', async () => {
    await render(<RequestsScreen />);
    expect(screen.getByLabelText('Loading your requests')).toBeTruthy();
    expect(screen.queryByText(g.requests.headline)).toBeNull();
    expect(screen.queryByLabelText(g.login)).toBeNull();
    expect(mockEnabledArgs).toMatchObject({ counts: false, list: false, pinned: false });
  });

  it('signed out: the guest screen, and no data fetched', async () => {
    await signedOut();
    await render(<RequestsScreen />);
    expect(screen.getByText(g.requests.headline)).toBeTruthy();
    expect(screen.getByLabelText(g.login)).toBeTruthy();
    expect(screen.queryByText(strings.requests.tabs.active)).toBeNull();
    expect(mockEnabledArgs).toMatchObject({ counts: false, list: false, pinned: false });
  });

  it('signed in: the real tab, with data enabled and no guest screen', async () => {
    await signedIn();
    await render(<RequestsScreen />);
    expect(screen.getByLabelText(/^Active/)).toBeTruthy();
    expect(screen.queryByText(g.requests.headline)).toBeNull();
    expect(screen.queryByLabelText(g.login)).toBeNull();
    expect(mockEnabledArgs).toMatchObject({ counts: true, list: true, pinned: true });
  });

  it('never flashes the guest screen for a customer who was already signed in: it shows the placeholder first', async () => {
    await render(<RequestsScreen />);
    expect(screen.queryByText(g.requests.headline)).toBeNull();
    await act(async () => {
      await signedIn();
    });
    expect(screen.queryByText(g.requests.headline)).toBeNull();
    expect(screen.getByLabelText(/^Active/)).toBeTruthy();
  });
});

describe('Profile tab by session', () => {
  it('loading: a placeholder, with neither the guest nor the account screen', async () => {
    await render(<ProfileScreen />);
    expect(screen.queryByText(g.profile.headline)).toBeNull();
    expect(screen.queryByLabelText(g.login)).toBeNull();
    expect(screen.queryByText(strings.profile.edit)).toBeNull();
  });

  it('signed out: the guest screen without any account row', async () => {
    await signedOut();
    await render(<ProfileScreen />);
    expect(screen.getByText(g.profile.headline)).toBeTruthy();
    expect(screen.getByLabelText(g.login)).toBeTruthy();
    expect(screen.queryByText(strings.profile.edit)).toBeNull();
    expect(screen.queryByText(strings.profile.rows.logout)).toBeNull();
    expect(mockEnabledArgs.counts).toBe(false);
  });

  it('signed in: the account screen, and no guest screen', async () => {
    await signedIn();
    await render(<ProfileScreen />);
    expect(screen.getByText('Anita Verma')).toBeTruthy();
    expect(screen.getByText(strings.profile.edit)).toBeTruthy();
    expect(screen.getByLabelText(strings.profile.rows.logout)).toBeTruthy();
    expect(screen.queryByText(g.profile.headline)).toBeNull();
    expect(screen.queryByLabelText(g.login)).toBeNull();
    expect(mockEnabledArgs.counts).toBe(true);
  });
});
