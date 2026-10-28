import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { colors, screenGutter } from '@/theme';
import { AppText } from './AppText';
import { Pressable } from './Pressable';

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  dot?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, eyebrow, dot, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? (
        <AppText variant="eyebrow" color={colors.clay}>
          {eyebrow}
        </AppText>
      ) : null}
      <View style={styles.row}>
        <View style={styles.titleRow}>
          {dot ? <View style={styles.dot} /> : null}
          <AppText variant="h2" accessibilityRole="header" style={styles.title}>
            {title}
          </AppText>
        </View>
        {actionLabel ? (
          <Pressable onPress={onAction} style={styles.action} accessibilityRole="link" hitSlop={8}>
            <AppText variant="captionStrong" style={styles.actionText}>
              {actionLabel}
            </AppText>
            <Feather name="arrow-right" size={14} color={colors.ink} />
          </Pressable>
        ) : null}
      </View>
      {subtitle ? (
        <AppText variant="body" color={colors.inkSoft} style={styles.sub}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: screenGutter, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.forest },
  title: { flexShrink: 1 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 130, paddingBottom: 3 },
  actionText: { textAlign: 'right', flexShrink: 1 },
  sub: { marginTop: 4 },
});
