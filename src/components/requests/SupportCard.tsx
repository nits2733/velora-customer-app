import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { useSupport } from '@/hooks/useSupport';
import { colors, radius, screenGutter } from '@/theme';

/** "Need help?" on a request. Opens the configured support channel; hours appear only when configured. */
export function SupportCard({ requestId }: { requestId: number }) {
  const support = useSupport();
  const d = strings.detail;
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Feather name="life-buoy" size={20} color={colors.forest} />
        <AppText variant="h3" accessibilityRole="header">
          {d.help.title}
        </AppText>
      </View>
      <AppText variant="body" color={colors.inkSoft}>
        {d.help.body}
      </AppText>
      {support.hours ? (
        <AppText variant="caption" color={colors.inkSoft}>
          {d.supportHours(support.hours)}
        </AppText>
      ) : null}
      <Button label={d.help.action} variant="quiet" onPress={() => support.open('request_detail', d.supportMessage(requestId))} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 16, gap: 10, borderRadius: radius.lg, backgroundColor: colors.surfaceMuted },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
