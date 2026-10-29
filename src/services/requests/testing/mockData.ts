/**
 * Demo data in the exact wire shape of the backend (typed against the generated OpenAPI types), so the
 * mock adapter exercises the same parsing as the real one. One request for every state the Requests
 * tab can show. Names, localities and amounts are made up, in Indian formats.
 */
import type { components } from '@/types/api.generated';

type Schemas = components['schemas'];
export type BookingDto = Schemas['BookingResponse'];
export type QuotationDto = Schemas['QuotationResponse'];
export type TimelineEventDto = Schemas['BookingTimelineEventResponse'];

export interface MockRecord {
  booking: BookingDto;
  quotation: QuotationDto | null;
  timeline: TimelineEventDto[];
}

const DAY = 86_400_000;

/** `days` before now, at a fixed hour, so demo dates read naturally. */
function at(days: number, hour = 11, minute = 30): string {
  const d = new Date(Date.now() - days * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const rahul: Schemas['ProfessionalSummaryResponse'] = {
  id: 301, fullName: 'Rahul Sharma', specialization: 'Interior contractor', city: 'Hyderabad',
  yearsExperience: 11, availabilityStatus: 'AVAILABLE', averageRating: 4.7, ratingCount: 38,
};
const sunita: Schemas['ProfessionalSummaryResponse'] = {
  id: 302, fullName: 'Sunita Reddy', specialization: 'Painting and finishes', city: 'Hyderabad',
  yearsExperience: 8, availabilityStatus: 'AVAILABLE', averageRating: 4.5, ratingCount: 21,
};
const imran: Schemas['ProfessionalSummaryResponse'] = {
  id: 303, fullName: 'Imran Qureshi', specialization: 'Carpentry and woodwork', city: 'Hyderabad',
  yearsExperience: 14, availabilityStatus: 'AVAILABLE', averageRating: 4.8, ratingCount: 52,
};

let eventId = 1000;
const ev = (
  eventType: NonNullable<TimelineEventDto['eventType']>,
  toStatus: TimelineEventDto['toStatus'],
  daysAgo: number,
  fromStatus?: TimelineEventDto['fromStatus'],
): TimelineEventDto => ({ id: eventId++, eventType, fromStatus, toStatus, createdAt: at(daysAgo, 10, 15) });

function quotation(bookingId: number, status: QuotationDto['status'], total: number, extra: Partial<QuotationDto> = {}): QuotationDto {
  return {
    id: bookingId + 5000, bookingId, status, totalAmount: total, createdAt: at(3), updatedAt: at(2),
    notes: 'Prices include material and fitting. Site clean-up is included.',
    lineItems: [
      { id: bookingId * 10 + 1, description: 'Materials and fittings', quantity: 1, unit: 'lot', unitPrice: Math.round(total * 0.6), amount: Math.round(total * 0.6) },
      { id: bookingId * 10 + 2, description: 'Labour and installation', quantity: 1, unit: 'lot', unitPrice: Math.round(total * 0.3), amount: Math.round(total * 0.3) },
      { id: bookingId * 10 + 3, description: 'Site preparation and clean-up', quantity: 1, unit: 'lot', unitPrice: total - Math.round(total * 0.9), amount: total - Math.round(total * 0.9) },
    ],
    ...extra,
  };
}

function booking(id: number, fields: BookingDto): BookingDto {
  return { id, customerId: 101, customerName: 'Anita Verma', inspirationImageUrls: [], reviewed: false, ...fields };
}

export function seedRecords(): MockRecord[] {
  return [
    {
      booking: booking(2048, {
        requestType: 'FULL_HOME_PROJECT', categoryName: '3 BHK Home Interior', status: 'PENDING_ASSIGNMENT',
        preferredStyle: 'Warm minimal', budgetMin: 1_200_000, budgetMax: 1_800_000, location: 'Madhapur, Hyderabad',
        scheduledAt: at(-6), notes: 'Possession next month. Need living room, kitchen and two bedrooms.',
        createdAt: at(1), updatedAt: at(1),
      }),
      quotation: null,
      timeline: [ev('SUBMITTED', 'PENDING_ASSIGNMENT', 1)],
    },
    {
      booking: booking(2047, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Modular Kitchen', status: 'PENDING', professional: rahul,
        preferredStyle: 'Modern', budgetMin: 300_000, budgetMax: 450_000, location: 'Kondapur, Hyderabad',
        scheduledAt: at(-3), createdAt: at(4), updatedAt: at(1), quotationStatus: 'SENT', quotationTotal: 345_000,
        quotationValidUntil: at(-5),
      }),
      quotation: quotation(2047, 'SENT', 345_000, { validUntil: at(-5) }),
      timeline: [ev('SUBMITTED', 'PENDING_ASSIGNMENT', 4), ev('ASSIGNED', 'PENDING', 3, 'PENDING_ASSIGNMENT'), ev('QUOTATION_SENT', 'PENDING', 1, 'PENDING')],
    },
    {
      booking: booking(2046, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Painting', status: 'CONFIRMED', professional: sunita,
        preferredStyle: 'Limewash', budgetMin: 50_000, budgetMax: 70_000, location: 'Jubilee Hills, Hyderabad',
        scheduledAt: at(-2), createdAt: at(9), updatedAt: at(5), quotationStatus: 'ACCEPTED', quotationTotal: 58_500,
      }),
      quotation: quotation(2046, 'ACCEPTED', 58_500),
      timeline: [
        ev('SUBMITTED', 'PENDING_ASSIGNMENT', 9), ev('ASSIGNED', 'PENDING', 8, 'PENDING_ASSIGNMENT'), ev('QUOTATION_SENT', 'PENDING', 7, 'PENDING'),
        ev('QUOTATION_ACCEPTED', 'PENDING', 6, 'PENDING'), ev('STATUS_CHANGED', 'CONFIRMED', 5, 'PENDING'),
      ],
    },
    {
      booking: booking(2045, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'False Ceiling', status: 'PENDING', professional: imran,
        budgetMin: 80_000, budgetMax: 120_000, location: 'Gachibowli, Hyderabad', scheduledAt: at(-4),
        createdAt: at(6), updatedAt: at(2), quotationStatus: 'REJECTED', quotationTotal: 142_000,
      }),
      quotation: quotation(2045, 'REJECTED', 142_000, { rejectionReason: 'Over my budget' }),
      timeline: [
        ev('SUBMITTED', 'PENDING_ASSIGNMENT', 6), ev('ASSIGNED', 'PENDING', 5, 'PENDING_ASSIGNMENT'),
        ev('QUOTATION_SENT', 'PENDING', 3, 'PENDING'), ev('QUOTATION_REJECTED', 'PENDING', 2, 'PENDING'),
      ],
    },
    {
      booking: booking(2044, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Electrical', status: 'PENDING', professional: rahul,
        location: 'Madhapur, Hyderabad', scheduledAt: at(-1), notes: 'New switchboards in two rooms.',
        createdAt: at(2), updatedAt: at(1),
      }),
      quotation: null,
      timeline: [ev('SUBMITTED', 'PENDING_ASSIGNMENT', 2), ev('ASSIGNED', 'PENDING', 1, 'PENDING_ASSIGNMENT')],
    },
    {
      booking: booking(2043, {
        requestType: 'FULL_HOME_PROJECT', categoryName: '2 BHK Renovation', status: 'CONFIRMED', professional: imran,
        preferredStyle: 'Contemporary', budgetMin: 800_000, budgetMax: 1_100_000, location: 'Banjara Hills, Hyderabad',
        scheduledAt: at(-8), createdAt: at(12), updatedAt: at(1), quotationStatus: 'SENT', quotationTotal: 985_000,
      }),
      quotation: quotation(2043, 'SENT', 985_000),
      timeline: [
        ev('SUBMITTED', 'PENDING_ASSIGNMENT', 12), ev('ASSIGNED', 'PENDING', 11, 'PENDING_ASSIGNMENT'),
        ev('STATUS_CHANGED', 'CONFIRMED', 9, 'PENDING'), ev('QUOTATION_SENT', 'CONFIRMED', 1, 'CONFIRMED'),
      ],
    },
    {
      booking: booking(2040, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Plumbing', status: 'COMPLETED', professional: rahul,
        location: 'Kondapur, Hyderabad', scheduledAt: at(20), createdAt: at(26), updatedAt: at(18), reviewed: false,
        quotationStatus: 'ACCEPTED', quotationTotal: 18_400,
      }),
      quotation: quotation(2040, 'ACCEPTED', 18_400),
      timeline: [
        ev('SUBMITTED', 'PENDING_ASSIGNMENT', 26), ev('ASSIGNED', 'PENDING', 25, 'PENDING_ASSIGNMENT'),
        ev('QUOTATION_ACCEPTED', 'PENDING', 23, 'PENDING'), ev('STATUS_CHANGED', 'CONFIRMED', 22, 'PENDING'), ev('COMPLETED', 'COMPLETED', 18, 'CONFIRMED'),
      ],
    },
    {
      booking: booking(2038, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Carpentry', status: 'COMPLETED', professional: imran,
        location: 'Jubilee Hills, Hyderabad', scheduledAt: at(45), createdAt: at(52), updatedAt: at(40), reviewed: true,
        quotationStatus: 'ACCEPTED', quotationTotal: 96_000,
      }),
      quotation: quotation(2038, 'ACCEPTED', 96_000),
      timeline: [
        ev('SUBMITTED', 'PENDING_ASSIGNMENT', 52), ev('ASSIGNED', 'PENDING', 51, 'PENDING_ASSIGNMENT'),
        ev('QUOTATION_ACCEPTED', 'PENDING', 49, 'PENDING'), ev('STATUS_CHANGED', 'CONFIRMED', 48, 'PENDING'), ev('COMPLETED', 'COMPLETED', 40, 'CONFIRMED'),
      ],
    },
    {
      booking: booking(2035, {
        requestType: 'INDIVIDUAL_SERVICE', categoryName: 'Painting', status: 'CANCELLED', professional: sunita,
        location: 'Gachibowli, Hyderabad', scheduledAt: at(30), createdAt: at(36), updatedAt: at(33),
        cancellationReason: 'Postponing the work to next year',
      }),
      quotation: null,
      timeline: [
        ev('SUBMITTED', 'PENDING_ASSIGNMENT', 36), ev('ASSIGNED', 'PENDING', 35, 'PENDING_ASSIGNMENT'), ev('CANCELLED', 'CANCELLED', 33, 'PENDING'),
      ],
    },
  ];
}
