import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter } from '@/theme';
import { tonePalette } from '@/theme/tones';

function Card({ icon, title, body, children, tone = 'grey' }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; body: string; children?: React.ReactNode; tone?: 'grey' | 'red' }) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={[styles.iconWrap, { backgroundColor: tonePalette[tone].bg }]}>
        <Feather name={icon} size={22} color={tonePalette[tone].fg} />
      </View>
      <AppText variant="h3" style={styles.center} accessibilityRole="header">
        {title}
      </AppText>
      <AppText variant="body" color={colors.inkSoft} style={styles.center}>
        {body}
      </AppText>
      {children}
    </View>
  );
}

/** Placeholder with the same anatomy as a request card: title, meta, status pill, progress bar, next line. */
function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton width="55%" height={20} r={6} />
      <Skeleton width="38%" height={12} r={6} />
      <Skeleton width={150} height={28} r={radius.pill} style={styles.skeletonPill} />
      <Skeleton height={6} r={3} />
      <Skeleton width="80%" height={14} r={6} />
    </View>
  );
}

export function RequestSkeletons({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.skeletons} accessibilityLabel="Loading your requests" accessibilityRole="progressbar">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

/** First-time customers (Active) and an empty history (Past). The Active version points to where requests start. */
export function EmptyRequests({ tab }: { tab: 'active' | 'past' }) {
  const e = strings.requests.empty;
  return tab === 'active' ? (
    <Card icon="inbox" title={e.activeTitle} body={e.activeBody}>
      <View style={styles.ctas}>
        <Button label={e.browseServices} onPress={() => router.push('/services')} />
        <Button label={e.browseIdeas} variant="quiet" onPress={() => router.push('/explore')} />
      </View>
    </Card>
  ) : (
    <Card icon="archive" title={e.pastTitle} body={e.pastBody} />
  );
}

/** A failed load, or no network. Offline says so plainly and refreshes by itself on reconnect. */
export function RequestsError({ offline, onRetry }: { offline: boolean; onRetry: () => void }) {
  const e = strings.requests.error;
  return (
    <Card icon={offline ? 'wifi-off' : 'alert-circle'} tone="red" title={offline ? e.offlineTitle : e.title} body={offline ? e.offlineBody : strings.detail.genericError}>
      <View style={styles.ctas}>
        <Button label={e.retry} onPress={onRetry} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 24, gap: 10, alignItems: 'center', borderRadius: radius.lg, backgroundColor: colors.surface },
  iconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  ctas: { alignSelf: 'stretch', gap: 8, marginTop: 6 },
  skeletons: { gap: 12 },
  skeletonCard: { marginHorizontal: screenGutter, padding: 14, gap: 10, borderRadius: radius.lg, backgroundColor: colors.surface },
  skeletonPill: { marginTop: 2 },
});
