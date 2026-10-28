import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Stagger } from '@/components/motion/Reveal';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Pressable } from '@/components/ui/Pressable';
import { Skeleton } from '@/components/ui/Skeleton';
import { defaultServiceIcon, serviceFlair } from '@/content/home';
import type { Category } from '@/types/api';
import { colors, radius, screenGutter, shadow } from '@/theme';

type IconName = keyof typeof Feather.glyphMap;

interface Props {
  services: Category[] | null;
  loading: boolean;
}

interface Tile {
  key: string;
  name: string;
  subtitle: string;
  icon: IconName;
  hot?: boolean;
}

const FULL_HOME: Tile = { key: 'full-home', name: 'Full Home', subtitle: 'End-to-end', icon: 'home', hot: true };

const COLUMNS = 4;
const GAP = 8;
const SKELETON_COUNT = 8;

export function ServicesGrid({ services, loading }: Props) {
  const { width } = useWindowDimensions();
  const tileW = Math.floor((width - screenGutter * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  if (loading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} width={tileW} height={124} />
        ))}
      </View>
    );
  }

  const tiles: Tile[] = [
    FULL_HOME,
    ...(services ?? []).map((c) => {
      const flair = serviceFlair[c.name.toLowerCase()];
      return {
        key: String(c.id),
        name: c.name,
        subtitle: flair?.subtitle ?? 'Trade service',
        icon: (flair?.icon ?? defaultServiceIcon) as IconName,
      };
    }),
  ];

  return (
    <View style={styles.grid}>
      {tiles.map((t, i) => (
        <Stagger key={t.key} index={i} style={{ width: tileW }}>
          <Pressable
            style={styles.tile}
            onPress={() => router.push('/services')}
            accessibilityRole="button"
            accessibilityLabel={`${t.name}, ${t.subtitle}`}
          >
            <View style={styles.iconWrap}>
              <Feather name={t.icon} size={22} color={colors.forest} />
            </View>
            <AppText variant="captionStrong" style={styles.center} numberOfLines={2}>
              {t.name}
            </AppText>
            <AppText variant="caption" color={t.hot ? colors.clay : colors.inkMuted} style={styles.center} numberOfLines={2}>
              {t.subtitle}
            </AppText>
            {t.hot ? <Badge label="HOT" tone="clay" style={styles.hot} /> : null}
          </Pressable>
        </Stagger>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: screenGutter },
  tile: {
    minHeight: 124,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 6,
    ...shadow.card,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.forestSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  hot: { position: 'absolute', top: -6, right: -2, paddingHorizontal: 7, paddingVertical: 3 },
});
