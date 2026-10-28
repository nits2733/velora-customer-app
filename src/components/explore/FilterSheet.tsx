import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable as RNPressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Pressable } from '@/components/ui/Pressable';
import { materials, styleOptions } from '@/content/explore';
import { colors, radius, screenGutter } from '@/theme';

export interface SheetValue {
  style: string | null;
  tag: string | null;
}

interface Props {
  initial: SheetValue;
  onApply: (v: SheetValue) => void;
  onClose: () => void;
}

const SLIDE = 520;
const TAGS = materials.map((m) => m.name);

/** Bottom sheet. Mount to open; it animates out and then calls onClose, so the parent just unmounts it. */
export function FilterSheet({ initial, onApply, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<SheetValue>(initial);
  const p = useSharedValue(0);

  useEffect(() => {
    p.set(withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }));
  }, [p]);

  const dismiss = (after?: () => void) => {
    p.set(
      withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) scheduleOnRN(() => {
          onClose();
          after?.();
        });
      }),
    );
  };

  const backdrop = useAnimatedStyle(() => ({ opacity: p.value }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - p.value) * SLIDE }] }));

  return (
    <Modal transparent visible animationType="none" onRequestClose={() => dismiss()} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, backdrop]}>
        <RNPressable style={StyleSheet.absoluteFill} onPress={() => dismiss()} accessibilityLabel="Close filters" />
      </Animated.View>
      <View style={styles.host} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }, sheet]}>
          <View style={styles.grab} />
          <View style={styles.head}>
            <AppText variant="h2" accessibilityRole="header">
              Filters
            </AppText>
            <Pressable onPress={() => dismiss()} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}>
              <Feather name="x" size={20} color={colors.ink} />
            </Pressable>
          </View>

          <AppText variant="eyebrow" color={colors.clay} style={styles.group}>
            Design style
          </AppText>
          <View style={styles.wrap}>
            {styleOptions.map((s) => (
              <Chip key={s} label={s} selected={draft.style === s} onPress={() => setDraft((d) => ({ ...d, style: d.style === s ? null : s }))} />
            ))}
          </View>

          <AppText variant="eyebrow" color={colors.clay} style={styles.group}>
            Material or finish
          </AppText>
          <View style={styles.wrap}>
            {TAGS.map((t) => (
              <Chip key={t} label={t} selected={draft.tag === t} onPress={() => setDraft((d) => ({ ...d, tag: d.tag === t ? null : t }))} />
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              label="Reset"
              variant="light"
              style={styles.reset}
              onPress={() => setDraft({ style: null, tag: null })}
            />
            <Button label="Show results" style={styles.apply} onPress={() => dismiss(() => onApply(draft))} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  host: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: screenGutter,
    paddingTop: 10,
  },
  grab: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 12 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  group: { marginTop: 8, marginBottom: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  reset: { flex: 1, borderColor: colors.border },
  apply: { flex: 2 },
});
