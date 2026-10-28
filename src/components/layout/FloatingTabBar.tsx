import { Feather, Ionicons } from '@expo/vector-icons';
import type { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { colors, radius, shadow } from '@/theme';

type IconSpec = { lib: 'ion' | 'feather'; name: string; label: string };

const TABS: Record<string, IconSpec> = {
  index: { lib: 'ion', name: 'leaf-outline', label: 'Home' },
  explore: { lib: 'ion', name: 'sparkles-outline', label: 'Explore' },
  services: { lib: 'feather', name: 'grid', label: 'Services' },
  requests: { lib: 'feather', name: 'check-square', label: 'Requests' },
  profile: { lib: 'feather', name: 'user', label: 'Profile' },
};

export const TAB_BAR_HEIGHT = 68;
/** Minimum gap under the bar on devices without a bottom inset. */
export const TAB_BAR_MIN_BOTTOM = 10;

/** Total vertical space the floating bar occupies; use as scroll-content bottom padding. */
export function useTabBarSpace() {
  const { bottom } = useSafeAreaInsets();
  return Math.max(bottom, TAB_BAR_MIN_BOTTOM) + TAB_BAR_HEIGHT;
}

export type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

export function FloatingTabBar({ state, emitter, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.host, { paddingBottom: Math.max(insets.bottom, TAB_BAR_MIN_BOTTOM) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const spec = TABS[route.name];
          if (!spec) return null;
          return (
            <TabItem
              key={route.key}
              spec={spec}
              focused={state.index === i}
              onPress={() => {
                const e = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (state.index !== i && !e.defaultPrevented) navigateToTab(route.key);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({ spec, focused, onPress }: { spec: IconSpec; focused: boolean; onPress: () => void }) {
  const p = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    p.set(withTiming(focused ? 1 : 0, { duration: 220 }));
  }, [focused, p]);

  const color = focused ? colors.forest : colors.inkSoft;
  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(p.value, [0, 1], [1, 1.12]) }, { translateY: interpolate(p.value, [0, 1], [0, -1]) }],
  }));
  const dotAnim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ scale: p.value }] }));

  return (
    <Pressable
      style={styles.tab}
      haptic
      scaleTo={0.94}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={spec.label}
      onPress={onPress}
    >
      <Animated.View style={iconAnim}>
        {spec.lib === 'ion' ? (
          <Ionicons name={spec.name as keyof typeof Ionicons.glyphMap} size={22} color={color} />
        ) : (
          <Feather name={spec.name as keyof typeof Feather.glyphMap} size={21} color={color} />
        )}
      </Animated.View>
      <AppText variant={focused ? 'captionStrong' : 'caption'} color={color}>
        {spec.label}
      </AppText>
      <Animated.View style={[styles.indicator, dotAnim]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14 },
  bar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    ...shadow.floating,
  },
  tab: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 3 },
  indicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.clay },
});
