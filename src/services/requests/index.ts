import { httpRequestsApi } from './httpRequestsApi';

/** The Requests tab always talks to the real backend. The in-memory mock lives in ./testing and is only imported by tests. */
export const requestsApi = httpRequestsApi;

export type { ListParams, RequestsApi } from './RequestsApi';
