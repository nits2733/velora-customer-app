import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountService, type ProfileUpdate } from '@/services/accountService';
import type { UserProfile } from '@/types/account';

export const accountKeys = {
  profile: ['account', 'profile'] as const,
  unread: ['account', 'unread'] as const,
  notifications: ['account', 'notifications'] as const,
};

export function useProfile(enabled = true) {
  return useQuery({ queryKey: accountKeys.profile, queryFn: () => accountService.profile(), enabled });
}

export function useUnreadCount(enabled = true) {
  // Push is not available, so the badge refreshes whenever the app comes back to the foreground.
  return useQuery({ queryKey: accountKeys.unread, queryFn: () => accountService.unreadCount(), enabled, refetchOnWindowFocus: true });
}

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: accountKeys.notifications,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => accountService.notifications(pageParam, 20),
    getNextPageParam: (last) => (last.last ? undefined : last.page + 1),
  });
}

export function useMarkNotificationRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountService.markRead(id),
    onSettled: () => {
      client.invalidateQueries({ queryKey: accountKeys.notifications });
      client.invalidateQueries({ queryKey: accountKeys.unread });
    },
  });
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (update: ProfileUpdate) => accountService.updateProfile(update),
    onSuccess: (profile: UserProfile) => client.setQueryData(accountKeys.profile, profile),
  });
}
