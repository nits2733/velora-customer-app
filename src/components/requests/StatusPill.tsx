import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { strings } from '@/content/strings';
import { tonePalette } from '@/theme/tones';
import { radius } from '@/theme';
import type { StateKey, Tone } from '@/utils/requestState';
import type { IconName } from '@/content/services';

interface Props {
  state: StateKey;
  tone: Tone;
  icon: IconName;
}

/** Icon plus text on a tinted background: the status is never carried by colour alone. */
export function StatusPill({ state, tone, icon }: Props) {
  const { fg, bg } = tonePalette[tone];
  const label = strings.requests.state[state];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]} accessible accessibilityLabel={`Status: ${label}`}>
      <Feather name={icon} size={14} color={fg} />
      <AppText variant="captionStrong" color={fg} maxFontSizeMultiplier={1.5} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, maxWidth: '100%' },
  text: { flexShrink: 1 },
});
