import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter, shadow } from '@/theme';
import type { TimelineEvent, BookingStatus, Unknown } from '@/types/requests';
import { formatDateTime } from '@/utils/format';
import { timelineRows, upNext } from '@/utils/timeline';

interface Props {
  events: readonly TimelineEvent[];
  status: BookingStatus | Unknown;
}

/**
 * What has happened, with when, followed by what is still ahead. Only past events carry a date; the
 * steps ahead have none, so a future date never sits beside a step that looks current.
 */
export function StatusTimeline({ events, status }: Props) {
  const done = timelineRows(events);
  const ahead = upNext(status);
  const lastDone = done.length - 1;

  return (
    <View style={styles.card}>
      <AppText variant="h3" accessibilityRole="header" style={styles.title}>
        {strings.detail.timeline}
      </AppText>

      {done.map((row, i) => (
        <View key={row.id} style={styles.row} accessible accessibilityLabel={`${row.label}, ${formatDateTime(row.at)}`}>
          <View style={styles.rail}>
            <View style={[styles.node, styles.nodeDone]}>
              <Feather name="check" size={12} color={colors.white} />
            </View>
            {i < lastDone || ahead.length ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.copy}>
            <AppText variant="bodyStrong">{row.label}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {formatDateTime(row.at)}
            </AppText>
          </View>
        </View>
      ))}

      {ahead.map((label, i) => (
        <View key={label} style={styles.row} accessible accessibilityLabel={`${strings.detail.upNext}: ${label}`}>
          <View style={styles.rail}>
            <View style={[styles.node, styles.nodeNext]} />
            {i < ahead.length - 1 ? <View style={[styles.line, styles.lineNext]} /> : null}
          </View>
          <View style={styles.copy}>
            <AppText variant="bodyStrong" color={colors.inkSoft}>
              {label}
            </AppText>
            {i === 0 ? (
              <AppText variant="caption" color={colors.inkSoft}>
                {strings.detail.upNext}
              </AppText>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  title: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, minHeight: 52 },
  rail: { width: 22, alignItems: 'center' },
  node: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.forest },
  nodeNext: { borderWidth: 2, borderColor: colors.inkMuted, backgroundColor: colors.surface },
  line: { flex: 1, width: 2, marginVertical: 2, backgroundColor: colors.forest },
  lineNext: { backgroundColor: colors.border },
  copy: { flex: 1, paddingBottom: 14, gap: 2 },
});
