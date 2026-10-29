/**
 * The one place that decides how a request looks and what it offers. Everything in the Requests list
 * and detail reads from `presentRequest`; nothing else branches on raw statuses.
 *
 * Inputs are the booking status and the quotation status the server reports for the viewer (a draft
 * quotation is never reported to a customer). Colour is never the only signal: every state has an
 * icon and a text label.
 *
 * Quotation validity is deliberately absent. The server does not enforce it, so it cannot decide what
 * the customer may do; the detail screen shows the date as plain text only.
 */
import type { IconName } from '@/content/services';
import type { Booking, BookingStatus, QuotationStatus, Unknown } from '@/types/requests';

export type Tone = 'green' | 'amber' | 'red' | 'grey';

export type StateKey =
  | 'finding'
  | 'quote_ready'
  | 'quote_declined'
  | 'waiting_confirm'
  | 'confirmed'
  | 'completed'
  | 'completed_unreviewed'
  | 'cancelled'
  | 'unknown';

/** What a card can offer. "cancel" is always secondary: a destructive action is never the main button. */
export type CardAction = 'view' | 'viewQuotation' | 'rate' | 'cancel' | 'support';

export type ChipKey = 'received' | 'accepted' | 'declined';

export interface StateConfig {
  tone: Tone;
  icon: IconName;
}

export const STATE_CONFIG: Record<StateKey, StateConfig> = {
  finding: { tone: 'grey', icon: 'search' },
  quote_ready: { tone: 'amber', icon: 'file-text' },
  quote_declined: { tone: 'grey', icon: 'file-minus' },
  waiting_confirm: { tone: 'grey', icon: 'clock' },
  confirmed: { tone: 'green', icon: 'check-circle' },
  completed: { tone: 'green', icon: 'check-circle' },
  completed_unreviewed: { tone: 'green', icon: 'check-circle' },
  cancelled: { tone: 'red', icon: 'x-circle' },
  unknown: { tone: 'grey', icon: 'info' },
};

export const PROGRESS_STEPS = ['submitted', 'matched', 'confirmed', 'completed'] as const;
export type ProgressStep = (typeof PROGRESS_STEPS)[number];

export interface QuotationChip {
  key: ChipKey;
  tone: Tone;
}

export interface RequestPresentation {
  key: StateKey;
  tone: Tone;
  icon: IconName;
  /** How many of the four steps are done (1 to 4), or null when no bar should show. */
  progress: number | null;
  /** Shown under "Action needed" at the top of the list. */
  pinned: boolean;
  primary: CardAction;
  secondary: CardAction | null;
  chip: QuotationChip | null;
  canCancel: boolean;
  /** The only button a list card may show: the customer has something to do. Null means the card has none. */
  cardAction: 'viewQuotation' | 'rate' | null;
  /** Key of the "what's next" line, or null when the state has none (finished and unknown requests). */
  next: NextKey | null;
}

export type NextKey = 'finding' | 'waiting_confirm' | 'confirmed' | 'quote_ready' | 'quote_declined';
const NEXT_KEYS: readonly StateKey[] = ['finding', 'waiting_confirm', 'confirmed', 'quote_ready', 'quote_declined'];

type Input = Pick<Booking, 'status' | 'quotationStatus' | 'reviewed'>;

const ACTIVE: readonly BookingStatus[] = ['PENDING_ASSIGNMENT', 'PENDING', 'CONFIRMED'];
const PAST: readonly BookingStatus[] = ['COMPLETED', 'CANCELLED'];

export const ACTIVE_STATUSES = ACTIVE;
export const PAST_STATUSES = PAST;

export const isActiveStatus = (status: BookingStatus | Unknown): boolean => (ACTIVE as readonly string[]).includes(status);

/** Anything unrecognised counts as active so the customer still sees it. */
export type RequestTab = 'active' | 'past';
export const tabOf = (status: BookingStatus | Unknown): RequestTab =>
  (PAST as readonly string[]).includes(status) ? 'past' : 'active';

