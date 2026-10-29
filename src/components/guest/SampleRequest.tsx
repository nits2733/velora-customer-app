import { StyleSheet, View } from 'react-native';
import { RequestCard } from '@/components/requests/RequestCard';
import { AppText } from '@/components/ui/AppText';
import { sampleRequest } from '@/content/guestSample';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter } from '@/theme';
import { tonePalette } from '@/theme/tones';

/**
 * The real request card, filled with a fictional request and clearly marked "Example". It is one
 * accessible block with a plain-text label, so a screen reader announces it as an example and finds no
 * buttons inside. The card itself is built in preview mode and has none.
 */
export function SampleRequest() {
  return (
    <View style={styles.wrap} accessible accessibilityRole="text" accessibilityLabel={strings.guest.exampleLabel}>
      <View style={styles.tag}>
        <AppText variant="captionStrong" color={tonePalette.grey.fg}>
          {strings.guest.example}
        </AppText>
      </View>
      <RequestCard booking={sampleRequest} preview />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  tag: { alignSelf: 'flex-start', marginLeft: screenGutter, paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
});
