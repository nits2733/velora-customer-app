import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTabBarSpace } from '@/components/layout/FloatingTabBar';
import { RequestCard, type CardIntent } from '@/components/requests/RequestCard';
import { RequestTabs } from '@/components/requests/RequestTabs';
import { RequestsGuest } from '@/components/guest/RequestsGuest';
import { EmptyRequests, RequestSkeletons, RequestsError } from '@/components/requests/states';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { useIsOffline, usePinnedRequests, useRequestCounts, useRequestList } from '@/hooks/useRequests';
import { useSupport } from '@/hooks/useSupport';
import { useSession } from '@/session/useSession';
import { colors, screenGutter } from '@/theme';
import { tonePalette } from '@/theme/tones';
import type { Booking } from '@/types/requests';
import { actionNeededOnly, isEmptyTab, tabCounts, withoutPinned, type RequestTab } from '@/utils/requestState';

const keyOf = (item: Booking) => String(item.id);
const Separator = () => <View style={styles.separator} />;

export default function RequestsScreen() {
  const session = useSession();
  const tabBarSpace = useTabBarSpace();
  const support = useSupport();
  const offline = useIsOffline();
  const [tab, setTab] = useState<RequestTab>('active');
  const [refreshing, setRefreshing] = useState(false);

  const signedIn = session.status === 'signedIn';
  // Nothing is fetched for a guest or while the saved session is being restored.
  const counts = useRequestCounts(signedIn);
  const list = useRequestList(tab, signedIn);
  const pinnedQuery = usePinnedRequests(signedIn && tab === 'active');

  // The server already filters; checking again keeps an old or stale response from filling this section
  // with requests that need nothing. No real items, no section.
  const pinned = useMemo(() => (tab === 'active' ? actionNeededOnly(pinnedQuery.data?.content ?? []) : []), [tab, pinnedQuery.data]);
  const items = useMemo(() => {
    const all = list.data?.pages.flatMap((page) => page.content) ?? [];
    return tab === 'active' ? withoutPinned(all, pinned) : all;
  }, [list.data, pinned, tab]);
  const tabTotals = useMemo(() => (counts.data ? tabCounts(counts.data.byStatus) : null), [counts.data]);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = list;
  // If every request on the pages loaded so far is pinned above, the list looks empty but more may follow.
  useEffect(() => {
    if (tab === 'active' && items.length === 0 && hasNextPage && !isFetching) fetchNextPage();
  }, [tab, items.length, hasNextPage, isFetching, fetchNextPage]);

  const open = useCallback((id: number, intent?: CardIntent) => {
    router.push({ pathname: '/request/[id]', params: intent ? { id: String(id), intent } : { id: String(id) } });
  }, []);
  const askSupport = useCallback(() => support.open('request_card'), [support]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.allSettled([counts.refetch(), list.refetch(), pinnedQuery.refetch()]);
    setRefreshing(false);
  }, [counts, list, pinnedQuery]);

  const loading = list.isPending || (tab === 'active' && pinnedQuery.isPending);
  const failed = (list.isError && !list.data) || (offline && list.isPending);
  const empty = isEmptyTab({ listCount: items.length, pinnedCount: pinned.length, loading });

  if (session.status !== 'signedIn') {
    return (
      <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: tabBarSpace + 28, gap: 16, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <PageHeader title={strings.requests.title} />
        {session.status === 'loading' ? <RequestSkeletons count={2} /> : <RequestsGuest />}
      </ScrollView>
    );
  }

  const header = (
    <View style={styles.header}>
      <PageHeader title={strings.requests.title} subtitle={strings.requests.subtitle} />
      <RequestTabs selected={tab} onSelect={setTab} counts={tabTotals} />
      {__DEV__ ? (
        <Pressable style={styles.dev} onPress={() => router.push('/dev-request-states')} accessibilityRole="link" accessibilityLabel="Developer: preview every request state">
          <AppText variant="caption" color={colors.inkSoft}>
            Dev: preview request states
          </AppText>
        </Pressable>
      ) : null}

      {pinned.length ? (
        <View style={styles.pinned}>
          <View style={styles.pinnedTitle}>
            <View style={[styles.dot, { backgroundColor: tonePalette.amber.bg }]}>
              <Feather name="bell" size={14} color={tonePalette.amber.fg} />
            </View>
            <AppText variant="h3" accessibilityRole="header">
              {strings.requests.actionNeeded} ({pinned.length})
            </AppText>
          </View>
          {pinned.map((booking) => (
            <RequestCard key={booking.id} booking={booking} onOpen={open} onSupport={askSupport} />
          ))}
        </View>
      ) : null}

      {failed ? <RequestsError offline={offline} onRetry={refresh} /> : null}
      {!failed && loading ? <RequestSkeletons /> : null}
      {!failed && empty ? <EmptyRequests tab={tab} /> : null}
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={failed || loading ? [] : items}
        keyExtractor={keyOf}
        renderItem={({ item }) => <RequestCard booking={item} onOpen={open} onSupport={askSupport} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={header}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.more} color={colors.forest} accessibilityLabel={strings.requests.loadMore} /> : undefined}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.forest} />}
        contentContainerStyle={{ paddingBottom: tabBarSpace + 28 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        windowSize={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { gap: 14, paddingBottom: 14 },
  separator: { height: 12 },
  pinned: { gap: 12 },
  pinnedTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: screenGutter },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  more: { paddingVertical: 20 },
  dev: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: screenGutter },
});
