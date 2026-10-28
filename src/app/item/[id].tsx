import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { HeartButton } from '@/components/ui/HeartButton';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { findDetail } from '@/content/explore';
import { useFavorites } from '@/hooks/useFavorites';
import { colors, radius, screenGutter } from '@/theme';

const HERO_H = 380;

/**
 * Minimal detail screen shared by every Explore card until dedicated story / design / project
 * screens exist (they need backend content endpoints that are not available yet).
 */
export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isSaved, toggle } = useFavorites();
  const item = id ? findDetail(id) : undefined;

  if (!item) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top + 24 }]}>
        <AppText variant="h2">Not found</AppText>
        <AppText variant="body" color={colors.inkSoft}>
          This item is no longer available.
        </AppText>
        <Button label="Go back" onPress={() => router.back()} style={styles.back} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <RemoteImage src={item.image} width={width} height={HERO_H} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(8,24,16,0.35)', 'transparent']} style={styles.topFade} />
          <View style={[styles.bar, { top: insets.top + 8 }]}>
            <Pressable style={styles.round} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
              <Feather name="arrow-left" size={20} color={colors.ink} />
            </Pressable>
            <HeartButton saved={isSaved(item.id)} onToggle={() => toggle(item.id)} />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.tags}>
            {item.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <AppText variant="captionStrong" color={colors.forestDeep}>
                  {t}
                </AppText>
              </View>
            ))}
          </View>
          <AppText variant="h1" accessibilityRole="header">
            {item.title}
          </AppText>
          {item.subtitle ? (
            <AppText variant="body" color={colors.inkSoft}>
              {item.subtitle}
            </AppText>
          ) : null}
          <Button label="Book a Design Consultation" onPress={() => router.push('/requests')} style={styles.cta} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { height: HERO_H, backgroundColor: colors.surfaceMuted },
  topFade: { ...StyleSheet.absoluteFill, height: 140 },
  bar: { position: 'absolute', left: screenGutter, right: screenGutter, flexDirection: 'row', justifyContent: 'space-between' },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: screenGutter, paddingTop: 20, gap: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, backgroundColor: colors.forestSoft },
  cta: { marginTop: 12 },
  empty: { flex: 1, padding: screenGutter, gap: 8, backgroundColor: colors.bg },
  back: { marginTop: 16 },
});
