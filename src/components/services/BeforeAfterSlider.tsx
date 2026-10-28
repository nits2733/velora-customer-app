import { memo, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import type { ShowcaseProject } from '@/types/content';
import { colors, radius, screenGutter, shadow } from '@/theme';

const GAP = 12;
const IMG_H = 200;

/**
 * Swipeable completed projects. Each card toggles Before/After with a cross-fade instead of a drag
 * handle, so it never fights the horizontal swipe between projects.
 */
export function BeforeAfterSlider({ projects }: { projects: ShowcaseProject[] }) {
  const { width } = useWindowDimensions();
  const w = width - screenGutter * 2;
  return (
    <FlatList
      data={projects}
      keyExtractor={(p) => p.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={w + GAP}
      decelerationRate="fast"
      disableIntervalMomentum
      contentContainerStyle={styles.row}
      ItemSeparatorComponent={Gap}
      renderItem={({ item }) => <ProjectCard project={item} width={w} />}
    />
  );
}

const Gap = () => <View style={styles.gap} />;

const ProjectCard = memo(function ProjectCard({ project, width }: { project: ShowcaseProject; width: number }) {
  const [after, setAfter] = useState(true);
  const p = useSharedValue(1);
  useEffect(() => {
    p.set(withTiming(after ? 1 : 0, { duration: 250 }));
  }, [after, p]);
  const afterStyle = useAnimatedStyle(() => ({ opacity: p.value }));
  const meta = project.budget ? `${project.location} · ${project.budget}` : project.location;

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.images}>
        <RemoteImage src={project.before} width={width} height={IMG_H} style={StyleSheet.absoluteFill} />
        <Animated.View style={[StyleSheet.absoluteFill, afterStyle]}>
          <RemoteImage src={project.after} width={width} height={IMG_H} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <View style={styles.toggle}>
          {(['Before', 'After'] as const).map((label) => {
            const on = (label === 'After') === after;
            return (
              <Pressable
                key={label}
                style={[styles.seg, on && styles.segOn]}
                onPress={() => setAfter(label === 'After')}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${label} photo of ${project.title}`}
              >
                <AppText variant="captionStrong" color={on ? colors.white : colors.ink}>
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.copy}>
        <AppText variant="h3" numberOfLines={1}>
          {project.title}
        </AppText>
        <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
          {meta}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter },
  gap: { width: GAP },
  card: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surface, ...shadow.card },
  images: { height: IMG_H, backgroundColor: colors.surfaceMuted },
  toggle: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', padding: 2, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.92)' },
  seg: { minHeight: 44, minWidth: 64, paddingHorizontal: 14, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.forest },
  copy: { padding: 14, gap: 2 },
});
