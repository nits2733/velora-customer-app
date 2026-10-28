import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { colors, radius, screenGutter } from '@/theme';

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

/** Removable pills for every active filter, plus a clear-all. Renders nothing when none are active. */
export function ActiveFilters({ filters, onClearAll }: { filters: ActiveFilter[]; onClearAll: () => void }) {
  if (!filters.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {filters.map((f) => (
        <Animated.View key={f.key} entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)} layout={LinearTransition}>
          <Pressable
            style={styles.pill}
            onPress={f.onRemove}
            accessibilityRole="button"
            accessibilityLabel={`Remove filter ${f.label}`}
          >
            <AppText variant="captionStrong" color={colors.forestDeep}>
              {f.label}
            </AppText>
            <Feather name="x" size={14} color={colors.forestDeep} />
          </Pressable>
        </Animated.View>
      ))}
      <Pressable style={styles.clear} onPress={onClearAll} accessibilityRole="button" accessibilityLabel="Clear all filters">
        <AppText variant="captionStrong" color={colors.inkSoft}>
          Clear all
        </AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter, gap: 8, alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.forestSoft },
  clear: { minHeight: 44, paddingHorizontal: 8, justifyContent: 'center' },
});
