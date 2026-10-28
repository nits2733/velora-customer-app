import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ActiveFilters, type ActiveFilter } from '@/components/explore/ActiveFilters';
import { CategoryChips } from '@/components/explore/CategoryChips';
import { FilterSheet, type SheetValue } from '@/components/explore/FilterSheet';
import { LoadMoreFooter } from '@/components/explore/LoadMoreFooter';
import { MakeoverCards } from '@/components/explore/MakeoverCards';
import { MaterialsSection } from '@/components/explore/MaterialsSection';
import { MasonryGallery } from '@/components/explore/MasonryGallery';
import { SortPill } from '@/components/explore/SortPill';
import { StoryCard } from '@/components/explore/StoryCard';
import { Transformations } from '@/components/explore/TransformationCard';
import { TrendingCarousel } from '@/components/explore/TrendingCarousel';
import { CtaCard } from '@/components/home/CtaCard';
import { RoomGrid } from '@/components/home/RoomGrid';
import { SearchBar } from '@/components/home/SearchBar';
import { useTabBarSpace } from '@/components/layout/FloatingTabBar';
import { Section } from '@/components/layout/Section';
import { TopBar } from '@/components/layout/TopBar';
import { useRevealScroll } from '@/components/motion/Reveal';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAsync } from '@/hooks/useAsync';
import { ALL_ROOMS, useExplore } from '@/hooks/useExplore';
import { useTopPad } from '@/hooks/useTopPad';
import { categoryService } from '@/services/categoryService';
import { colors, radius, screenGutter } from '@/theme';
import type { Category } from '@/types/api';

/** Start loading the next gallery page this far before the gallery's end scrolls into view. */
const LOAD_AHEAD = 320;

const openItem = (id: string) => router.push({ pathname: '/item/[id]', params: { id } });

