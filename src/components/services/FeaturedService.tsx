import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { IMG } from '@/content/home';
import { FULL_HOME_ID, fullHome } from '@/content/services';
import { colors, radius, screenGutter, shadow } from '@/theme';
import { openService } from './ServiceCard';

const IMAGE_H = 190;
const MAX_TAGS = 4;

/** Large editorial card for Full Home Renovation. `rooms` are the live HOME_PROJECT categories. */
export function FeaturedService({ rooms }: { rooms: string[] }) {
  const { width } = useWindowDimensions();
  const w = width - screenGutter * 2;
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => openService(FULL_HOME_ID)}
        accessibilityRole="button"
        accessibilityLabel={`${fullHome.name}. ${fullHome.tagline}`}
      >
      <View style={styles.image}>
        <RemoteImage src={IMG.livingWarm} width={w} height={IMAGE_H} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(8,24,16,0.05)', 'rgba(20,54,38,0.9)']} style={styles.fade} />
        <View style={styles.pill}>
          <Feather name="home" size={12} color={colors.forestDeep} />
          <AppText variant="eyebrow" color={colors.forestDeep} style={styles.pillText}>
            Featured service
          </AppText>
        </View>
        <AppText variant="h1" color={colors.white} style={styles.title}>
          {fullHome.name}
        </AppText>
      </View>
      </Pressable>
      <View style={styles.body}>
        <AppText variant="body" color={colors.inkSoft}>
          {fullHome.tagline}
        </AppText>
        {rooms.length ? (
          <View style={styles.rooms}>
            {rooms.slice(0, MAX_TAGS).map((r) => (
              <View key={r} style={styles.room}>
                <AppText variant="caption" color={colors.forestDeep}>
                  {r}
                </AppText>
              </View>
            ))}
            {rooms.length > MAX_TAGS ? (
              <View style={styles.room}>
                <AppText variant="caption" color={colors.forestDeep}>
                  +{rooms.length - MAX_TAGS} more
                </AppText>
              </View>
            ) : null}
          </View>
        ) : null}
        <Button
          label="Explore Renovation"
          onPress={() => openService(FULL_HOME_ID)}
          right={<Feather name="arrow-right" size={16} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: screenGutter, borderRadius: radius.xl, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  image: { height: IMAGE_H, justifyContent: 'space-between', backgroundColor: colors.surfaceMuted },
  fade: { ...StyleSheet.absoluteFill, top: '30%' },
  pill: { alignSelf: 'flex-start', margin: 14, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.92)' },
  pillText: { fontSize: 10 },
  title: { padding: 16 },
  body: { padding: 16, gap: 12 },
  rooms: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  room: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.forestSoft },
});
