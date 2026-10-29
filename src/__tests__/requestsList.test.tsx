import { render, screen } from '@testing-library/react-native';
import { strings } from '@/content/strings';
import { sessionStore } from '@/session/sessionStore';
import { tokenStore } from '@/session/tokenStore';
import { parseBooking, type Booking } from '@/types/requests';
import RequestsScreen from '@/app/(tabs)/requests';

jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(() => Promise.resolve()), selectionAsync: jest.fn(() => Promise.resolve()), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn() } }));
jest.mock('@/components/layout/FloatingTabBar', () => ({ useTabBarSpace: () => 80 }));
jest.mock('@/hooks/useTopPad', () => ({ useTopPad: () => 16 }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

// What the data hooks answer is set per test: these tests are about how the screen sorts that data into
// "Action needed", the list and the empty state, not about the network.
let mockList: Booking[] = [];
let mockPinned: Booking[] = [];
let mockLoading = false;
jest.mock('@/hooks/useRequests', () => ({
  useIsOffline: () => false,
  useRequestCounts: () => ({ data: { byStatus: { PENDING_ASSIGNMENT: 0, PENDING: 0, CONFIRMED: 0, CANCELLED: 0, COMPLETED: 0 }, awaitingQuotationResponse: 0 }, refetch: jest.fn() }),
  useRequestList: () => ({
    data: mockLoading ? undefined : { pages: [{ content: mockList, page: 0, totalElements: mockList.length, last: true }] },
    isPending: mockLoading, isError: false, isFetching: false, isFetchingNextPage: false, hasNextPage: false,
    fetchNextPage: jest.fn(), refetch: jest.fn(),
  }),
  usePinnedRequests: () => ({ data: mockLoading ? undefined : { content: mockPinned }, isPending: mockLoading, refetch: jest.fn() }),
}));

const year = new Date().getFullYear();
const make = (id: number, fields: Partial<Parameters<typeof parseBooking>[0]>) =>
  parseBooking({
    id, requestType: 'INDIVIDUAL_SERVICE', categoryName: `Service ${id}`, location: 'Pune', status: 'PENDING_ASSIGNMENT',
    scheduledAt: new Date(year, 10, 2).toISOString(), createdAt: new Date(year, 8, id).toISOString(), ...fields,
  });
const finding = (id: number) => make(id, {});
const quoted = (id: number) => make(id, { status: 'PENDING', quotationStatus: 'SENT' });

beforeEach(async () => {
  mockList = [];
  mockPinned = [];
  mockLoading = false;
  sessionStore.reset();
  jest.spyOn(tokenStore, 'save').mockResolvedValue();
  jest.spyOn(tokenStore, 'clear').mockResolvedValue();
  await sessionStore.signIn({ accessToken: 'a', refreshToken: 'r', user: { id: 7, email: 'anita@example.com', fullName: 'Anita Verma' } });
});
afterEach(() => jest.restoreAllMocks());

const r = strings.requests;

describe('Requests list: the "Action needed" section', () => {
  it('appears, with its count, only for requests that have a sent quotation', async () => {
    mockPinned = [quoted(30), quoted(31)];
    mockList = [finding(22)];
    await render(<RequestsScreen />);

    expect(screen.getByText(`${r.actionNeeded} (2)`)).toBeTruthy();
    expect(screen.getByText('Service 30')).toBeTruthy();
    expect(screen.getByText('Service 22')).toBeTruthy();
  });

  it('is absent, header included, when nothing needs action', async () => {
    mockPinned = [];
    mockList = [finding(22), finding(21)];
    await render(<RequestsScreen />);

    expect(screen.queryByText(new RegExp(r.actionNeeded))).toBeNull();
    expect(screen.getByText('Service 22')).toBeTruthy();
  });

  it('is absent when an old server ignores the filter and sends back every request (the "Action needed (8)" bug)', async () => {
    const everything = Array.from({ length: 8 }, (_, i) => finding(i + 1));
    mockPinned = everything;
    mockList = everything;
    await render(<RequestsScreen />);

    expect(screen.queryByText(new RegExp(r.actionNeeded))).toBeNull();
    // They are ordinary active requests, so they stay in the list (the list renders a few at a time).
    expect(screen.getByText('Service 1')).toBeTruthy();
    expect(screen.queryByText(r.empty.activeTitle)).toBeNull();
  });

  it('lists a request once: under Action needed, not again in the Active list', async () => {
    const q = quoted(30);
    mockPinned = [q];
    mockList = [q, finding(22)];
    await render(<RequestsScreen />);

    expect(screen.getAllByText('Service 30')).toHaveLength(1);
    expect(screen.getByText('Service 22')).toBeTruthy();
  });

  it('keeps the screen out of the empty state when only action-needed requests exist', async () => {
    const q = quoted(30);
    mockPinned = [q];
    mockList = [q];
    await render(<RequestsScreen />);

    expect(screen.getByText(`${r.actionNeeded} (1)`)).toBeTruthy();
    expect(screen.queryByText(r.empty.activeTitle)).toBeNull();
  });
});

describe('Requests list: empty and loading', () => {
  it('shows the empty state when there is nothing to list and nothing needs action', async () => {
    await render(<RequestsScreen />);
    expect(screen.getByText(r.empty.activeTitle)).toBeTruthy();
    expect(screen.queryByText(new RegExp(r.actionNeeded))).toBeNull();
  });

  it('shows skeletons, not the empty state, while loading', async () => {
    mockLoading = true;
    await render(<RequestsScreen />);
    expect(screen.getByLabelText('Loading your requests')).toBeTruthy();
    expect(screen.queryByText(r.empty.activeTitle)).toBeNull();
  });
});
