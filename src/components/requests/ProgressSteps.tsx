import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { strings } from '@/content/strings';
import { colors } from '@/theme';
import { PROGRESS_STEPS } from '@/utils/requestState';

/** Spoken form of the step, e.g. "Step 2 of 4, matched". The list card folds this into its own label. */
export const progressLabel = (done: number) => strings.requests.progressLabel(done, strings.requests.progressSteps[PROGRESS_STEPS[done - 1]]);

/**
 * The one progress indicator: four steps taken from the request's status. `done` is how many are complete
 * (1 to 4). `showLabel` adds the step as visible text; list cards leave it off because the status pill
 * already says where the request is, and the step stays available to screen readers.
 */
export function ProgressSteps({ done, showLabel = true }: { done: number; showLabel?: boolean }) {
  const label = progressLabel(done);
  return (
    <View style={styles.wrap} accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 1, max: 4, now: done }}>
      <View style={styles.bars}>
        {PROGRESS_STEPS.map((step, i) => (
          <View key={step} style={[styles.bar, i < done ? styles.barDone : styles.barTodo]} />
        ))}
      </View>
      {showLabel ? (
        <AppText variant="caption" color={colors.inkSoft}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
  barDone: { backgroundColor: colors.forest },
  barTodo: { backgroundColor: colors.border },
});
