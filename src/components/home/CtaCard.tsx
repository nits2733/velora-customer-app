import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { cta } from '@/content/home';
import { colors, radius, screenGutter } from '@/theme';

export function CtaCard() {
  return (
    <LinearGradient colors={['#2B6A4D', colors.forestDeep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <AppText variant="eyebrow" color={colors.mint}>
        {cta.eyebrow}
      </AppText>
      <AppText variant="h1" color={colors.white}>
        {cta.title}
      </AppText>
      <AppText variant="body" color="rgba(255,255,255,0.85)">
        {cta.body}
      </AppText>
      <View style={styles.buttons}>
        <Button
          label="Get Instant Estimate (Free)"
          variant="light"
          onPress={() => router.push('/services')}
          right={<Feather name="arrow-right" size={16} color={colors.forestDeep} />}
        />
        <Button label="Book Design Consultation" variant="outline" onPress={() => router.push('/requests')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, padding: 20, borderRadius: radius.xl, gap: 8 },
  buttons: { gap: 10, marginTop: 10 },
});
