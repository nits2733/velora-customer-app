import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, fonts, radius } from '@/theme';
import { Pressable } from './Pressable';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Filter chip; background and label colour cross-fade when selected. */
export function Chip({ label, selected, onPress }: Props) {
  const p = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    p.set(withTiming(selected ? 1 : 0, { duration: 200 }));
  }, [selected, p]);

  const bg = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.surface, colors.forest]),
    borderColor: interpolateColor(p.value, [0, 1], [colors.border, colors.forest]),
  }));
  const text = useAnimatedStyle(() => ({ color: interpolateColor(p.value, [0, 1], [colors.ink, colors.white]) }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={styles.hit}
    >
      <Animated.View style={[styles.chip, bg]}>
        <Animated.Text style={[styles.label, text]}>{label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { minHeight: 44, justifyContent: 'center' },
  chip: { paddingHorizontal: 16, height: 40, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center' },
  label: { fontFamily: fonts.sansSemi, fontSize: 13 },
});
