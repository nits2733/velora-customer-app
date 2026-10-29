import type {
  Booking,
  BookingCounts,
  BookingStatus,
  Page,
  Quotation,
  ReviewInput,
  TimelineEvent,
} from '@/types/requests';

export interface ListParams {
  /** Repeatable server filter. Empty or omitted means every status. */
  status?: readonly BookingStatus[];
  /** Customers only: active requests whose quotation is waiting for an answer. Narrowed by `status`. */
  actionNeeded?: boolean;
  page?: number;
  size?: number;
}

/**
 * Everything the Requests tab needs from the backend. `httpRequestsApi` calls the real endpoints;
 * `mockRequestsApi` answers from memory in the same shapes. Failures are `ApiError`s (a status of 0
 * means the network is unreachable); an answer the app cannot use is a `ContractError`.
 */
export interface RequestsApi {
  list(params?: ListParams): Promise<Page<Booking>>;
  counts(): Promise<BookingCounts>;
  /** 404 when the request does not exist or is not yours: the server does not say which. */
  get(id: number): Promise<Booking>;
  timeline(id: number): Promise<TimelineEvent[]>;
  /** Null when there is no quotation the customer may see yet. */
  quotation(id: number): Promise<Quotation | null>;
  acceptQuotation(id: number): Promise<Quotation>;
  rejectQuotation(id: number, reason?: string): Promise<Quotation>;
  cancel(id: number, reason?: string): Promise<Booking>;
  submitReview(id: number, review: ReviewInput): Promise<void>;
}
