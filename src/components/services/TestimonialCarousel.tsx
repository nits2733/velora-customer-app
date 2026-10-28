import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { Testimonial } from '@/types/content';
import { colors, radius, screenGutter, shadow } from '@/theme';

const GAP = 12;

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const { width } = useWindowDimensions();
  const w = width - screenGutter * 2 - 24;
  return (
    <FlatList
      data={items}
      keyExtractor={(t) => t.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={w + GAP}
      decelerationRate="fast"
      disableIntervalMomentum
      contentContainerStyle={styles.row}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: w }]} accessible accessibilityLabel={`${item.name}, ${item.locality}. ${item.project}. ${item.quote}`}>
          <Feather name="message-circle" size={18} color={colors.forest} accessibilityElementsHidden />
          <AppText variant="body" numberOfLines={5}>
            {item.quote}
          </AppText>
          <View>
            <AppText variant="bodyStrong">{item.name}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {item.locality} · {item.project}
            </AppText>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter, gap: GAP },
  card: { padding: 18, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
});
