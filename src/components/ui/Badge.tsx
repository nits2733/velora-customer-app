import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';
import { AppText } from './AppText';

interface Props {
  label: string;
  tone?: 'glass' | 'forest' | 'clay' | 'light';
  style?: StyleProp<ViewStyle>;
}

const tones = {
  glass: { bg: 'rgba(255,255,255,0.92)', fg: colors.ink },
  light: { bg: colors.surface, fg: colors.forestDeep },
  forest: { bg: colors.forest, fg: colors.white },
  clay: { bg: colors.clay, fg: colors.white },
} as const;

export function Badge({ label, tone = 'glass', style }: Props) {
  const t = tones[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }, style]}>
      <AppText variant="captionStrong" color={t.fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, alignSelf: 'flex-start' },
});
