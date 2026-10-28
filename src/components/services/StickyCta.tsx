import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, useAnimatedReaction, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useTabBarSpace } from '@/components/layout/FloatingTabBar';
import { Button } from '@/components/ui/Button';
import { colors, screenGutter } from '@/theme';

const SHOW_AFTER = 420;

/** Hide when this much content is left below the viewport, i.e. the "Not sure where to start?" card is on screen with the same action. */
const HIDE_NEAR_END = 460;

interface Props {
  scroll: { scrollY: SharedValue<number>; viewH: SharedValue<number>; contentH: SharedValue<number> };
  label: string;
  onPress: () => void;
}

/** Floating action above the tab bar; shown after the hero and hidden again near the end of the page. */
export function StickyCta({ scroll, label, onPress }: Props) {
  const bottom = useTabBarSpace();
  const [visible, setVisible] = useState(false);

  useAnimatedReaction(
    () => {
      const y = scroll.scrollY.value;
      const remaining = scroll.contentH.value - (y + scroll.viewH.value);
      return y > SHOW_AFTER && remaining > HIDE_NEAR_END;
    },
    (now, prev) => {
      if (now !== prev) scheduleOnRN(setVisible, now);
    },
  );

  if (!visible) return null;
  return (
    <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutDown.duration(180)} style={[styles.wrap, { bottom: bottom + 8 }]}>
      <Button label={label} onPress={onPress} right={<Feather name="arrow-right" size={16} color={colors.white} />} />
    </Animated.View>
  );
}

/** Extra scroll padding so the last section clears the floating button. */
export const STICKY_CTA_SPACE = 64;

const styles = StyleSheet.create({ wrap: { position: 'absolute', left: screenGutter, right: screenGutter } });
