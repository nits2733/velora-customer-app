import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { trustPoints } from '@/content/services';
import { colors, radius, screenGutter } from '@/theme';

/** Compact reassurance row. Items live in content/services.ts and only state what the request flow does. */
export function TrustStrip() {
  return (
    <View style={styles.row}>
      {trustPoints.map((t) => (
        <View key={t.label} style={styles.item}>
          <Feather name={t.icon} size={16} color={colors.forest} accessibilityElementsHidden />
          <AppText variant="caption" color={colors.forestDeep} style={styles.label}>
            {t.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginHorizontal: screenGutter, flexDirection: 'row', gap: 8 },
  item: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: radius.md, backgroundColor: colors.forestSoft },
  label: { flex: 1 },
});
