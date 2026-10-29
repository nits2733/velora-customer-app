/**
 * Typed analytics seam. No vendor is wired yet: call `setAnalyticsSink` once at app start with the
 * real SDK. Until then events are logged in development and dropped in release builds.
 */
export type AnalyticsEvent =
  | { name: 'service_viewed'; id: string; source: string }
  | { name: 'service_filter_applied'; group: string }
  | { name: 'design_ideas_cta_tapped'; source: string }
  | { name: 'bundle_tapped'; id: string }
  | { name: 'budget_range_tapped'; id: string }
  | { name: 'faq_toggled'; id: string; open: boolean }
  // Requests. Ids and flags only: never a name, phone, email, address or free text (reasons included).
  | { name: 'request_viewed'; requestId: number; state: string; source: string }
  | { name: 'quotation_accepted'; requestId: number }
  | { name: 'quotation_declined'; requestId: number; hasReason: boolean }
  | { name: 'request_cancelled'; requestId: number; hasReason: boolean; quotationAccepted: boolean }
  | { name: 'support_tapped'; source: string }
  // Account. No email, name or token ever goes in an event.
  | { name: 'auth_signed_in'; method: 'password' | 'google' }
  | { name: 'auth_signed_up' }
  | { name: 'auth_signed_out' }
  | { name: 'profile_updated'; fields: number }
  | { name: 'account_deletion_requested' }
  // Signed-out screens. A source and nothing else.
  | { name: 'signed_out_requests_viewed' }
  | { name: 'signed_out_profile_viewed' }
  | { name: 'login_tapped'; source: 'requests' | 'profile' }
  | { name: 'signup_tapped'; source: 'requests' | 'profile' }
  | { name: 'browse_services_tapped'; source: 'requests' | 'profile' };

type Sink = (event: AnalyticsEvent) => void;

let sink: Sink | null = null;

export const setAnalyticsSink = (next: Sink | null) => {
  sink = next;
};

export function track(event: AnalyticsEvent) {
  if (sink) sink(event);
  else if (__DEV__) console.debug('[analytics]', event);
}
