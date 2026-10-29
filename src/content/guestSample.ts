import type { Booking } from '@/types/requests';

/**
 * The "Example" request shown to a guest, in the real Booking shape so the real RequestCard can draw it.
 * It is plainly fictional: a made-up professional with no rating or review count (a fake rating would be
 * a claim), and the card is always labelled "Example" and cannot be tapped.
 *
 * TODO(trust line): if and when Velora verifies professionals, a "Verified professionals" line may be
 * added to the guest screens. It is deliberately absent until that process exists.
 */
export const sampleRequest: Booking = {
  id: 1042,
  requestType: 'INDIVIDUAL_SERVICE',
  status: 'PENDING',
  customerName: '',
  categoryName: 'Modular Kitchen',
  preferredStyle: null,
  budgetMin: null,
  budgetMax: null,
  location: 'Kondapur, Hyderabad',
  scheduledAt: '2026-11-02T05:30:00Z',
  notes: null,
  inspirationImageUrls: [],
  createdAt: '2026-10-24T05:30:00Z',
  updatedAt: '2026-10-26T05:30:00Z',
  professional: {
    id: 0,
    fullName: 'Example professional',
    specialization: 'Interior contractor',
    city: null,
    yearsExperience: null,
    averageRating: null,
    ratingCount: 0,
    avatarUrl: null,
  },
  quotationStatus: 'SENT',
  quotationTotal: null,
  quotationValidUntil: null,
  reviewed: false,
  cancellationReason: null,
};
