import { Platform } from 'react-native';
import type { components } from '@/types/api.generated';
import { parseNotification, parseUserProfile, type NotificationItem, type UserProfile } from '@/types/account';
import { parsePage, type Page } from '@/types/requests';
import { ApiError, request } from './apiClient';

type Schemas = components['schemas'];

export interface ProfileUpdate {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

/**
 * The signed-in customer's profile, avatar and notification inbox. A profile update sends only the
 * fields that changed; the server ignores the professional-only fields for customers.
 */
export const accountService = {
  async profile(): Promise<UserProfile> {
    return parseUserProfile(await request<Schemas['UserProfileResponse']>('/api/users/profile'));
  },

  async updateProfile(update: ProfileUpdate): Promise<UserProfile> {
    return parseUserProfile(
      await request<Schemas['UserProfileResponse']>('/api/users/profile', { method: 'PUT', body: update satisfies Schemas['UpdateProfileRequest'] }),
    );
  },

  /** Uploads an image (already resized and compressed) as the avatar and returns its URL. */
  async uploadAvatar(uri: string): Promise<string> {
    const form = new FormData();
    if (Platform.OS === 'web') {
      form.append('file', await (await fetch(uri)).blob(), 'avatar.jpg');
    } else {
      form.append('file', { uri, name: 'avatar.jpg', type: 'image/jpeg' } as unknown as Blob);
    }
    form.append('purpose', 'AVATAR');
    const dto = await request<Schemas['UploadResponse']>('/api/uploads', { method: 'POST', body: form, timeoutMs: 60_000 });
    if (!dto.url) throw new ApiError('Unexpected response from the server.', 502);
    return dto.url;
  },

  async notifications(page = 0, size = 20): Promise<Page<NotificationItem>> {
    const dto = await request<Schemas['PageResponseNotificationResponse']>('/api/notifications', { query: { page, size } });
    return parsePage(dto, parseNotification);
  },

  async unreadCount(): Promise<number> {
    return (await request<Schemas['UnreadCountResponse']>('/api/notifications/unread-count')).count ?? 0;
  },

  async markRead(id: number): Promise<void> {
    await request<void>(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },
};
