/**
 * Domain types for the Requests tab.
 *
 * The wire shapes come from the generated OpenAPI types (api.generated.ts); nothing here restates the
 * contract by hand. The backend does not mark any response field as required, so every generated
 * field is optional. `parse*` checks the fields a screen cannot work without exactly once, at the API
 * boundary, and turns "absent" into null, so the rest of the app deals in strict types.
 *
 * Statuses the app does not know (the backend ahead of the app) become 'UNKNOWN' and render through
 * the fallback in utils/requestState.ts instead of crashing.
 *
 * Regenerate after a backend change: refresh src/types/openapi/velora-api.json, then `npm run types:generate`.
 */
import type { components } from './api.generated';

type Schemas = components['schemas'];

export type BookingStatus = NonNullable<Schemas['BookingResponse']['status']>;
export type RequestType = NonNullable<Schemas['BookingResponse']['requestType']>;
export type QuotationStatus = NonNullable<Schemas['QuotationResponse']['status']>;
export type TimelineEventType = NonNullable<Schemas['BookingTimelineEventResponse']['eventType']>;

export type Unknown = 'UNKNOWN';

/** Compile error here means the backend added or removed a status: update the app on purpose. */
const bookingStatusRecord: Record<BookingStatus, true> = {
  PENDING_ASSIGNMENT: true,
  PENDING: true,
  CONFIRMED: true,
  CANCELLED: true,
  COMPLETED: true,
};
export const BOOKING_STATUSES = Object.keys(bookingStatusRecord) as BookingStatus[];

const requestTypeRecord: Record<RequestType, true> = { FULL_HOME_PROJECT: true, INDIVIDUAL_SERVICE: true };
const quotationStatusRecord: Record<QuotationStatus, true> = { DRAFT: true, SENT: true, ACCEPTED: true, REJECTED: true };
const timelineEventRecord: Record<TimelineEventType, true> = {
  SUBMITTED: true,
  ASSIGNED: true,
  STATUS_CHANGED: true,
  QUOTATION_SENT: true,
  QUOTATION_ACCEPTED: true,
  QUOTATION_REJECTED: true,
  CANCELLED: true,
  COMPLETED: true,
};

export interface Professional {
  id: number;
  fullName: string;
  specialization: string | null;
  city: string | null;
  yearsExperience: number | null;
  averageRating: number | null;
  ratingCount: number;
  avatarUrl: string | null;
}

export interface Booking {
  id: number;
  requestType: RequestType | Unknown;
  status: BookingStatus | Unknown;
  customerName: string;
  categoryName: string | null;
  preferredStyle: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  location: string | null;
  /** ISO instant the customer asked for. */
  scheduledAt: string;
  notes: string | null;
  inspirationImageUrls: string[];
  createdAt: string;
  updatedAt: string;
  professional: Professional | null;
  /** Null when there is no quotation, or it is still a draft the customer must not see. */
  quotationStatus: QuotationStatus | null;
  quotationTotal: number | null;
  /** Informational only: the server does not block accepting after this. */
  quotationValidUntil: string | null;
  reviewed: boolean;
  /** Only present for the customer and admins. */
  cancellationReason: string | null;
}

export interface QuotationLineItem {
  id: number;
  description: string;
  quantity: number | null;
  unit: string | null;
  unitPrice: number | null;
  amount: number;
}

export interface Quotation {
  id: number;
  bookingId: number;
  status: QuotationStatus;
  notes: string | null;
  totalAmount: number;
  lineItems: QuotationLineItem[];
  rejectionReason: string | null;
  validUntil: string | null;
  updatedAt: string;
}

export interface TimelineEvent {
  id: number;
  eventType: TimelineEventType | Unknown;
  fromStatus: BookingStatus | Unknown | null;
  toStatus: BookingStatus | Unknown | null;
  createdAt: string;
}

export interface BookingCounts {
  /** Every known status is present, zero when there are none. */
  byStatus: Record<BookingStatus, number>;
  awaitingQuotationResponse: number;
}

export interface Page<T> {
  content: T[];
  page: number;
  totalElements: number;
  last: boolean;
}

export interface ReviewInput {
  rating: number;
  comment?: string;
}

/** The server sent something the app cannot use. Treated as a failed request, never shown as data. */
export class ContractError extends Error {
  constructor(message: string) {
    super(`Unexpected response from the server: ${message}`);
    this.name = 'ContractError';
  }
}

function req<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined) throw new ContractError(`missing ${field}`);
  return value;
}

