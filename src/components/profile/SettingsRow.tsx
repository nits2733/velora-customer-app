import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import type { IconName } from '@/content/services';
import { colors, radius, shadow } from '@/theme';

interface Props {
  icon: IconName;
  label: string;
  /** Short status on the right, e.g. "3 unread". It is part of the accessible name. */
  value?: string;
  onPress: () => void;
  destructive?: boolean;
}

/** One tappable line of the Profile list: icon, label, optional status, chevron. 56px tall for an easy target. */
export function SettingsRow({ icon, label, value, onPress, destructive }: Props) {
  const color = destructive ? colors.danger : colors.ink;
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={value ? `${label}, ${value}` : label}>
      <View style={[styles.icon, destructive && styles.iconDanger]}>
        <Feather name={icon} size={18} color={destructive ? colors.danger : colors.forest} />
      </View>
      <AppText variant="bodyStrong" color={color} style={styles.label}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="captionStrong" color={colors.forestDeep} style={styles.value}>
          {value}
        </AppText>
      ) : null}
      <Feather name="chevron-right" size={18} color={colors.inkMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.forestSoft },
  iconDanger: { backgroundColor: colors.dangerSoft },
  label: { flex: 1 },
  value: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.forestSoft, overflow: 'hidden' },
});
