/**
 * Domain types for the signed-in customer's account and notifications, derived from the generated
 * OpenAPI types. As with requests, the backend marks no response field as required, so the fields a
 * screen cannot work without are checked here once, at the boundary.
 */
import type { components } from './api.generated';
import { ContractError, type Page } from './requests';

type Schemas = components['schemas'];

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
}

export type NotificationType = NonNullable<Schemas['NotificationResponse']['type']>;

export interface NotificationItem {
  id: number;
  type: NotificationType | 'UNKNOWN';
  title: string;
  body: string;
  /** The request it is about, when there is one. It may no longer exist or be yours. */
  relatedRequestId: number | null;
  read: boolean;
  createdAt: string;
}

const notificationTypes: Record<NotificationType, true> = {
  BOOKING_ASSIGNED: true,
  BOOKING_STATUS_CHANGED: true,
  BOOKING_CANCELLED: true,
  QUOTATION_SENT: true,
  QUOTATION_ACCEPTED: true,
  QUOTATION_REJECTED: true,
};

export function parseUserProfile(dto: Schemas['UserProfileResponse']): UserProfile {
  if (dto.id === undefined || !dto.email) throw new ContractError('missing profile id or email');
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName ?? '',
    phone: dto.phone?.trim() || null,
    avatarUrl: dto.avatarUrl ?? null,
    createdAt: dto.createdAt ?? null,
  };
}

export function parseNotification(dto: Schemas['NotificationResponse']): NotificationItem {
  if (dto.id === undefined || !dto.createdAt) throw new ContractError('missing notification id or time');
  return {
    id: dto.id,
    type: dto.type !== undefined && dto.type in notificationTypes ? dto.type : 'UNKNOWN',
    title: dto.title ?? '',
    body: dto.body ?? '',
    relatedRequestId: dto.relatedBookingId ?? null,
    read: dto.read ?? false,
    createdAt: dto.createdAt,
  };
}

export type { Page };
