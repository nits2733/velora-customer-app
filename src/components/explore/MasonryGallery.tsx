import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { HeartButton } from '@/components/ui/HeartButton';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import type { DesignItem } from '@/content/explore';
import { useFavorites } from '@/hooks/useFavorites';
import { colors, radius, screenGutter, shadow } from '@/theme';

const GAP = 12;
const BODY_H = 78;

interface Props {
  items: DesignItem[];
  onOpen: (id: string) => void;
}

/** Two-column staggered gallery. Items go to whichever column is currently shorter. */
export function MasonryGallery({ items, onOpen }: Props) {
  const { width } = useWindowDimensions();
  const colW = Math.floor((width - screenGutter * 2 - GAP) / 2);

  const columns: DesignItem[][] = [[], []];
  const heights = [0, 0];
  items.forEach((item) => {
    const c = heights[0] <= heights[1] ? 0 : 1;
    columns[c].push(item);
    heights[c] += colW * item.ratio + BODY_H + GAP;
  });

  return (
    <View style={styles.row}>
      {columns.map((col, i) => (
        <View key={i} style={[styles.col, { width: colW }]}>
          {col.map((item) => (
            <GalleryCard key={item.id} item={item} width={colW} onOpen={onOpen} />
          ))}
        </View>
      ))}
    </View>
  );
}

function GalleryCard({ item, width, onOpen }: { item: DesignItem; width: number; onOpen: (id: string) => void }) {
  const { isSaved, toggle } = useFavorites();
  const imageH = Math.round(width * item.ratio);
  const saved = isSaved(item.id);
  return (
    <View style={styles.card}>
      <Pressable onPress={() => onOpen(item.id)} accessibilityRole="button" accessibilityLabel={`${item.title}, ${item.subtitle}`}>
        <RemoteImage src={item.image} width={width} height={imageH} style={{ width, height: imageH }} />
        <Badge label={item.label} tone="forest" style={styles.label} />
        <View style={styles.body}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {item.title}
          </AppText>
          <View style={styles.meta}>
            <AppText variant="caption" color={colors.inkSoft} numberOfLines={1} style={styles.place}>
              {item.subtitle}
            </AppText>
          </View>
        </View>
      </Pressable>
      <HeartButton style={styles.heart} saved={saved} onToggle={() => toggle(item.id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: GAP, paddingHorizontal: screenGutter, alignItems: 'flex-start' },
  col: { gap: GAP },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  label: { position: 'absolute', left: 10, bottom: BODY_H + 10 },
  heart: { position: 'absolute', top: 10, right: 10 },
  body: { height: BODY_H, paddingHorizontal: 12, paddingTop: 10, gap: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  place: { flex: 1 },
});
