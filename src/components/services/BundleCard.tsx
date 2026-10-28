import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import type { Bundle } from '@/types/content';
import { colors, radius, screenGutter, shadow } from '@/theme';

const W = 260;
const H = 168;

export const BundleCard = memo(function BundleCard({ bundle, onPress }: { bundle: Bundle; onPress: (b: Bundle) => void }) {
  return (
    <Pressable
      style={styles.card}
      haptic
      onPress={() => onPress(bundle)}
      accessibilityRole="button"
      accessibilityLabel={`${bundle.title}. ${bundle.description}${bundle.savings ? `. ${bundle.savings}` : ''}`}
    >
      <RemoteImage src={bundle.image} width={W} height={H} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(8,24,16,0.05)', 'rgba(20,54,38,0.92)']} style={styles.fade} />
      {bundle.savings ? (
        <View style={styles.pill}>
          <AppText variant="eyebrow" color={colors.forestDeep} style={styles.pillText}>
            {bundle.savings}
          </AppText>
        </View>
      ) : (
        <View />
      )}
      <View style={styles.copy}>
        <AppText variant="h3" color={colors.white} numberOfLines={2}>
          {bundle.title}
        </AppText>
        <AppText variant="caption" color={colors.white} numberOfLines={2} style={styles.desc}>
          {bundle.description}
        </AppText>
      </View>
    </Pressable>
  );
});

/** Horizontal row of bundles. */
export function BundleRow({ bundles, onPress }: { bundles: Bundle[]; onPress: (b: Bundle) => void }) {
  return (
    <FlatList
      data={bundles}
      keyExtractor={(b) => b.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      renderItem={({ item }) => <BundleCard bundle={item} onPress={onPress} />}
    />
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter, gap: 12 },
  card: { width: W, height: H, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'space-between', backgroundColor: colors.surfaceMuted, ...shadow.card },
  fade: { ...StyleSheet.absoluteFill, top: '30%' },
  pill: { alignSelf: 'flex-start', margin: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.92)' },
  pillText: { fontSize: 10 },
  copy: { padding: 14, gap: 2 },
  desc: { opacity: 0.92 },
});
