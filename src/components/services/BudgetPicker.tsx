import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import type { BudgetRange } from '@/types/content';
import { colors, radius, screenGutter, shadow } from '@/theme';

/** Tappable budget ranges; each routes to the service or category it suggests. */
export function BudgetPicker({ ranges, onPick }: { ranges: BudgetRange[]; onPick: (r: BudgetRange) => void }) {
  return (
    <View style={styles.wrap}>
      {ranges.map((r) => (
        <Pressable
          key={r.id}
          style={styles.row}
          haptic
          onPress={() => onPick(r)}
          accessibilityRole="button"
          accessibilityLabel={`${r.label}. ${r.hint}`}
        >
          <View style={styles.copy}>
            <AppText variant="h3">{r.label}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {r.hint}
            </AppText>
          </View>
          <Feather name="chevron-right" size={20} color={colors.inkMuted} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: screenGutter, gap: 10 },
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  copy: { flex: 1, gap: 2 },
});
