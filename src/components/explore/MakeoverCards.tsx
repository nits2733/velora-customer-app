import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { makeovers, spaceFilters, type SpaceFilter } from '@/content/explore';
import { colors, radius, screenGutter, shadow } from '@/theme';

const IMAGE_H = 150;
const GAP = 12;

/** Compact-home ideas, filterable by property configuration. */
export function MakeoverCards({ onOpen }: { onOpen: (id: string) => void }) {
  const { width } = useWindowDimensions();
  const [space, setSpace] = useState<SpaceFilter>('All');
  const data = useMemo(() => (space === 'All' ? makeovers : makeovers.filter((m) => m.space === space)), [space]);
  // Wide enough for readable text; the next card peeks to show the row scrolls.
  const cardW = Math.round((width - screenGutter * 2) * 0.5);
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {spaceFilters.map((s) => (
          <Chip key={s} label={s} selected={space === s} onPress={() => setSpace(s)} />
        ))}
      </ScrollView>
      <FlatList
        key={space}
        horizontal
        data={data}
        keyExtractor={(m) => m.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { width: cardW }]}
            onPress={() => onOpen(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${item.space} ${item.title}. ${item.detail}`}
          >
            <View>
              <RemoteImage src={item.image} width={cardW} height={IMAGE_H} style={styles.image} />
              <Badge label={item.space} tone="forest" style={styles.badge} />
            </View>
            <View style={styles.body}>
              <AppText variant="captionStrong" color={colors.clay}>
                {item.focus}
              </AppText>
              <AppText variant="bodyStrong" numberOfLines={2} style={styles.title}>
                {item.title}
              </AppText>
              <AppText variant="caption" color={colors.inkSoft} numberOfLines={3}>
                {item.detail}
              </AppText>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  tabs: { paddingHorizontal: screenGutter, gap: 8 },
  list: { paddingHorizontal: screenGutter },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  image: { width: '100%', height: IMAGE_H },
  badge: { position: 'absolute', top: 10, right: 10 },
  body: { padding: 12, gap: 4 },
  title: { minHeight: 40 },
});
