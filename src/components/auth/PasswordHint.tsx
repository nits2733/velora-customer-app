import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { strings } from '@/content/strings';
import { colors } from '@/theme';

const rules = strings.auth.passwordRules;

/** The password rules, ticked off as the customer types. Each has an icon and words, so it is not colour alone. */
export function PasswordHint({ password }: { password: string }) {
  const checks = [
    { label: rules.length, ok: password.length >= 8 && password.length <= 100 },
    { label: rules.letter, ok: /[A-Za-z]/.test(password) },
    { label: rules.number, ok: /\d/.test(password) },
  ];
  return (
    <View style={styles.row} accessible accessibilityLabel={checks.map((c) => `${c.label}: ${c.ok ? 'done' : 'needed'}`).join('. ')}>
      {checks.map((c) => (
        <View key={c.label} style={styles.item}>
          <Feather name={c.ok ? 'check-circle' : 'circle'} size={14} color={c.ok ? colors.forest : colors.inkSoft} />
          <AppText variant="caption" color={c.ok ? colors.forestDeep : colors.inkSoft}>
            {c.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: -6 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
