import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { strings } from '@/content/strings';
import * as analytics from '@/utils/analytics';
import { ProfileGuest } from '../ProfileGuest';
import { RequestsGuest } from '../RequestsGuest';
import { SampleRequest } from '../SampleRequest';

jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(() => Promise.resolve()), selectionAsync: jest.fn(() => Promise.resolve()), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn() } }));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { version: '1.2.3' } } }));

const push = router.push as jest.Mock;
let track: jest.SpyInstance;

beforeEach(() => {
  push.mockClear();
  track = jest.spyOn(analytics, 'track').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

const g = strings.guest;

describe('Requests tab, signed out', () => {
  it('says what the tab is for, what it will show, and offers the three ways forward', async () => {
    await render(<RequestsGuest />);

    expect(screen.getByText(g.requests.headline)).toBeTruthy();
    expect(screen.getByText(g.requests.support)).toBeTruthy();
    expect(screen.getByText(g.requests.benefitsTitle)).toBeTruthy();
    for (const b of g.requests.benefits) expect(screen.getByText(b.title)).toBeTruthy();
    expect(screen.getByLabelText(g.login)).toBeTruthy();
    expect(screen.getByLabelText(g.register)).toBeTruthy();
    expect(screen.getByLabelText(g.browseServices)).toBeTruthy();
  });

  it('claims nothing the product cannot do', async () => {
    await render(<RequestsGuest />);
    const text = JSON.stringify(screen.toJSON()).toLowerCase();
    expect(text).not.toMatch(/escrow|milestone|payment|concierge|24\/7|online now|within \d+|verified|3d|vr |gst|loyalty/);
  });

  it('sends Log in and Create account to the auth screens, remembering to come back to Requests', async () => {
    await render(<RequestsGuest />);
    await fireEvent.press(screen.getByLabelText(g.login));
    expect(push).toHaveBeenLastCalledWith({ pathname: '/login', params: { next: '/requests' } });
    await fireEvent.press(screen.getByLabelText(g.register));
    expect(push).toHaveBeenLastCalledWith({ pathname: '/register', params: { next: '/requests' } });
  });

  it('lets a guest browse Services instead', async () => {
    await render(<RequestsGuest />);
    await fireEvent.press(screen.getByLabelText(g.browseServices));
    expect(push).toHaveBeenLastCalledWith('/services');
  });

  it('records the view and each tap with a source and nothing personal', async () => {
    await render(<RequestsGuest />);
    await fireEvent.press(screen.getByLabelText(g.login));
    await fireEvent.press(screen.getByLabelText(g.register));
    await fireEvent.press(screen.getByLabelText(g.browseServices));

    expect(track.mock.calls.map(([event]) => event)).toEqual([
      { name: 'signed_out_requests_viewed' },
      { name: 'login_tapped', source: 'requests' },
      { name: 'signup_tapped', source: 'requests' },
      { name: 'browse_services_tapped', source: 'requests' },
    ]);
  });
});

describe('the example request', () => {
  it('is the real card, clearly labelled, and has no buttons to press or focus', async () => {
    await render(<SampleRequest />);

    expect(screen.getByText(g.example)).toBeTruthy();
    expect(screen.getByLabelText(g.exampleLabel)).toBeTruthy();
    expect(screen.getByText('Modular Kitchen')).toBeTruthy();
    expect(screen.getAllByText('Quotation ready').length).toBeGreaterThan(0);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('shows no rating or review count, so there is nothing invented to trust', async () => {
    await render(<SampleRequest />);
    expect(screen.getByText('Example professional')).toBeTruthy();
    expect(screen.queryByLabelText(/Rated/)).toBeNull();
    expect(screen.queryByText(/\(\d+\)/)).toBeNull();
  });
});

describe('Profile tab, signed out', () => {
  it('welcomes the guest and offers what works without an account', async () => {
    await render(<ProfileGuest />);

    expect(screen.getByText(g.profile.headline)).toBeTruthy();
    expect(screen.getByText(g.profile.support)).toBeTruthy();
    expect(screen.getByLabelText(g.login)).toBeTruthy();
    expect(screen.getByLabelText(g.register)).toBeTruthy();
    expect(screen.getByText(g.profile.howTitle)).toBeTruthy();
    expect(screen.getByLabelText(g.browseServices)).toBeTruthy();
    expect(screen.getByLabelText(g.browseIdeas)).toBeTruthy();
    expect(screen.getByLabelText(g.rows.help)).toBeTruthy();
    expect(screen.getByText(strings.profile.version('1.2.3'))).toBeTruthy();
  });

  it('hides everything that belongs to an account', async () => {
    await render(<ProfileGuest />);
    for (const label of [strings.profile.rows.notifications, strings.profile.edit, strings.profile.rows.delete, strings.profile.rows.logout, strings.profile.stats.active, strings.profile.stats.completed]) {
      expect(screen.queryByText(label)).toBeNull();
    }
  });

  it('hides Privacy and Terms until their links are configured', async () => {
    await render(<ProfileGuest />);
    expect(screen.queryByLabelText(g.rows.privacy)).toBeNull();
    expect(screen.queryByLabelText(g.rows.terms)).toBeNull();
  });

  it('returns to Profile after login, opens Services from "How Velora works", and browses ideas', async () => {
    await render(<ProfileGuest />);
    await fireEvent.press(screen.getByLabelText(g.login));
    expect(push).toHaveBeenLastCalledWith({ pathname: '/login', params: { next: '/profile' } });

    await fireEvent.press(screen.getByLabelText(new RegExp(g.profile.howTitle)));
    expect(push).toHaveBeenLastCalledWith('/services');

    await fireEvent.press(screen.getByLabelText(g.browseIdeas));
    expect(push).toHaveBeenLastCalledWith('/explore');
  });

  it('records the view once, with no personal data', async () => {
    await render(<ProfileGuest />);
    expect(track.mock.calls.map(([event]) => event)).toEqual([{ name: 'signed_out_profile_viewed' }]);
  });
});
