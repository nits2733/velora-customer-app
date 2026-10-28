import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stagger } from '@/components/motion/Reveal';
import { AppText } from '@/components/ui/AppText';
import { steps } from '@/content/services';
import { colors, radius, screenGutter, shadow } from '@/theme';

/** Horizontal step cards with icon, number and one line of detail. Wrap in <Section stagger>. */
export function StepperHowItWorks() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {steps.map((st, i) => (
        <Stagger key={st.n} index={i}>
          <View style={styles.card} accessible accessibilityLabel={`Step ${st.n}. ${st.title}. ${st.body}`}>
            <View style={styles.top}>
              <View style={styles.icon}>
                <Feather name={st.icon} size={20} color={colors.forest} />
              </View>
              <View style={styles.num}>
                <AppText variant="captionStrong" color={colors.white}>
                  {st.n}
                </AppText>
              </View>
            </View>
            <AppText variant="h3">{st.title}</AppText>
            <AppText variant="caption" color={colors.inkSoft}>
              {st.body}
            </AppText>
          </View>
        </Stagger>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter, gap: 12 },
  card: { width: 200, minHeight: 168, padding: 16, gap: 6, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  icon: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.forestSoft, alignItems: 'center', justifyContent: 'center' },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' },
});
