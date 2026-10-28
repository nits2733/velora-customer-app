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
  | { name: 'faq_toggled'; id: string; open: boolean };

type Sink = (event: AnalyticsEvent) => void;

let sink: Sink | null = null;

export const setAnalyticsSink = (next: Sink | null) => {
  sink = next;
};

export function track(event: AnalyticsEvent) {
  if (sink) sink(event);
  else if (__DEV__) console.debug('[analytics]', event);
}
