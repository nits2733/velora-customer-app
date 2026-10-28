import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { beforeAfter } from '@/content/home';
import { colors, radius, screenGutter } from '@/theme';

const HEIGHT = 250;
const HANDLE = 40;

/** Draggable before/after reveal. */
export function BeforeAfter() {
  const { width: screenW } = useWindowDimensions();
  const width = screenW - screenGutter * 2;
  const x = useSharedValue(width / 2);
  const start = useSharedValue(width / 2);
  const grab = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onStart(() => {
      start.value = x.value;
      grab.value = withSpring(1, { damping: 16, stiffness: 300 });
    })
    .onUpdate((e) => {
      x.value = Math.min(width, Math.max(0, start.value + e.translationX));
    })
    .onFinalize(() => {
      grab.value = withSpring(0, { damping: 16, stiffness: 300 });
    });

  const afterStyle = useAnimatedStyle(() => ({ width: x.value }));
  const handleStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - HANDLE / 2 }] }));
  const knobStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + grab.value * 0.14 }] }));
  const beforeBadge = useAnimatedStyle(() => ({ opacity: x.value > 90 ? 1 : 0 }));
  const afterBadge = useAnimatedStyle(() => ({ opacity: x.value < width - 90 ? 1 : 0 }));

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="eyebrow" color={colors.clay}>
            {beforeAfter.eyebrow}
          </AppText>
          <AppText variant="h1" accessibilityRole="header">
            {beforeAfter.title}
          </AppText>
        </View>
        <View style={styles.dragHint}>
          <Feather name="sliders" size={13} color={colors.ink} />
          <AppText variant="captionStrong">Drag</AppText>
        </View>
      </View>

      <GestureDetector gesture={pan}>
        <View style={[styles.stage, { width }]} accessible accessibilityLabel="Before and after comparison. Drag to reveal.">
          {/* AFTER sits underneath, BEFORE is clipped on the left */}
          <RemoteImage src={beforeAfter.after} width={width} height={HEIGHT} style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.beforeClip, afterStyle]}>
            <RemoteImage src={beforeAfter.before} width={width} height={HEIGHT} style={{ width, height: HEIGHT }} />
          </Animated.View>
          <Animated.View style={[styles.badgeLeft, beforeBadge]} pointerEvents="none">
            <Badge label="BEFORE" tone="forest" />
          </Animated.View>
          <Animated.View style={[styles.badgeRight, afterBadge]} pointerEvents="none">
            <Badge label="AFTER" tone="forest" />
          </Animated.View>
          <Animated.View style={[styles.divider, handleStyle]} pointerEvents="none">
            <View style={styles.line} />
            <Animated.View style={[styles.handle, knobStyle]}>
              <Feather name="more-vertical" size={18} color={colors.ink} />
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={styles.footer}>
        <AppText variant="caption" color={colors.inkSoft}>
          Turnaround: <AppText variant="captionStrong">{beforeAfter.turnaround}</AppText>
        </AppText>
        <AppText variant="caption" color={colors.inkSoft}>
          Budget: <AppText variant="captionStrong">{beforeAfter.budget}</AppText>
        </AppText>
        <Pressable style={styles.link} onPress={() => router.push('/explore')} accessibilityRole="link">
          <AppText variant="captionStrong" style={styles.linkText}>
            View Full Case Study
          </AppText>
          <Feather name="arrow-right" size={14} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: screenGutter, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 },
  headerCopy: { flex: 1 },
  dragHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  stage: { height: HEIGHT, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.surfaceMuted },
  beforeClip: { position: 'absolute', left: 0, top: 0, bottom: 0, overflow: 'hidden' },
  badgeLeft: { position: 'absolute', left: 12, bottom: 12 },
  badgeRight: { position: 'absolute', right: 12, bottom: 12 },
  divider: { position: 'absolute', top: 0, bottom: 0, width: HANDLE, alignItems: 'center' },
  line: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: colors.white },
  handle: {
    position: 'absolute',
    top: HEIGHT / 2 - HANDLE / 2,
    width: HANDLE,
    height: HANDLE,
    borderRadius: HANDLE / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 120 },
  linkText: { textAlign: 'right', flexShrink: 1 },
});
