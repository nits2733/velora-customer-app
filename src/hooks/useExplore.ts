import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { galleryItems, GALLERY_PAGE_SIZE, moodboards, type DesignItem, type Moodboard } from '@/content/explore';

export type SortKey = 'curated' | 'newest';
export const ALL_ROOMS = 'All';

export interface ExploreFilters {
  room: string;
  query: string;
  style: string | null;
  /** Material or finish tag picked from swatches / palettes. */
  tag: string | null;
  sort: SortKey;
}

const initial: ExploreFilters = { room: ALL_ROOMS, query: '', style: null, tag: null, sort: 'curated' };

function matches(room: string, tags: string[], text: string, f: ExploreFilters) {
  if (f.room !== ALL_ROOMS && room !== f.room) return false;
  if (f.style && !tags.includes(f.style)) return false;
  if (f.tag && !tags.includes(f.tag)) return false;
  const q = f.query.trim().toLowerCase();
  if (q && !`${text} ${room} ${tags.join(' ')}`.toLowerCase().includes(q)) return false;
  return true;
}

/** Filter/search/pagination state for the Explore screen. Content comes from `content/explore`. */
export function useExplore() {
  const [filters, setFilters] = useState<ExploreFilters>(initial);
  const [pages, setPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const update = useCallback((patch: Partial<ExploreFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPages(1);
  }, []);

  const clearAll = useCallback(() => {
    setFilters((f) => ({ ...initial, sort: f.sort }));
    setPages(1);
  }, []);

  const filteredGallery = useMemo<DesignItem[]>(() => {
    const list = galleryItems.filter((g) => matches(g.room, g.tags, `${g.title} ${g.subtitle}`, filters));
    return list.sort((a, b) => (filters.sort === 'curated' ? a.rank - b.rank : b.recency - a.recency));
  }, [filters]);

  const filteredMoodboards = useMemo<Moodboard[]>(
    () => moodboards.filter((m) => matches(m.room, m.tags, `${m.title} ${m.blurb}`, filters)),
    [filters],
  );

  const visibleCount = pages * GALLERY_PAGE_SIZE;
  const gallery = filteredGallery.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGallery.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    timer.current = setTimeout(() => {
      setPages((p) => p + 1);
      setLoadingMore(false);
    }, 400);
  }, [loadingMore, hasMore]);

  /** Room chip counts as a filter alongside style and material/finish. */
  const activeFilterCount = (filters.room !== ALL_ROOMS ? 1 : 0) + (filters.style ? 1 : 0) + (filters.tag ? 1 : 0);
  const roomCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    galleryItems.forEach((g) => {
      counts[g.room] = (counts[g.room] ?? 0) + 1;
    });
    return counts;
  }, []);

  return {
    filters,
    update,
    clearAll,
    gallery,
    totalGallery: filteredGallery.length,
    moodboards: filteredMoodboards,
    hasMore,
    loadingMore,
    loadMore,
    activeFilterCount,
    roomCounts,
  };
}
