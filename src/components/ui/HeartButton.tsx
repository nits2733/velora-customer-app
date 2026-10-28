import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';
import { Pressable } from './Pressable';

interface Props {
  saved: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: 'heart' | 'bookmark';
}

/** Save toggle with a quick spring "pop" when the heart fills. */
export function HeartButton({ saved, onToggle, style, icon = 'heart' }: Props) {
  const pop = useSharedValue(1);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const toggle = () => {
    if (!saved) {
      pop.set(
        withSequence(withTiming(0.8, { duration: 80 }), withSpring(1, { damping: 7, stiffness: 260 })),
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onToggle();
  };

  return (
    <Pressable
      style={[styles.btn, style]}
      hitSlop={8}
      scaleTo={0.9}
      onPress={toggle}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={saved ? icon : (`${icon}-outline` as 'heart-outline')}
          size={19}
          color={saved ? (icon === 'heart' ? colors.accentRed : colors.forest) : colors.ink}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
