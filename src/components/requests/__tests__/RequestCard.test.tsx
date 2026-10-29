import { fireEvent, render, screen } from '@testing-library/react-native';
import { strings } from '@/content/strings';
import { parseBooking } from '@/types/requests';
import { RequestCard } from '../RequestCard';

jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(() => Promise.resolve()), selectionAsync: jest.fn(() => Promise.resolve()), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

// Dates are built in the current year so the short date reads "11 Sep" whenever the test runs.
const year = new Date().getFullYear();
const created = new Date(year, 8, 11, 12).toISOString();

const base = {
  id: 2047, requestType: 'INDIVIDUAL_SERVICE' as const, categoryName: 'Modular Kitchen', location: 'Pune',
  budgetMin: 500000, budgetMax: 800000, scheduledAt: new Date(year, 10, 2).toISOString(), createdAt: created,
};
const rahul = { id: 3, fullName: 'Rahul Sharma', specialization: 'Interior contractor', averageRating: 4.7, ratingCount: 38 };

const card = async (fields: Partial<Parameters<typeof parseBooking>[0]>) => {
  const onOpen = jest.fn();
  const onSupport = jest.fn();
  await render(<RequestCard booking={parseBooking({ ...base, ...fields })} onOpen={onOpen} onSupport={onSupport} />);
  return { onOpen, onSupport };
};

const openMenu = async () => fireEvent.press(screen.getByLabelText(strings.requests.menu.open('Modular Kitchen')));

describe('RequestCard anatomy', () => {
  it('shows title, location and short date, budget range, one status pill, the id and the professional', async () => {
    await card({ status: 'PENDING', quotationStatus: 'SENT', professional: rahul });

    expect(screen.getByText('Modular Kitchen')).toBeTruthy();
    expect(screen.getByText('Pune · 11 Sep')).toBeTruthy();
    expect(screen.getByText('₹5L–₹8L')).toBeTruthy();
    expect(screen.getByText('Request #2047')).toBeTruthy();
    expect(screen.getAllByText('Quotation ready')).toHaveLength(1);
    expect(screen.getByText('Rahul Sharma')).toBeTruthy();
    expect(screen.getByText('4.7 (38)')).toBeTruthy();
    // No time of day, no type chip repeating the title.
    expect(screen.queryByText(/AM|PM/)).toBeNull();
    expect(screen.queryByText('Individual Service')).toBeNull();
  });

  it('says the step only to a screen reader, not as visible text', async () => {
    await card({ status: 'PENDING', quotationStatus: 'SENT' });
    expect(screen.queryByText(/Step \d of 4/)).toBeNull();
    expect(screen.getByLabelText('Step 2 of 4, matched')).toBeTruthy();
    expect(screen.getByLabelText(/Modular Kitchen\..*Quotation ready\. Step 2 of 4, matched\..*Request #2047/)).toBeTruthy();
  });

  it('is one tappable card, with no "View details" button', async () => {
    const { onOpen } = await card({ status: 'CONFIRMED' });
    expect(screen.queryByText(strings.requests.action.view)).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: /Modular Kitchen\./ }));
    expect(onOpen).toHaveBeenCalledWith(2047);
  });

  it('prints no "null", "₹0" or empty separators when fields are missing', async () => {
    await card({ status: 'PENDING_ASSIGNMENT', budgetMin: 0, budgetMax: 0, location: undefined });
    expect(screen.queryByText(/null|undefined|₹0|^·|·$/)).toBeNull();
    expect(screen.queryByLabelText(/null|undefined|₹0/)).toBeNull();
    expect(screen.getByText('11 Sep')).toBeTruthy();
  });

  it('titles a whole-home project "Full home renovation" without a category', async () => {
    await card({ requestType: 'FULL_HOME_PROJECT', categoryName: undefined, status: 'PENDING_ASSIGNMENT' });
    expect(screen.getByText('Full home renovation')).toBeTruthy();
  });
});

