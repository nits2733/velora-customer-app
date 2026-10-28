import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Pressable } from '@/components/ui/Pressable';
import { colors, fonts, radius, screenGutter, shadow } from '@/theme';

const PLACEHOLDER = 'Italian Quartz Kitchen Island';

export function SearchBar() {
  const [q, setQ] = useState('');
  const focus = useSharedValue(0);
  const submit = () => router.push('/explore');

  const wrapAnim = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], ['rgba(31,77,58,0)', colors.forest]),
    transform: [{ scale: 1 + focus.value * 0.01 }],
  }));

  return (
    <Animated.View style={[styles.wrap, wrapAnim]}>
      <Feather name="search" size={18} color={colors.inkSoft} />
      <TextInput
        value={q}
        onChangeText={setQ}
        onSubmitEditing={submit}
        onFocus={() => focus.set(withTiming(1, { duration: 200 }))}
        onBlur={() => focus.set(withTiming(0, { duration: 200 }))}
        returnKeyType="search"
        placeholder={`Try "${PLACEHOLDER}"`}
        placeholderTextColor={colors.inkMuted}
        style={styles.input}
        accessibilityLabel="Search designs and services"
      />
      <Pressable style={styles.round} accessibilityRole="button" accessibilityLabel="Voice search">
        <Feather name="mic" size={16} color={colors.ink} />
      </Pressable>
      <Pressable style={[styles.round, styles.filter]} accessibilityRole="button" accessibilityLabel="Filters" onPress={submit}>
        <Feather name="sliders" size={16} color={colors.white} />
      </Pressable>
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
});
