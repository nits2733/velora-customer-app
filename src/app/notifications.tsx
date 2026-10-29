import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RequestSkeletons, RequestsError } from '@/components/requests/states';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { useMarkNotificationRead, useNotifications } from '@/hooks/useAccount';
import { useIsOffline } from '@/hooks/useRequests';
import { colors, radius, screenGutter, shadow } from '@/theme';
import type { NotificationItem } from '@/types/account';
import { formatDateTime } from '@/utils/format';
import { RequireSession } from '@/components/auth/RequireSession';

const Separator = () => <View style={styles.separator} />;

/** The in-app inbox. Tapping an update opens the request it is about, if it still exists. */
function NotificationsScreenContent() {
  const insets = useSafeAreaInsets();
  const offline = useIsOffline();
  const t = strings.notifications;
  const list = useNotifications();
  const markRead = useMarkNotificationRead();
  const [refreshing, setRefreshing] = useState(false);

  const items = list.data?.pages.flatMap((page) => page.content) ?? [];

  const open = useCallback(
    (item: NotificationItem) => {
      if (!item.read) markRead.mutate(item.id);
      if (item.relatedRequestId !== null) router.push({ pathname: '/request/[id]', params: { id: String(item.relatedRequestId) } });
    },
    [markRead],
  );

  const refresh = async () => {
    setRefreshing(true);
    await list.refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
        <Pressable style={styles.back} onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))} accessibilityRole="button" accessibilityLabel={strings.detail.back}>
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </Pressable>
        <AppText variant="h2" accessibilityRole="header">
          {t.title}
        </AppText>
      </View>

      {list.isError && !list.data ? (
        <RequestsError offline={offline} onRetry={refresh} />
      ) : list.isPending ? (
        <RequestSkeletons count={4} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.item, !item.read && styles.itemUnread]}
              onPress={() => open(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.read ? '' : `${t.unreadLabel}. `}${item.title}. ${item.body}. ${formatDateTime(item.createdAt)}`}
            >
              {!item.read ? <View style={styles.dot} /> : <View style={styles.dotSpace} />}
              <View style={styles.copy}>
                <AppText variant="bodyStrong">{item.title}</AppText>
                <AppText variant="body" color={colors.inkSoft}>
                  {item.body}
                </AppText>
                <AppText variant="caption" color={colors.inkSoft}>
                  {formatDateTime(item.createdAt)}
                </AppText>
              </View>
              {item.relatedRequestId !== null ? <Feather name="chevron-right" size={18} color={colors.inkMuted} /> : null}
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText variant="h3" accessibilityRole="header">
                {t.emptyTitle}
              </AppText>
              <AppText variant="body" color={colors.inkSoft} style={styles.center}>
                {t.emptyBody}
              </AppText>
            </View>
          }
          ListFooterComponent={list.isFetchingNextPage ? <ActivityIndicator style={styles.more} color={colors.forest} /> : undefined}
          onEndReached={() => list.hasNextPage && !list.isFetchingNextPage && list.fetchNextPage()}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.forest} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: screenGutter, paddingBottom: 8 },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  separator: { height: 10 },
  item: { marginHorizontal: screenGutter, minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  itemUnread: { borderWidth: 1.5, borderColor: colors.forestSoft },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.forest },
  dotSpace: { width: 10 },
  copy: { flex: 1, gap: 2 },
  empty: { marginHorizontal: screenGutter, marginTop: 24, padding: 24, gap: 8, alignItems: 'center', borderRadius: radius.lg, backgroundColor: colors.surface },
  center: { textAlign: 'center' },
  more: { paddingVertical: 20 },
});

export default function NotificationsScreen() {
  return (
    <RequireSession next='/notifications'>
      <NotificationsScreenContent />
    </RequireSession>
  );
}
