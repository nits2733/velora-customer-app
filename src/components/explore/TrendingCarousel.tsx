import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { HeartButton } from '@/components/ui/HeartButton';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import type { Moodboard } from '@/content/explore';
import { useFavorites } from '@/hooks/useFavorites';
import { colors, radius, screenGutter, shadow } from '@/theme';

const IMAGE_H = 210;
const GAP = 12;

interface Props {
  items: Moodboard[];
  onOpen: (id: string) => void;
}

export function TrendingCarousel({ items, onOpen }: Props) {
  const { width } = useWindowDimensions();
  // ~78% width leaves the next card clearly peeking so the row reads as scrollable.
  const cardW = Math.round((width - screenGutter * 2) * 0.78);
  const { isSaved, toggle } = useFavorites();

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(m) => m.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardW + GAP}
      decelerationRate="fast"
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={Gap}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: cardW }]}>
          <Pressable onPress={() => onOpen(item.id)} accessibilityRole="button" accessibilityLabel={item.title}>
            <RemoteImage src={item.image} width={cardW} height={IMAGE_H} style={styles.image} />
            <View style={styles.body}>
              <AppText variant="h3" numberOfLines={1}>
                {item.title}
              </AppText>
              <AppText variant="caption" color={colors.inkSoft} numberOfLines={2} style={styles.blurb}>
                {item.blurb}
              </AppText>
              <View style={styles.meta}>
                <View style={styles.metaItem}>
                  <Feather name="layers" size={13} color={colors.inkSoft} />
                  <AppText variant="caption" color={colors.inkSoft} numberOfLines={1} style={styles.materials}>
                    {item.materials}
                  </AppText>
                </View>
              </View>
            </View>
          </Pressable>
          <HeartButton
            icon="bookmark"
            style={styles.save}
            saved={isSaved(item.id)}
            onToggle={() => toggle(item.id)}
          />
        </View>
      )}
    />
  );
}

const Gap = () => <View style={{ width: GAP }} />;

const styles = StyleSheet.create({
  list: { paddingHorizontal: screenGutter },
  card: { borderRadius: radius.xl, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  image: { width: '100%', height: IMAGE_H },
  save: { position: 'absolute', top: 12, right: 12 },
  body: { padding: 14, gap: 4 },
  blurb: { minHeight: 34 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 },
  materials: { flexShrink: 1 },
});
