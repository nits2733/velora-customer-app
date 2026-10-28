import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { offer } from '@/content/home';
import { useCountdown } from '@/hooks/useCountdown';
import { colors, radius, screenGutter } from '@/theme';
import { formatCountdown } from '@/utils/format';

export function OfferBanner() {
  const left = useCountdown(offer.countdownSeconds);
  const { h, m, s } = formatCountdown(left);
  return (
    <Pressable
      onPress={() => router.push('/services')}
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${h} hours ${m} minutes left`}
      style={styles.outer}
    >
      <LinearGradient colors={[colors.forestDeep, '#1D4A37']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.iconWrap}>
          <Feather name="zap" size={16} color={colors.clay} />
        </View>
        <View style={styles.copy}>
          <AppText variant="eyebrow" color={colors.mint} style={styles.eyebrow}>
            {offer.eyebrow}
          </AppText>
          <AppText variant="bodyStrong" color={colors.white}>
            {offer.title}
          </AppText>
        </View>
        <View style={styles.timer}>
          <Feather name="clock" size={13} color={colors.mint} />
          <AppText variant="captionStrong" color={colors.white} style={styles.mono}>
            {`${h}h ${m}m ${s}s`}
          </AppText>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: { marginHorizontal: screenGutter },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 10 },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  mono: { fontVariant: ['tabular-nums'] },
});
