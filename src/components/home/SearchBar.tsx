import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { colors, fonts, radius, screenGutter, shadow } from '@/theme';

interface Props {
  /** Controlled mode (Explore). Omit for the Home launcher behaviour: submit opens Explore. */
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  filterCount?: number;
  onFilterPress?: () => void;
  /** Set false on screens that have no filter sheet (Services). */
  showFilter?: boolean;
  /** Overrides the default a11y label. */
  accessibilityLabel?: string;
}

const DEFAULT_PLACEHOLDER = 'Try "Italian Quartz Kitchen Island"';

export function SearchBar({
  value,
  onChangeText,
  placeholder = DEFAULT_PLACEHOLDER,
  filterCount = 0,
  onFilterPress,
  showFilter = true,
  accessibilityLabel = 'Search designs and services',
}: Props) {
  const controlled = onChangeText !== undefined;
  const [local, setLocal] = useState('');
  const focus = useSharedValue(0);
  const goExplore = () => router.push('/explore');

  const wrapAnim = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], ['rgba(31,77,58,0)', colors.forest]),
    transform: [{ scale: 1 + focus.value * 0.01 }],
  }));

  return (
    <Animated.View style={[styles.wrap, wrapAnim]}>
      <Feather name="search" size={18} color={colors.inkSoft} />
      <TextInput
        value={controlled ? value : local}
        onChangeText={controlled ? onChangeText : setLocal}
        onSubmitEditing={controlled ? undefined : goExplore}
        onFocus={() => focus.set(withTiming(1, { duration: 200 }))}
        onBlur={() => focus.set(withTiming(0, { duration: 200 }))}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        style={styles.input}
        numberOfLines={1}
        accessibilityLabel={accessibilityLabel}
      />
      {controlled && value ? (
        <Pressable style={styles.round} accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChangeText?.('')}>
          <Feather name="x" size={16} color={colors.ink} />
        </Pressable>
      ) : showFilter ? (
        <Pressable style={styles.round} accessibilityRole="button" accessibilityLabel="Voice search">
          <Feather name="mic" size={16} color={colors.ink} />
        </Pressable>
      ) : null}
      {showFilter ? <Pressable
        style={[styles.round, styles.filter]}
        accessibilityRole="button"
        accessibilityLabel={filterCount ? `Filters, ${filterCount} active` : 'Filters'}
        onPress={onFilterPress ?? goExplore}
      >
        <Feather name="sliders" size={16} color={colors.white} />
        {filterCount > 0 ? (
          <View style={styles.badge}>
            <AppText variant="caption" color={colors.white} style={styles.badgeText}>
              {filterCount}
            </AppText>
          </View>
        ) : null}
      </Pressable> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: screenGutter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 8,
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  input: { flex: 1, fontFamily: fonts.sans, fontSize: 14, color: colors.ink, paddingVertical: 0 },
  round: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filter: { backgroundColor: colors.forest },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.accentRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, lineHeight: 13, fontFamily: fonts.sansBold },
});
