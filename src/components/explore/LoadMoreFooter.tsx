import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, radius, screenGutter } from '@/theme';

interface Props {
  loading: boolean;
  hasMore: boolean;
  total: number;
}

/** Gallery footer: spinner only while a page is actually loading, end message once exhausted. */
export function LoadMoreFooter({ loading, hasMore, total }: Props) {
  if (loading) {
    return (
      <View style={styles.wrap}>
        <View style={styles.skeletons}>
          <Skeleton height={140} style={styles.sk} />
          <Skeleton height={140} style={styles.sk} />
        </View>
        <View style={styles.pill}>
          <ActivityIndicator size="small" color={colors.forest} />
          <AppText variant="caption" color={colors.inkSoft}>
            Curating more spaces for you…
          </AppText>
        </View>
      </View>
    );
  }
  if (!hasMore && total > 0) {
    return (
      <View style={styles.wrap}>
        <View style={styles.pill}>
          <Feather name="check-circle" size={14} color={colors.forest} />
          <AppText variant="caption" color={colors.inkSoft}>
            You have seen all {total} designs
          </AppText>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14, marginTop: 16, paddingHorizontal: screenGutter },
  skeletons: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  sk: { flex: 1 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
});
