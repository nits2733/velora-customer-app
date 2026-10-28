import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { featuredGuide, ideaCards } from '@/content/home';
import { colors, radius, screenGutter, shadow } from '@/theme';

const GUIDE_H = 210;
const GAP = 12;

export function IdeasSection() {
  const { width: screenW } = useWindowDimensions();
  const fullW = screenW - screenGutter * 2;
  const cardW = (fullW - GAP) / 2;

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.guide} onPress={() => router.push('/explore')} accessibilityRole="button">
        <View style={{ height: GUIDE_H }}>
          <RemoteImage src={featuredGuide.image} width={fullW} height={GUIDE_H} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['transparent', 'rgba(8,20,14,0.85)']} style={styles.guideFade} />
          <Badge label={featuredGuide.tag.toUpperCase()} tone="clay" style={styles.guideTag} />
          <View style={styles.guideCopy}>
            <AppText variant="h1" color={colors.white}>
              {featuredGuide.title}
            </AppText>
            <AppText variant="body" color="rgba(255,255,255,0.9)">
              {featuredGuide.body}
            </AppText>
          </View>
        </View>
        <View style={styles.guideFooter}>
          <AppText variant="caption" color={colors.inkSoft}>
            {featuredGuide.plans} Practical Layout Plans
          </AppText>
          <View style={styles.inline}>
            <AppText variant="captionStrong">Read Lookbook</AppText>
            <Feather name="arrow-right" size={14} color={colors.ink} />
          </View>
        </View>
      </Pressable>

      <View style={styles.grid}>
        {ideaCards.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.idea, { width: cardW }]}
            onPress={() => router.push('/explore')}
            accessibilityRole="button"
            accessibilityLabel={`${c.title}, ${c.count} ideas`}
          >
            <View style={[styles.ideaIcon, { backgroundColor: c.tint }]}>
              <Feather name={c.icon} size={20} color={colors.forest} />
            </View>
            <AppText variant="title" style={styles.ideaTitle}>
              {c.title}
            </AppText>
            <AppText variant="caption" color={colors.inkSoft} style={styles.ideaBody}>
              {c.body}
            </AppText>
            <View style={styles.inline}>
              <AppText variant="captionStrong">Explore {c.count} Ideas</AppText>
              <Feather name="chevron-right" size={14} color={colors.ink} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: screenGutter, gap: GAP },
  guide: { borderRadius: radius.xl, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  guideFade: { ...StyleSheet.absoluteFill, top: '30%' },
  guideTag: { position: 'absolute', top: 14, left: 14 },
  guideCopy: { position: 'absolute', left: 16, right: 16, bottom: 14, gap: 4 },
  guideFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  idea: { padding: 14, borderRadius: radius.lg, backgroundColor: colors.surface, gap: 6, ...shadow.card },
  ideaIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  ideaTitle: { fontFamily: 'PlusJakartaSans_700Bold' },
  ideaBody: { minHeight: 52 },
});