export default function ExploreScreen() {
  const topPad = useTopPad();
  const tabBarSpace = useTabBarSpace();
  const reveal = useRevealScroll();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const categories = useAsync(categoryService.list);
  const ex = useExplore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const galleryTop = useRef(0);

  const rooms = useMemo<Category[]>(
    () => (categories.data ?? []).filter((c) => c.serviceGroup === 'HOME_PROJECT'),
    [categories.data],
  );
  const chipOptions = useMemo(() => [ALL_ROOMS, ...rooms.map((r) => r.name)], [rooms]);
  const roomsLoading = categories.loading && !categories.data;
  const roomsFailed = categories.error && !categories.data;

  // Infinite scroll: a zero-height sentinel right under the gallery. When it nears the viewport
  // bottom, ask for the next page.
  // Capture only shared values and the callback: on web Reanimated recursively scans everything a
  // worklet closes over, and `reveal` (React context) is cyclic, which overflows the stack.
  const sentinelY = useSharedValue(-1);
  const { scrollY, viewH } = reveal.value;
  const { loadMore } = ex;
  useAnimatedReaction(
    () => sentinelY.value >= 0 && scrollY.value + viewH.value > sentinelY.value - LOAD_AHEAD,
    (near, prev) => {
      if (near && !prev) scheduleOnRN(loadMore);
    },
    [loadMore],
  );

  const scrollToGallery = () => scrollRef.current?.scrollTo({ y: Math.max(galleryTop.current - topPad, 0), animated: true });
  // Rooms and materials live above/below the gallery, so applying one jumps to the results it changed.
  const selectRoom = (room: string) => {
    ex.update({ room });
    if (room === ALL_ROOMS) scrollRef.current?.scrollTo({ y: 0, animated: true });
    else scrollToGallery();
  };
  const toggleTag = (tag: string) => {
    const next = ex.filters.tag === tag ? null : tag;
    ex.update({ tag: next });
    if (next) scrollToGallery();
  };
  const seeAll = () => {
    ex.clearAll();
    scrollToGallery();
  };

  const { filters, update } = ex;
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const list: ActiveFilter[] = [];
    if (filters.room !== ALL_ROOMS) list.push({ key: 'room', label: filters.room, onRemove: () => update({ room: ALL_ROOMS }) });
    if (filters.style) list.push({ key: 'style', label: filters.style, onRemove: () => update({ style: null }) });
    if (filters.tag) list.push({ key: 'tag', label: filters.tag, onRemove: () => update({ tag: null }) });
    if (filters.query.trim()) list.push({ key: 'query', label: `“${filters.query.trim()}”`, onRemove: () => update({ query: '' }) });
    return list;
  }, [filters, update]);

  return (
    <View style={styles.root}>
      <reveal.Provider value={reveal.value}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={reveal.onScroll}
          onLayout={reveal.onLayout}
          onContentSizeChange={reveal.onContentSizeChange}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingTop: topPad, paddingBottom: tabBarSpace + 28 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={categories.refreshing} onRefresh={categories.refresh} tintColor={colors.forest} />
          }
        >
          <View style={styles.top}>
            <TopBar />
            <SearchBar
              value={ex.filters.query}
              onChangeText={(query) => ex.update({ query })}
              placeholder="Try 'Scandinavian Kitchen Makeover'"
              filterCount={ex.activeFilterCount}
              onFilterPress={() => setSheetOpen(true)}
            />
            <CategoryChips options={chipOptions} selected={ex.filters.room} onSelect={selectRoom} />
            <ActiveFilters filters={activeFilters} onClearAll={ex.clearAll} />
          </View>

          <Section>
            <StoryCard onOpen={() => openItem('story-sculpted-sanctuary')} />
          </Section>

          <Section>
            <SectionHeader title="Explore by Room" subtitle="Layouts and ideas for every space" />
            {roomsFailed ? (
              <ErrorState error={categories.error!} onRetry={categories.reload} />
            ) : (
              <RoomGrid
                rooms={rooms}
                loading={roomsLoading}
                onSelect={(r) => selectRoom(r.name)}
                counts={ex.roomCounts}
                selected={ex.filters.room}
              />
            )}
          </Section>

          <Section>
            <SectionHeader
              eyebrow="Curated moodboards"
              title="Trending This Week"
              subtitle="Style directions with the materials behind them"
              actionLabel="See all"
              onAction={seeAll}
            />
            {ex.moodboards.length ? (
              <TrendingCarousel items={ex.moodboards} onOpen={openItem} />
            ) : (
              <NoMatches onClear={ex.clearAll} compact />
            )}
          </Section>

          <View onLayout={(e: LayoutChangeEvent) => (galleryTop.current = e.nativeEvent.layout.y)}>
            <Section>
              <View style={styles.galleryHead}>
                <View style={styles.galleryTitle}>
                  <AppText variant="eyebrow" color={colors.clay}>
                    Ideas to save
                  </AppText>
                  <AppText variant="h2" accessibilityRole="header">
                    Visual Discoveries
                  </AppText>
                </View>
                <SortPill value={ex.filters.sort} onChange={(sort) => ex.update({ sort })} />
              </View>
              {ex.gallery.length ? (
                <>
                  <MasonryGallery items={ex.gallery} onOpen={openItem} />
                  <LoadMoreFooter loading={ex.loadingMore} hasMore={ex.hasMore} total={ex.totalGallery} />
                </>
              ) : (
                <NoMatches onClear={ex.clearAll} />
              )}
            </Section>
          </View>
          <View onLayout={(e) => sentinelY.set(galleryTop.current + e.nativeEvent.layout.y)} />

          <Section>
            <SectionHeader title="Small Space Makeovers" subtitle="Smart layouts for 1BHK, 2BHK and studios" />
            <MakeoverCards onOpen={openItem} />
          </Section>

          <Section>
            <SectionHeader
              eyebrow="Tap to filter designs"
              title="Materials & Finishes"
              subtitle="Pick a finish to see the designs that use it"
            />
            <MaterialsSection tag={ex.filters.tag} onToggleTag={toggleTag} />
          </Section>

          <Section>
            <SectionHeader eyebrow="Design inspiration" title="Recent Transformations" subtitle="Before-to-after ideas to borrow from" />
            <Transformations onOpen={openItem} />
          </Section>

          <Section>
            <CtaCard />
          </Section>
        </Animated.ScrollView>
      </reveal.Provider>

      {sheetOpen ? (
        <FilterSheet
          initial={{ style: ex.filters.style, tag: ex.filters.tag } satisfies SheetValue}
          onApply={(v) => ex.update(v)}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </View>
  );
}

function NoMatches({ onClear, compact }: { onClear: () => void; compact?: boolean }) {
  return (
    <View style={[styles.empty, compact && styles.emptyCompact]}>
      <AppText variant="bodyStrong">No designs match</AppText>
      <AppText variant="caption" color={colors.inkSoft} style={styles.emptyText}>
        Try a different search or clear your filters.
      </AppText>
      <Button label="Clear filters" onPress={onClear} style={styles.emptyBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { gap: 14 },
  galleryHead: { paddingHorizontal: screenGutter, marginBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 },
  galleryTitle: { flexShrink: 1 },
  empty: { marginHorizontal: screenGutter, padding: 20, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', gap: 6 },
  emptyCompact: { padding: 14 },
  emptyText: { textAlign: 'center' },
  emptyBtn: { marginTop: 8, alignSelf: 'stretch' },
});