function chipFor(status: BookingStatus | Unknown, quotation: QuotationStatus | null): QuotationChip | null {
  if (!quotation || status === 'CANCELLED' || status === 'UNKNOWN') return null;
  switch (quotation) {
    case 'SENT':
      // The pill already says "Quotation ready"; a second chip would repeat it.
      return null;
    case 'ACCEPTED':
      return { key: 'accepted', tone: 'green' };
    case 'REJECTED':
      return { key: 'declined', tone: 'grey' };
    default:
      // A draft is never shown to a customer; if one slips through, say nothing about it.
      return null;
  }
}

function build(
  key: StateKey,
  rest: Partial<Omit<RequestPresentation, 'key' | 'tone' | 'icon'>> & Pick<RequestPresentation, 'primary'>,
  input: Input,
): RequestPresentation {
  return {
    key,
    ...STATE_CONFIG[key],
    progress: null,
    pinned: false,
    secondary: null,
    chip: chipFor(input.status, input.quotationStatus),
    canCancel: (ACTIVE as readonly string[]).includes(input.status),
    ...rest,
    cardAction: rest.primary === 'viewQuotation' || rest.primary === 'rate' ? rest.primary : null,
    next: NEXT_KEYS.includes(key) ? (key as NextKey) : null,
  };
}

export function presentRequest(input: Input): RequestPresentation {
  const { status, quotationStatus } = input;

  switch (status) {
    case 'CANCELLED':
      // How far it got is not known from the list data, so no bar: the detail timeline has the facts.
      return build('cancelled', { primary: 'view' }, input);

    case 'COMPLETED':
      return build(
        input.reviewed ? 'completed' : 'completed_unreviewed',
        { progress: 4, primary: input.reviewed ? 'view' : 'rate' },
        input,
      );

    case 'PENDING_ASSIGNMENT':
      return build('finding', { progress: 1, primary: 'view', secondary: 'cancel' }, input);

    case 'PENDING':
    case 'CONFIRMED': {
      const progress = status === 'PENDING' ? 2 : 3;
      if (quotationStatus === 'SENT') {
        return build('quote_ready', { progress, pinned: true, primary: 'viewQuotation' }, input);
      }
      if (quotationStatus === 'REJECTED') {
        return build('quote_declined', { progress, primary: 'support', secondary: 'cancel' }, input);
      }
      return status === 'PENDING'
        ? build('waiting_confirm', { progress, primary: 'view', secondary: 'cancel' }, input)
        : build('confirmed', { progress, primary: 'view', secondary: 'cancel' }, input);
    }

    default:
      return build('unknown', { primary: 'view' }, input);
  }
}

/**
 * What may sit under "Action needed": an active request with a sent quotation the customer has not
 * answered. The server already filters by this; checking again means a stale or old server can never
 * fill the section with requests that need nothing. Each request appears once.
 */
export function actionNeededOnly<T extends Pick<Booking, 'id' | 'status' | 'quotationStatus'>>(items: readonly T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (item.quotationStatus !== 'SENT' || !isActiveStatus(item.status)) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/** Items that are already pinned under "Action needed" are not repeated in the Active list. */
export function withoutPinned<T extends { id: number }>(items: readonly T[], pinned: readonly { id: number }[]): T[] {
  if (!pinned.length) return [...items];
  const ids = new Set(pinned.map((p) => p.id));
  return items.filter((item) => !ids.has(item.id));
}

export interface TabCounts {
  active: number;
  past: number;
}

/** Counts come from the server's per-status totals; pinned items are active, so they stay in the Active count. */
export function tabCounts(byStatus: Record<BookingStatus, number>): TabCounts {
  const sum = (statuses: readonly BookingStatus[]) => statuses.reduce((total, s) => total + (byStatus[s] ?? 0), 0);
  return { active: sum(ACTIVE), past: sum(PAST) };
}

/**
 * Whether to show the "no requests yet" empty state. An Active list that only held pinned items is
 * not empty, even though nothing is left once they are removed from it.
 */
export function isEmptyTab(args: { listCount: number; pinnedCount: number; loading: boolean }): boolean {
  return !args.loading && args.listCount === 0 && args.pinnedCount === 0;
}
