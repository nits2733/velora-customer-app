import { createContext, useContext, type ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

interface ScrollState {
  scrollY: SharedValue<number>;
  viewH: SharedValue<number>;
  contentH: SharedValue<number>;
}

const ScrollCtx = createContext<ScrollState | null>(null);
const ShownCtx = createContext<SharedValue<number> | null>(null);

const DURATION = 320;
const OFFSET = 16;
/** Block counts as visible once this many px of it are above the viewport bottom. */
const TRIGGER_MARGIN = 48;

/** Tracks scroll position on the UI thread so sections can reveal once as they enter view. */
export function useRevealScroll() {
  const scrollY = useSharedValue(0);
  const viewH = useSharedValue(0);
  const contentH = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const onLayout = (e: LayoutChangeEvent) => {
    viewH.set(e.nativeEvent.layout.height);
  };
  const onContentSizeChange = (_w: number, h: number) => {
    contentH.set(h);
  };
  return {
    value: { scrollY, viewH, contentH } satisfies ScrollState,
    onScroll,
    onLayout,
    onContentSizeChange,
    Provider: ScrollCtx.Provider,
  };
}

interface RevealProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** When false, only drives children's <Stagger> and does not animate itself. */
  animate?: boolean;
}

/** Fades + lifts its content in exactly once, the first time it scrolls into view. */
export function Reveal({ children, style, animate = true }: RevealProps) {
  const scroll = useContext(ScrollCtx);
  const reduce = useReducedMotion();
  const shown = useSharedValue(reduce || !scroll ? 1 : 0);
  const top = useSharedValue(-1);

  useAnimatedReaction(
    () => !!scroll && top.value >= 0 && scroll.scrollY.value + scroll.viewH.value > top.value + TRIGGER_MARGIN,
    (visible) => {
      if (visible && shown.value === 0) shown.value = 1;
    },
  );

  const anim = useAnimatedStyle(() => {
    if (!animate) return {};
    const p = withTiming(shown.value, { duration: DURATION, easing: Easing.out(Easing.cubic) });
    return { opacity: p, transform: [{ translateY: (1 - p) * OFFSET }] };
  });

  return (
    <ShownCtx.Provider value={shown}>
      <Animated.View style={[style, anim]} onLayout={(e) => top.set(e.nativeEvent.layout.y)}>
        {children}
      </Animated.View>
    </ShownCtx.Provider>
  );
}

interface StaggerProps {
  index: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  step?: number;
}

/** Child of <Reveal animate={false}>: enters with a short per-index delay. */
export function Stagger({ index, children, style, step = 55 }: StaggerProps) {
  const shown = useContext(ShownCtx);
  const anim = useAnimatedStyle(() => {
    if (!shown) return {};
    const p = withDelay(
      Math.min(index, 6) * step,
      withTiming(shown.value, { duration: 300, easing: Easing.out(Easing.cubic) }),
    );
    return { opacity: p, transform: [{ translateY: (1 - p) * 12 }] };
  });
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}
