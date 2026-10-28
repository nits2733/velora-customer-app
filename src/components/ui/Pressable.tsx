import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
}

/**
 * Press feedback on the UI thread: subtle scale spring, eased fade when disabled, optional haptic.
 * Reanimated springs/timings follow the system reduce-motion setting by default.
 */
export function Pressable({
  style,
  scaleTo = 0.97,
  haptic = false,
  disabled,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: Props) {
  const s = useSharedValue(1);
  const o = useSharedValue(disabled ? 0.6 : 1);

  useEffect(() => {
    o.set(withTiming(disabled ? 0.6 : 1, { duration: 180 }));
  }, [disabled, o]);

  const anim = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ scale: s.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      style={[style, anim]}
      onPressIn={(e) => {
        s.set(withSpring(scaleTo, { damping: 18, stiffness: 320 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.set(withSpring(1, { damping: 18, stiffness: 320 }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
    />
  );
}
