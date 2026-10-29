import {
  BOOKING_STATUSES,
  ContractError,
  parseBooking,
  parseCounts,
  parsePage,
  parseQuotation,
  parseTimelineEvent,
  type BookingStatus,
} from '@/types/requests';
import { ApiError } from '../../apiClient';
import { seedRecords, type MockRecord } from './mockData';
import type { ListParams, RequestsApi } from '../RequestsApi';

/**
 * Answers from memory, following the server's rules: the same filters and sort order, the same 404 for
 * a request that is not there, the same 409 when an action no longer applies. Everything goes through
 * the real `parse*` functions, so a mock shape that drifts from the contract fails here too.
 */
export type MockScenario = 'normal' | 'empty' | 'error' | 'offline' | 'slow';

let records: MockRecord[] = seedRecords();
let scenario: MockScenario = 'normal';
let nextEventId = 90_000;

/** Dev tools and tests drive the scenario; the screens know nothing about it. */
export const mockControl = {
  get scenario() {
    return scenario;
  },
  set(next: MockScenario) {
    scenario = next;
  },
  reset() {
    records = seedRecords();
    scenario = 'normal';
  },
  latencyMs: 250,
};

const ACTIVE: readonly BookingStatus[] = ['PENDING_ASSIGNMENT', 'PENDING', 'CONFIRMED'];
const isActive = (status: string | undefined) => (ACTIVE as readonly string[]).includes(status ?? '');
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function gate(): Promise<void> {
  await wait(scenario === 'slow' ? 2500 : mockControl.latencyMs);
  if (scenario === 'offline') throw new ApiError('Cannot reach Velora right now. Check your connection.', 0);
  if (scenario === 'error') throw new ApiError('Something went wrong on our side.', 500);
}

function find(id: number): MockRecord {
  const record = records.find((r) => r.booking.id === id);
  // Same answer whether it does not exist or belongs to someone else.
  if (!record) throw new ApiError(`Booking not found: ${id}`, 404);
  return record;
}

function event(record: MockRecord, eventType: NonNullable<MockRecord['timeline'][number]['eventType']>, toStatus: BookingStatus) {
  record.timeline.push({
    id: nextEventId++,
    eventType,
    fromStatus: record.booking.status,
    toStatus,
    createdAt: new Date().toISOString(),
  });
}

function conflict(message: string): never {
  throw new ApiError(message, 409);
}

export const mockRequestsApi: RequestsApi = {
  async list({ status, actionNeeded, page = 0, size = 20 }: ListParams = {}) {
    await gate();
    const wanted: readonly string[] = status?.length ? status : BOOKING_STATUSES;
    const rows = scenario === 'empty' ? [] : records
      .filter(({ booking }) => wanted.includes(booking.status ?? ''))
      .filter(({ booking }) => !actionNeeded || (isActive(booking.status) && booking.quotationStatus === 'SENT'))
      .sort((a, b) => (b.booking.createdAt ?? '').localeCompare(a.booking.createdAt ?? '') || (b.booking.id ?? 0) - (a.booking.id ?? 0));
    const start = page * size;
    return parsePage(
      {
        content: rows.slice(start, start + size).map((r) => r.booking),
        page,
        totalElements: rows.length,
        last: start + size >= rows.length,
      },
      parseBooking,
    );
  },

  async counts() {
    await gate();
    const byStatus: Record<string, number> = Object.fromEntries(BOOKING_STATUSES.map((s) => [s, 0]));
    const visible = scenario === 'empty' ? [] : records;
    visible.forEach(({ booking }) => {
      byStatus[booking.status ?? ''] = (byStatus[booking.status ?? ''] ?? 0) + 1;
    });
    const awaiting = visible.filter(({ booking }) => isActive(booking.status) && booking.quotationStatus === 'SENT').length;
    return parseCounts({ byStatus, awaitingQuotationResponse: awaiting });
  },

  async get(id) {
    await gate();
    return parseBooking(find(id).booking);
  },

  async timeline(id) {
    await gate();
    return find(id).timeline.map(parseTimelineEvent);
  },

  async quotation(id) {
    await gate();
    const { quotation } = find(id);
    return quotation ? parseQuotation(quotation) : null;
  },

  async acceptQuotation(id) {
    await gate();
    const record = find(id);
    if (!record.quotation || record.quotation.status !== 'SENT') conflict('Only a sent quotation can be accepted or rejected');
    record.quotation = { ...record.quotation, status: 'ACCEPTED', updatedAt: new Date().toISOString() };
    record.booking = { ...record.booking, quotationStatus: 'ACCEPTED' };
    event(record, 'QUOTATION_ACCEPTED', record.booking.status as BookingStatus);
    return parseQuotation(record.quotation);
  },

  async rejectQuotation(id, reason) {
    await gate();
    const record = find(id);
    if (!record.quotation || record.quotation.status !== 'SENT') conflict('Only a sent quotation can be accepted or rejected');
    record.quotation = {
      ...record.quotation,
      status: 'REJECTED',
      rejectionReason: reason?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    record.booking = { ...record.booking, quotationStatus: 'REJECTED' };
    event(record, 'QUOTATION_REJECTED', record.booking.status as BookingStatus);
    return parseQuotation(record.quotation);
  },

  async cancel(id, reason) {
    await gate();
    const record = find(id);
    if (!isActive(record.booking.status)) conflict(`Cannot cancel a booking with status ${record.booking.status}`);
    event(record, 'CANCELLED', 'CANCELLED');
    record.booking = {
      ...record.booking,
      status: 'CANCELLED',
      cancellationReason: reason?.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    return parseBooking(record.booking);
  },

  async submitReview(id, { rating }) {
    await gate();
    const record = find(id);
    if (record.booking.status !== 'COMPLETED') conflict('Can only review a completed booking');
    if (record.booking.reviewed) conflict('This booking has already been reviewed');
    if (rating < 1 || rating > 5) throw new ContractError('rating must be between 1 and 5');
    record.booking = { ...record.booking, reviewed: true };
  },
};
