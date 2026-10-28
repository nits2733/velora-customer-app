/**
 * Marketing content for the Services tab.
 *
 * The Velora backend serves no pricing, bundles, reviews or completed-project data, so the lists
 * below ship EMPTY and their sections stay hidden. Only add an entry once it is real and approved:
 * invented prices, ratings or testimonials would undermine the trust these sections exist to build.
 * Copy is kept as plain strings in one place so it can be translated later.
 */
import type { BudgetRange, Bundle, FAQItem, ShowcaseProject, Testimonial } from '@/types/content';

export const bundles: Bundle[] = [];
export const budgetRanges: BudgetRange[] = [];
export const showcaseProjects: ShowcaseProject[] = [];
export const testimonials: Testimonial[] = [];

/** Answers only describe what the current request flow does. */
export const faqs: FAQItem[] = [
  {
    id: 'cost',
    question: 'How much will my project cost?',
    answer: 'Prices are not listed upfront because every home is different. After you request a service, a professional shares a quotation for your space.',
  },
  {
    id: 'quote',
    question: 'Do I have to accept the quotation?',
    answer: 'No. You can accept or decline the quotation you receive.',
  },
  {
    id: 'choose',
    question: 'I am not sure which service I need.',
    answer: 'Start with Browse Design Ideas to see styles and rooms you like, then come back and pick the service that fits.',
  },
];

export const copy = {
  budgetTitle: "What's your budget?",
  bundlesTitle: 'Popular combinations',
  showcaseTitle: 'Completed projects',
  testimonialsTitle: 'What homeowners say',
  faqTitle: 'Common questions',
  howTitle: 'How It Works',
  stickyCta: 'Browse Design Ideas',
};
