/**
 * Presentation metadata for the Services tab.
 *
 * The service catalogue itself (names, descriptions, ids) comes from `GET /api/categories`.
 * The backend has no pricing, scope, search or service-detail endpoint, so this file only adds
 * what the API cannot: an icon, a browse group and search keywords, keyed by lower-cased
 * category name. Categories without an entry fall back to the generic icon and the "More" group
 * so a service added in the admin dashboard still shows up.
 */
import type { Feather } from '@expo/vector-icons';
import { IMG } from './home';

export type IconName = keyof typeof Feather.glyphMap;

export const ALL_SERVICES = 'All Services';
export const OTHER_GROUP = 'More Services';
export const RENOVATION_GROUP = 'Renovation';

/** Chip order. Only groups that contain at least one live service are shown. */
export const serviceGroups = ['Kitchens & Wardrobes', 'Painting & Finishes', 'Furniture & Joinery', 'Bathrooms & Essential Works'] as const;

interface ServiceMeta {
  icon: IconName;
  group: (typeof serviceGroups)[number];
  keywords: string[];
  /** Fallback cover when the category has no `imageUrl` from the API. */
  image: string;
  /** Outcome-led one-liner; the API descriptions are installation-focused. */
  blurb: string;
}

export const serviceMeta: Record<string, ServiceMeta> = {
  'modular kitchen': { icon: 'grid', group: 'Kitchens & Wardrobes', keywords: ['kitchen', 'cabinet', 'wardrobe', 'storage', 'modular'], image: IMG.kitchen, blurb: 'Storage-smart kitchens planned around how you cook.' },
  painting: { icon: 'edit-3', group: 'Painting & Finishes', keywords: ['paint', 'wall', 'limewash', 'texture', 'finish', 'interior', 'exterior'], image: IMG.livingModern, blurb: 'Fresh walls and clean finishes in colours that suit your light.' },
  'false ceiling': { icon: 'layers', group: 'Painting & Finishes', keywords: ['ceiling', 'lighting', 'cove', 'gypsum', 'finish'], image: IMG.lounge, blurb: 'Layered ceilings with concealed lighting for a finished look.' },
  carpentry: { icon: 'tool', group: 'Furniture & Joinery', keywords: ['furniture', 'wood', 'woodwork', 'joinery', 'custom', 'bespoke', 'storage'], image: IMG.bedroom, blurb: 'Made-to-measure wood furniture and storage for your rooms.' },
  plumbing: { icon: 'droplet', group: 'Bathrooms & Essential Works', keywords: ['bathroom', 'pipe', 'fitting', 'fixture', 'water', 'leak'], image: IMG.bathroom, blurb: 'Leak-free fittings and fixtures for kitchens and bathrooms.' },
  electrical: { icon: 'zap', group: 'Bathrooms & Essential Works', keywords: ['wiring', 'lighting', 'switch', 'fan', 'power', 'electric'], image: IMG.lounge2, blurb: 'Safe, tidy wiring, switches and lighting.' },
};

export const defaultServiceIcon: IconName = 'tool';

export const FULL_HOME_ID = 'full-home';

/** Full Home Renovation maps to the backend's FULL_HOME_PROJECT booking type, not to a category row. */
export const fullHome = {
  id: FULL_HOME_ID,
  name: 'Full Home Renovation',
  tagline: 'Plan and coordinate your home transformation through a managed renovation experience.',
  keywords: ['full home', 'renovation', 'turnkey', 'complete', 'whole home', 'remodel', 'home'],
};

export type PromoTarget = { kind: 'home' } | { kind: 'service'; name: string } | { kind: 'group'; group: string };

export interface HeroPromo {
  id: string;
  eyebrow: string;
  title: string;
  promise: string;
  cta: string;
  image: string;
  target: PromoTarget;
}

/** Hero carousel. No price or timeline badges: the backend exposes neither. Promos whose target is not in the live catalogue are dropped. */
export const heroPromos: HeroPromo[] = [
  { id: FULL_HOME_ID, eyebrow: 'Featured service', title: fullHome.name, promise: fullHome.tagline, cta: 'Explore Renovation', image: IMG.livingWarm, target: { kind: 'home' } },
  { id: 'kitchen', eyebrow: 'Kitchens & Wardrobes', title: 'Kitchen Makeover', promise: 'A storage-smart kitchen planned around how you cook.', cta: 'Explore Kitchens', image: IMG.kitchen, target: { kind: 'service', name: 'modular kitchen' } },
  { id: 'refresh', eyebrow: 'Painting & Finishes', title: 'Quick Refresh', promise: 'Repaint and add a false ceiling to freshen your rooms without a full renovation.', cta: 'See Finishes', image: IMG.bedroomSoft, target: { kind: 'group', group: 'Painting & Finishes' } },
];

/** Only claims the current request flow backs up. Add more here once the backend supports them. */
export const trustPoints: { icon: IconName; label: string }[] = [
  { icon: 'user-check', label: 'Professional assigned by Velora' },
  { icon: 'file-text', label: 'Quotation you can accept or decline' },
];

export const helpCopy = {
  title: 'Not sure where to start?',
  body: 'Browse design ideas first, then come back and pick the service that fits.',
};

export const steps: { n: number; icon: IconName; title: string; body: string }[] = [
  { n: 1, icon: 'compass', title: 'Explore', body: 'Find the service that fits your space.' },
  { n: 2, icon: 'send', title: 'Request', body: 'Tell Velora what you need and when.' },
  { n: 3, icon: 'user-check', title: 'Get matched', body: 'Velora assigns a professional, who shares a quotation for you to accept or decline.' },
];
