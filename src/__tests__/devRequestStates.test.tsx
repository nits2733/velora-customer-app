import { render, screen } from '@testing-library/react-native';
import { strings } from '@/content/strings';
import DevRequestStates from '@/app/dev-request-states';

jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(() => Promise.resolve()), selectionAsync: jest.fn(() => Promise.resolve()), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-router', () => {
  const { Text } = jest.requireActual('react-native');
  return { router: { push: jest.fn(), replace: jest.fn() }, Redirect: ({ href }: { href: string }) => <Text>{`redirect:${href}`}</Text> };
});
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

const g = globalThis as unknown as { __DEV__: boolean };
const original = g.__DEV__;
afterEach(() => {
  g.__DEV__ = original;
});

describe('dev request-state preview', () => {
  it('shows every one of the nine states with the real card, plus the edge cases', async () => {
    g.__DEV__ = true;
    await render(<DevRequestStates />);

    const s = strings.requests;
    // Nine distinct next-line or status expressions across the fixtures.
    for (const text of [s.state.finding, s.state.quote_ready, s.state.quote_declined, s.state.waiting_confirm, s.state.confirmed, s.state.cancelled, s.state.unknown]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText(s.state.completed).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByLabelText('Rate your experience')).toBeTruthy();
    expect(screen.getByText('Edge cases')).toBeTruthy();
    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('does nothing in a release build: it sends the visitor to Requests and loads no fixtures', async () => {
    g.__DEV__ = false;
    await render(<DevRequestStates />);

    expect(screen.getByText('redirect:/requests')).toBeTruthy();
    expect(screen.queryByText('Edge cases')).toBeNull();
  });
});
