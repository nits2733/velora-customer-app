import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import type { ResolvedPromo } from '@/hooks/useServices';
import { colors, radius, screenGutter, shadow } from '@/theme';

const GAP = 12;
const CARD_H = 250;
/** Extra image width on each side so the parallax shift never reveals an edge. */
const BLEED = 24;

interface Props {
  promos: ResolvedPromo[];
  onPress: (promo: ResolvedPromo) => void;
}

/** Snap-paged promo cards with a light image parallax and animated pagination dots. */
export function HeroCarousel({ promos, onPress }: Props) {
  const { width } = useWindowDimensions();
  const cardW = width - screenGutter * 2;
  const step = cardW + GAP;
  const x = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });

  return (
    <View>
      <Animated.FlatList
        data={promos}
        keyExtractor={(p) => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Gap}
        renderItem={({ item, index }) => <HeroCard promo={item} index={index} x={x} step={step} width={cardW} onPress={onPress} />}
      />
      {promos.length > 1 ? (
        <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {promos.map((p, i) => (
            <Dot key={p.id} index={i} x={x} step={step} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const Gap = () => <View style={styles.gap} />;

interface CardProps {
  promo: ResolvedPromo;
  index: number;
  x: SharedValue<number>;
  step: number;
  width: number;
  onPress: (promo: ResolvedPromo) => void;
}

const HeroCard = memo(function HeroCard({ promo, index, x, step, width, onPress }: CardProps) {
  const reduce = useReducedMotion();
  const parallax = useAnimatedStyle(() => {
    if (reduce) return {};
    return {
      transform: [
        { translateX: interpolate(x.value, [(index - 1) * step, (index + 1) * step], [-BLEED, BLEED], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Pressable
      style={[styles.card, { width }]}
      haptic
      onPress={() => onPress(promo)}
      accessibilityRole="button"
      accessibilityLabel={`${promo.title}. ${promo.promise}. ${promo.cta}`}
    >
      <Animated.View style={[styles.imageWrap, { left: -BLEED, width: width + BLEED * 2 }, parallax]}>
        <RemoteImage src={promo.image} width={width + BLEED * 2} height={CARD_H} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <LinearGradient colors={['rgba(8,24,16,0.05)', 'rgba(20,54,38,0.92)']} style={styles.fade} />
      <View style={styles.pill}>
        <AppText variant="eyebrow" color={colors.forestDeep} numberOfLines={1}>
          {promo.eyebrow}
        </AppText>
      </View>
      <View style={styles.copy}>
        <AppText variant="h2" color={colors.white} numberOfLines={2}>
          {promo.title}
        </AppText>
        <AppText variant="caption" color={colors.white} numberOfLines={2} style={styles.promise}>
          {promo.promise}
        </AppText>
        <View style={styles.cta}>
          <AppText variant="captionStrong" color={colors.forestDeep}>
            {promo.cta}
          </AppText>
          <Feather name="arrow-right" size={14} color={colors.forestDeep} />
        </View>
      </View>
    </Pressable>
  );
});

function Dot({ index, x, step }: { index: number; x: SharedValue<number>; step: number }) {
  const style = useAnimatedStyle(() => {
    const range = [(index - 1) * step, index * step, (index + 1) * step];
    return {
      width: interpolate(x.value, range, [6, 18, 6], Extrapolation.CLAMP),
      opacity: interpolate(x.value, range, [0.35, 1, 0.35], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: screenGutter },
  gap: { width: GAP },
  card: { height: CARD_H, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surfaceMuted, justifyContent: 'space-between', ...shadow.card },
  imageWrap: { position: 'absolute', top: 0, bottom: 0 },
  fade: { ...StyleSheet.absoluteFill, top: '25%' },
  pill: { alignSelf: 'flex-start', margin: 14, maxWidth: '80%', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.92)' },
  copy: { padding: 16, gap: 6 },
  promise: { opacity: 0.92 },
  cta: { alignSelf: 'flex-start', marginTop: 6, minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.white },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  dot: { height: 6, borderRadius: 3, backgroundColor: colors.forest },
});
