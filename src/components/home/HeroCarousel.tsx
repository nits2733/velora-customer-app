import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { Badge } from '@/components/ui/Badge';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { heroSlides, heroStats } from '@/content/home';
import { colors, radius, screenGutter, shadow } from '@/theme';

const IMAGE_HEIGHT = 300;
const GAP = 12;

type Slide = (typeof heroSlides)[number];

export function HeroCarousel() {
  const { width } = useWindowDimensions();
  const cardW = width - screenGutter * 2 - 28; // leave a peek of the next card
  const step = cardW + GAP;
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  return (
    <View style={styles.wrap}>
      <Animated.FlatList
        horizontal
        data={heroSlides}
        keyExtractor={(s) => s.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        renderItem={({ item, index }) => <SlideCard item={item} index={index} width={cardW} step={step} scrollX={scrollX} />}
      />
      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {heroSlides.map((s, i) => (
          <Dot key={s.id} index={i} step={step} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
}

const Separator = () => <View style={{ width: GAP }} />;

function SlideCard({
  item,
  index,
  width,
  step,
  scrollX,
}: {
  item: Slide;
  index: number;
  width: number;
  step: number;
  scrollX: SharedValue<number>;
}) {
  const anim = useAnimatedStyle(() => {
    const input = [(index - 1) * step, index * step, (index + 1) * step];
    return {
      opacity: interpolate(scrollX.value, input, [0.7, 1, 0.7], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(scrollX.value, input, [0.96, 1, 0.96], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Animated.View style={[styles.card, { width }, anim]}>
      <View style={styles.imageWrap}>
        <RemoteImage src={item.image} width={width} height={IMAGE_HEIGHT} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['transparent', 'rgba(8,24,16,0.85)']} style={styles.fade} />
        <Badge label={item.tag} tone="light" style={styles.tag} />
        <View style={styles.copy}>
          <AppText variant="eyebrow" color={colors.mint}>
            {item.eyebrow}
          </AppText>
          <AppText variant="h1" color={colors.white}>
            {item.title}
          </AppText>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.rating}>
          <View style={styles.ratingChip}>
            <AppText variant="captionStrong" color={colors.forestDeep}>
              {heroStats.rating}
            </AppText>
            <Feather name="star" size={11} color={colors.forestDeep} />
          </View>
          <AppText variant="caption" color={colors.inkSoft}>
            {heroStats.homesDelivered} homes{'\n'}delivered
          </AppText>
        </View>
        <Button
          label="Explore Catalog"
          onPress={() => router.push('/explore')}
          right={<Feather name="arrow-right" size={16} color={colors.white} />}
          style={styles.cta}
        />
      </View>
    </Animated.View>
  );
}

function Dot({ index, step, scrollX }: { index: number; step: number; scrollX: SharedValue<number> }) {
  const anim = useAnimatedStyle(() => {
    const input = [(index - 1) * step, index * step, (index + 1) * step];
    return {
      width: interpolate(scrollX.value, input, [6, 20, 6], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.35, 1, 0.35], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, anim]} />;
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  list: { paddingHorizontal: screenGutter },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadow.card },
  imageWrap: { height: IMAGE_HEIGHT, justifyContent: 'flex-end', backgroundColor: colors.surfaceMuted },
  fade: { ...StyleSheet.absoluteFill, top: '35%' },
  tag: { position: 'absolute', top: 14, left: 14 },
  copy: { padding: 16, gap: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.forestSoft,
  },
  cta: { flex: 1, maxWidth: 170, paddingHorizontal: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  dot: { height: 6, borderRadius: 3, backgroundColor: colors.forest },
});
