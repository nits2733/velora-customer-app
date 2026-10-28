import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { transformations, type Transformation } from '@/content/explore';
import { colors, radius, screenGutter } from '@/theme';

const FEATURED_H = 240;
const SMALL_H = 130;
const PAD = 12;
const GAP = 12;

/** One large featured transformation idea followed by a row of two smaller ones. */
export function Transformations({ onOpen }: { onOpen: (id: string) => void }) {
  const { width } = useWindowDimensions();
  const inner = width - screenGutter * 2;
  const [featured, ...rest] = transformations;
  const smallW = Math.floor((inner - GAP) / 2);
  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.card}
        onPress={() => onOpen(featured.id)}
        accessibilityRole="button"
        accessibilityLabel={`${featured.title}, ${featured.place}`}
      >
        <View style={styles.imageWrap}>
          <RemoteImage src={featured.image} width={inner - PAD * 2} height={FEATURED_H} style={StyleSheet.absoluteFill} />
          <View style={styles.place}>
            <AppText variant="captionStrong">{featured.place}</AppText>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.copy}>
            <AppText variant="bodyStrong">{featured.title}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {featured.detail}
            </AppText>
          </View>
          <View style={styles.action}>
            <AppText variant="captionStrong">Explore</AppText>
            <Feather name="arrow-right" size={14} color={colors.ink} />
          </View>
        </View>
      </Pressable>
      <View style={styles.row}>
        {rest.map((t) => (
          <SmallCard key={t.id} item={t} width={smallW} onOpen={onOpen} />
        ))}
      </View>
    </View>
  );
}

function SmallCard({ item, width, onOpen }: { item: Transformation; width: number; onOpen: (id: string) => void }) {
  return (
    <Pressable
      style={[styles.small, { width }]}
      onPress={() => onOpen(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.place}`}
    >
      <RemoteImage src={item.image} width={width} height={SMALL_H} style={{ width, height: SMALL_H }} />
      <View style={styles.smallBody}>
        <AppText variant="captionStrong" color={colors.clay}>
          {item.place}
        </AppText>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {item.title}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: screenGutter, gap: GAP },
  card: { padding: PAD, borderRadius: radius.xl, backgroundColor: colors.surfaceMuted, gap: 12 },
  imageWrap: { height: FEATURED_H, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.border },
  place: { position: 'absolute', right: 10, bottom: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.92)' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 2, minHeight: 48 },
  copy: { flex: 1, gap: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', gap: GAP },
  small: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden' },
  smallBody: { padding: 12, gap: 2, minHeight: 80 },
});