const orNull = <T>(v: T | null | undefined): T | null => v ?? null;

function oneOf<T extends string>(record: Record<T, true>, value: string | undefined): T | Unknown {
  return value !== undefined && value in record ? (value as T) : 'UNKNOWN';
}

export function parseProfessional(dto: Schemas['ProfessionalSummaryResponse']): Professional {
  return {
    id: req(dto.id, 'professional.id'),
    fullName: req(dto.fullName, 'professional.fullName'),
    specialization: orNull(dto.specialization),
    city: orNull(dto.city),
    yearsExperience: orNull(dto.yearsExperience),
    averageRating: orNull(dto.averageRating),
    ratingCount: dto.ratingCount ?? 0,
    avatarUrl: orNull(dto.avatarUrl),
  };
}

export function parseBooking(dto: Schemas['BookingResponse']): Booking {
  const quotationStatus = dto.quotationStatus !== undefined && dto.quotationStatus in quotationStatusRecord
    ? dto.quotationStatus
    : null;
  return {
    id: req(dto.id, 'booking.id'),
    requestType: oneOf(requestTypeRecord, dto.requestType),
    status: oneOf(bookingStatusRecord, dto.status),
    customerName: dto.customerName ?? '',
    categoryName: orNull(dto.categoryName),
    preferredStyle: orNull(dto.preferredStyle),
    budgetMin: orNull(dto.budgetMin),
    budgetMax: orNull(dto.budgetMax),
    location: orNull(dto.location),
    scheduledAt: req(dto.scheduledAt, 'booking.scheduledAt'),
    notes: orNull(dto.notes),
    inspirationImageUrls: dto.inspirationImageUrls ?? [],
    createdAt: req(dto.createdAt, 'booking.createdAt'),
    updatedAt: dto.updatedAt ?? req(dto.createdAt, 'booking.createdAt'),
    professional: dto.professional ? parseProfessional(dto.professional) : null,
    quotationStatus,
    quotationTotal: quotationStatus ? orNull(dto.quotationTotal) : null,
    quotationValidUntil: quotationStatus ? orNull(dto.quotationValidUntil) : null,
    reviewed: dto.reviewed ?? false,
    cancellationReason: orNull(dto.cancellationReason),
  };
}

export function parseQuotation(dto: Schemas['QuotationResponse']): Quotation {
  return {
    id: req(dto.id, 'quotation.id'),
    bookingId: req(dto.bookingId, 'quotation.bookingId'),
    status: req(dto.status, 'quotation.status') as QuotationStatus,
    notes: orNull(dto.notes),
    totalAmount: req(dto.totalAmount, 'quotation.totalAmount'),
    lineItems: (dto.lineItems ?? []).map((item) => ({
      id: req(item.id, 'lineItem.id'),
      description: req(item.description, 'lineItem.description'),
      quantity: orNull(item.quantity),
      unit: orNull(item.unit),
      unitPrice: orNull(item.unitPrice),
      amount: req(item.amount, 'lineItem.amount'),
    })),
    rejectionReason: orNull(dto.rejectionReason),
    validUntil: orNull(dto.validUntil),
    updatedAt: req(dto.updatedAt, 'quotation.updatedAt'),
  };
}

export function parseTimelineEvent(dto: Schemas['BookingTimelineEventResponse']): TimelineEvent {
  return {
    id: req(dto.id, 'event.id'),
    eventType: oneOf(timelineEventRecord, dto.eventType),
    fromStatus: dto.fromStatus ? oneOf(bookingStatusRecord, dto.fromStatus) : null,
    toStatus: dto.toStatus ? oneOf(bookingStatusRecord, dto.toStatus) : null,
    createdAt: req(dto.createdAt, 'event.createdAt'),
  };
}

export function parseCounts(dto: Schemas['BookingCountsResponse']): BookingCounts {
  const byStatus = Object.fromEntries(BOOKING_STATUSES.map((s) => [s, dto.byStatus?.[s] ?? 0])) as Record<BookingStatus, number>;
  return { byStatus, awaitingQuotationResponse: dto.awaitingQuotationResponse ?? 0 };
}

export function parsePage<D, T>(
  dto: { content?: D[]; page?: number; totalElements?: number; last?: boolean },
  parseItem: (item: D) => T,
): Page<T> {
  return {
    content: (dto.content ?? []).map(parseItem),
    page: dto.page ?? 0,
    totalElements: dto.totalElements ?? 0,
    last: dto.last ?? true,
  };
}
