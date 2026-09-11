import type { BookingResponse, BookingStatus, BookingTimeline } from '../api/types'
import { statusColors } from '../theme/tokens'

// Real backend enum values (BookingTimeline), each with the friendly label
// shown to the customer - used by every screen that collects a preferred
// timeline, so the enum/label pairing only lives in one place.
export const TIMELINE_OPTIONS: { value: BookingTimeline; label: string }[] = [
  { value: 'ASAP', label: 'As soon as possible' },
  { value: 'WITHIN_1_MONTH', label: 'Within a month' },
  { value: 'ONE_TO_THREE_MONTHS', label: '1–3 months' },
  { value: 'FLEXIBLE', label: "I'm flexible" },
]

const TIMELINE_DAYS: Record<BookingTimeline, number> = {
  ASAP: 7,
  WITHIN_1_MONTH: 30,
  ONE_TO_THREE_MONTHS: 60,
  FLEXIBLE: 90,
}

export function timelineLabel(timeline: BookingTimeline): string {
  return TIMELINE_OPTIONS.find(o => o.value === timeline)?.label || timeline
}

export function computeScheduledAt(timeline: BookingTimeline): string {
  const d = new Date()
  d.setDate(d.getDate() + TIMELINE_DAYS[timeline])
  return d.toISOString()
}

export function projectTitle(b: BookingResponse): string {
  return b.categoryName || b.portfolioItem?.title
    || (b.requestType === 'FULL_HOME_PROJECT' ? 'Full Home Project' : 'Service Request')
}

export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: style, day: 'numeric', year: 'numeric' })
}

export function budgetRangeText(b: Pick<BookingResponse, 'budgetMin' | 'budgetMax'>): string | null {
  if (b.budgetMin == null && b.budgetMax == null) return null
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`
  if (b.budgetMin != null && b.budgetMax != null) return `${fmt(b.budgetMin)} – ${fmt(b.budgetMax)}`
  return fmt((b.budgetMin ?? b.budgetMax)!)
}

// Friendly, customer-facing translations of the backend's actual status
// values - never shown as "Professional selected" since the customer never
// selects one; Velora's admin does the assignment.
const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_ASSIGNMENT: 'Waiting for our team',
  PENDING: 'Professional Assigned',
  CONFIRMED: 'Service in Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const STATUS_COLOR_KEY: Record<BookingStatus, keyof typeof statusColors> = {
  PENDING_ASSIGNMENT: 'pending',
  PENDING: 'pending',
  CONFIRMED: 'approved',
  COMPLETED: 'approved',
  CANCELLED: 'rejected',
}

export function statusLabel(status: BookingStatus): string {
  return STATUS_LABEL[status] || status
}

export function statusColorKey(status: BookingStatus): keyof typeof statusColors {
  return STATUS_COLOR_KEY[status] || 'pending'
}