describe('RequestCard by state', () => {
  it('quotation sent: "View quotation" is the one button and opens the quotation', async () => {
    const { onOpen } = await card({ status: 'PENDING', quotationStatus: 'SENT', professional: rahul });
    expect(screen.getByText(strings.requests.next.quote_ready)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('View quotation'));
    expect(onOpen).toHaveBeenCalledWith(2047, 'quotation');
  });

  it('completed and not rated: "Rate your experience" opens the review; once rated there is no button', async () => {
    const first = await card({ status: 'COMPLETED', reviewed: false });
    await fireEvent.press(screen.getByLabelText('Rate your experience'));
    expect(first.onOpen).toHaveBeenCalledWith(2047, 'review');
    await screen.unmount();

    await card({ status: 'COMPLETED', reviewed: true });
    expect(screen.queryByLabelText('Rate your experience')).toBeNull();
    expect(screen.queryAllByRole('button')).toHaveLength(1);
  });

  it.each([
    ['PENDING_ASSIGNMENT', undefined, 'finding'],
    ['PENDING', undefined, 'waiting_confirm'],
    ['CONFIRMED', undefined, 'confirmed'],
    ['PENDING', 'REJECTED', 'quote_declined'],
  ] as const)('%s / %s: says what is next and has no action button', async (status, quotationStatus, key) => {
    await card({ status, quotationStatus });
    expect(screen.getByText(strings.requests.next[key])).toBeTruthy();
    for (const label of [strings.requests.action.viewQuotation, strings.requests.action.rate, strings.requests.action.view]) {
      expect(screen.queryByLabelText(label)).toBeNull();
    }
  });

  it('a declined quotation keeps its quiet "Quotation declined" note beside the pill, never a second pill', async () => {
    await card({ status: 'PENDING', quotationStatus: 'REJECTED' });
    expect(screen.getAllByText('Quotation declined')).toHaveLength(2);
  });

  it('shows "Quotation accepted" without changing the status text', async () => {
    await card({ status: 'PENDING', quotationStatus: 'ACCEPTED' });
    expect(screen.getByText('Waiting for professional to confirm')).toBeTruthy();
    expect(screen.getByText('Quotation accepted')).toBeTruthy();
  });

  it('cancelled: no progress bar, no next line, no menu, no button', async () => {
    await card({ status: 'CANCELLED' });
    expect(screen.getByText('Cancelled')).toBeTruthy();
    expect(screen.queryByLabelText(/^Step \d of 4/)).toBeNull();
    expect(screen.queryByLabelText(/^More options/)).toBeNull();
    expect(screen.queryAllByRole('button')).toHaveLength(1);
  });
});

describe('RequestCard overflow menu', () => {
  it('keeps Cancel off the card: it appears only after opening the menu, never as a text link', async () => {
    await card({ status: 'PENDING_ASSIGNMENT' });
    expect(screen.queryByText(strings.requests.action.cancel)).toBeNull();
    await openMenu();
    expect(screen.getByLabelText(strings.requests.action.cancel)).toBeTruthy();
    expect(screen.getByLabelText(strings.requests.action.support)).toBeTruthy();
  });

  it('Cancel hands off to the request, where the confirmation sheet asks first', async () => {
    const { onOpen } = await card({ status: 'PENDING_ASSIGNMENT' });
    await openMenu();
    await fireEvent.press(screen.getByLabelText(strings.requests.action.cancel));
    expect(onOpen).toHaveBeenCalledWith(2047, 'cancel');
  });

  it('Contact support from the menu asks for support and does not open the request', async () => {
    const { onOpen, onSupport } = await card({ status: 'PENDING', quotationStatus: 'REJECTED' });
    await openMenu();
    await fireEvent.press(screen.getByLabelText(strings.requests.action.support));
    expect(onSupport).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('is offered while a request can still be cancelled, including one with a quotation to review', async () => {
    await card({ status: 'CONFIRMED', quotationStatus: 'SENT' });
    expect(screen.getByLabelText(strings.requests.menu.open('Modular Kitchen'))).toBeTruthy();
  });
});
