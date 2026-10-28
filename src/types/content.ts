import type { PromoTarget } from '@/content/services';

/** Editorial content that the backend does not serve yet. Each list renders only when it has entries. */

export interface Bundle {
  id: string;
  title: string;
  description: string;
  /** Lower-cased service names the bundle covers, for display as tags. */
  services: string[];
  image: string;
  /** Only set when the saving is real and agreed, e.g. "Save 8% on labour". */
  savings?: string;
  target: PromoTarget;
}

export interface BudgetRange {
  id: string;
  label: string;
  hint: string;
  target: PromoTarget;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  location: string;
  budget?: string;
  before: string;
  after: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  locality: string;
  project: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
