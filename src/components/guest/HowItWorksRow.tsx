import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { steps } from '@/content/services';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter, shadow } from '@/theme';

const t = strings.guest.profile;
const labels = [t.explore, t.request, t.matched];

/** The three steps from the Services page, as one tappable row that opens Services. No claims beyond those steps. */
export function HowItWorksRow({ onOpen }: { onOpen?: () => void }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        onOpen?.();
        router.push('/services');
      }}
      accessibilityRole="button"
      accessibilityLabel={`${t.howTitle}. ${labels.join(', ')}. ${t.howHint}`}
    >
      <View style={styles.head}>
        <AppText variant="h3" accessibilityRole="header">
          {t.howTitle}
        </AppText>
        <Feather name="chevron-right" size={18} color={colors.inkMuted} />
      </View>
      <View style={styles.steps}>
        {steps.map((step, i) => (
          <View key={step.n} style={styles.step}>
            <View style={styles.icon}>
              <Feather name={step.icon} size={16} color={colors.forest} />
            </View>
            <AppText variant="captionStrong" color={colors.forestDeep}>
              {labels[i]}
            </AppText>
            {i < steps.length - 1 ? <Feather name="arrow-right" size={14} color={colors.inkMuted} /> : null}
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 16, gap: 12, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  steps: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.forestSoft },
});
