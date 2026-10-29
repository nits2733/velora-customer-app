import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { IconName } from '@/content/services';
import { colors, radius, screenGutter, shadow } from '@/theme';

export interface Benefit {
  icon: IconName;
  title: string;
  body: string;
}

/** A titled list of what the tab does, one icon and two lines each. Every row says only what the backend can do today. */
export function BenefitRows({ title, benefits }: { title: string; benefits: readonly Benefit[] }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="h3" accessibilityRole="header">
        {title}
      </AppText>
      {benefits.map((b) => (
        <View key={b.title} style={styles.row} accessible accessibilityLabel={`${b.title}. ${b.body}`}>
          <View style={styles.icon}>
            <Feather name={b.icon} size={18} color={colors.forest} />
          </View>
          <View style={styles.copy}>
            <AppText variant="bodyStrong">{b.title}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {b.body}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: screenGutter, gap: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.forestSoft },
  copy: { flex: 1, gap: 2 },
});
