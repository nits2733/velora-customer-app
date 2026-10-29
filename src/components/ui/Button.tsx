import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';
import { AppText } from './AppText';
import { Pressable } from './Pressable';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'light' | 'outline' | 'quiet' | 'danger';
  loading?: boolean;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const palette = {
  primary: { bg: colors.forest, fg: colors.white, border: colors.forest },
  light: { bg: colors.white, fg: colors.forestDeep, border: colors.white },
  outline: { bg: 'transparent', fg: colors.white, border: 'rgba(255,255,255,0.35)' },
  quiet: { bg: colors.surfaceMuted, fg: colors.forestDeep, border: colors.border },
  danger: { bg: colors.danger, fg: colors.white, border: colors.danger },
} as const;

export function Button({ label, onPress, variant = 'primary', loading, right, style }: Props) {
  const p = palette[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={loading}
      haptic
      onPress={onPress}
      style={[styles.base, { backgroundColor: p.bg, borderColor: p.border }, style]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          <AppText variant="button" color={p.fg}>
            {label}
          </AppText>
          {right}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
});
