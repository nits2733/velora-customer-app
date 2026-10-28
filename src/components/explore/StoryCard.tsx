import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { story } from '@/content/explore';
import { colors, radius, screenGutter, shadow } from '@/theme';

const IMAGE_H = 300;

export function StoryCard({ onOpen }: { onOpen: () => void }) {
  const { width: screenW } = useWindowDimensions();
  const w = screenW - screenGutter * 2;
  return (
    <Pressable
      style={styles.card}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`Curated story: ${story.title}`}
    >
      <View style={styles.imageWrap}>
        <RemoteImage src={story.image} width={w} height={IMAGE_H} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(8,24,16,0.1)', 'rgba(20,54,38,0.92)']} style={styles.fade} />
        <View style={styles.topRow}>
          <View style={styles.pill}>
            <Feather name="bookmark" size={12} color={colors.forestDeep} />
            <AppText variant="eyebrow" color={colors.forestDeep} style={styles.pillText}>
              {story.label}
            </AppText>
          </View>
          <View style={[styles.pill, styles.dark]}>
            <Feather name="clock" size={12} color={colors.white} />
            <AppText variant="captionStrong" color={colors.white}>
              {story.readMinutes} min read
            </AppText>
          </View>
        </View>
        <View style={styles.copy}>
          <View style={styles.tags}>
            {story.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <AppText variant="caption" color={colors.white}>
                  {t}
                </AppText>
              </View>
            ))}
          </View>
          <AppText variant="h1" color={colors.white}>
            {story.title}
          </AppText>
          <AppText variant="body" color="rgba(255,255,255,0.88)" numberOfLines={2}>
            {story.description}
          </AppText>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.by}>
          <View style={styles.dot} />
          <AppText variant="caption" color={colors.inkSoft} numberOfLines={1} style={styles.byText}>
            {story.byline}
          </AppText>
        </View>
        <View style={styles.read}>
          <AppText variant="captionStrong">Read Story</AppText>
          <Feather name="arrow-right" size={14} color={colors.ink} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, borderRadius: radius.xl, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  imageWrap: { height: IMAGE_H, justifyContent: 'space-between', backgroundColor: colors.surfaceMuted },
  fade: { ...StyleSheet.absoluteFill, top: '25%' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.92)' },
  pillText: { fontSize: 10 },
  dark: { backgroundColor: 'rgba(20,54,38,0.85)' },
  copy: { padding: 16, gap: 10 },
  tags: { flexDirection: 'row', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.22)' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 14, paddingVertical: 14, minHeight: 48 },
  by: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  byText: { flexShrink: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.clay },
  read: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
