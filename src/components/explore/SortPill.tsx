import { Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import type { SortKey } from '@/hooks/useExplore';
import { colors, radius } from '@/theme';

const LABEL: Record<SortKey, string> = { curated: 'Curated', newest: 'Newest First' };

/** Two-option sort; tapping flips between them. */
export function SortPill({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <Pressable
      style={styles.pill}
      onPress={() => onChange(value === 'curated' ? 'newest' : 'curated')}
      accessibilityRole="button"
      accessibilityLabel={`Sort: ${LABEL[value]}. Tap to change`}
    >
      <AppText variant="captionStrong">{LABEL[value]}</AppText>
      <Feather name="chevron-down" size={14} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
});
