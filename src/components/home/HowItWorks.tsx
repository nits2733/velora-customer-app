import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Stagger } from '@/components/motion/Reveal';
import { AppText } from '@/components/ui/AppText';
import { howItWorks, warranty } from '@/content/home';
import { colors, radius, screenGutter } from '@/theme';

export function HowItWorks() {
  return (
    <View style={styles.wrap}>
      <View style={styles.panel}>
        <AppText variant="eyebrow" color={colors.forest}>
          Transparent process
        </AppText>
        <AppText variant="h1" accessibilityRole="header">
          How Velora Works
        </AppText>
        <AppText variant="body" color={colors.inkSoft} style={styles.sub}>
          A seamless, transparent journey from idea to reality
        </AppText>
        <View style={styles.steps}>
          {howItWorks.map((s, i) => (
            <Stagger key={s.n} index={i}>
            <View style={styles.step}>
              <View style={styles.num}>
                <AppText variant="captionStrong" color={colors.white}>
                  {s.n}
                </AppText>
              </View>
              <View style={styles.stepCopy}>
                <AppText variant="title">{s.title}</AppText>
                <AppText variant="caption" color={colors.inkSoft}>
                  {s.body}
                </AppText>
              </View>
            </View>
            </Stagger>
          ))}
        </View>
      </View>

      <View style={styles.warranty}>
        <View style={styles.shield}>
          <Feather name="shield" size={18} color={colors.forest} />
        </View>
        <View style={styles.stepCopy}>
          <AppText variant="bodyStrong">{warranty.title}</AppText>
          <AppText variant="caption" color={colors.inkSoft}>
            {warranty.body}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: screenGutter, gap: 12 },
  panel: { padding: 16, borderRadius: radius.xl, backgroundColor: colors.surfaceMuted },
  sub: { marginTop: 2, marginBottom: 14 },
  steps: { gap: 10 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
  stepCopy: { flex: 1, gap: 2 },
  warranty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  shield: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
