/**
 * What the backend can actually do today. A UI element that depends on a capability renders nothing
 * while its flag is false: no placeholders, no "coming soon" tiles, no invented data.
 *
 * Flip a flag only after the matching endpoint exists and the screen has been built against it.
 */
export interface Capabilities {
  milestones: boolean;
  payments: boolean;
  chat: boolean;
  documents: boolean;
  siteVisits: boolean;
  renders3D: boolean;
  push: boolean;
  reschedule: boolean;
  savedDesigns: boolean;
  addresses: boolean;
  loyaltyTier: boolean;
}

export const capabilities: Readonly<Capabilities> = {
  milestones: false,
  payments: false,
  chat: false,
  documents: false,
  siteVisits: false,
  renders3D: false,
  push: false,
  reschedule: false,
  savedDesigns: false,
  addresses: false,
  loyaltyTier: false,
};
