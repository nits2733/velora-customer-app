import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { roomFallbackImage, roomFallbackImages } from '@/content/home';
import type { Category } from '@/types/api';
import { colors, radius, screenGutter, shadow } from '@/theme';

const GAP = 12;
const IMAGE_H = 118;

interface Props {
  rooms: Category[] | null;
  loading: boolean;
}

export function RoomGrid({ rooms, loading }: Props) {
  const { width: screenW } = useWindowDimensions();
  const cardW = (screenW - screenGutter * 2 - GAP) / 2;

  if (loading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={cardW} height={IMAGE_H + 76} r={radius.lg} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {(rooms ?? []).map((room) => (
        <Pressable
          key={room.id}
          style={[styles.card, { width: cardW }]}
          onPress={() => router.push('/explore')}
          accessibilityRole="button"
          accessibilityLabel={`${room.name} designs`}
        >
          <RemoteImage
            src={room.imageUrl ?? roomFallbackImages[room.name.toLowerCase()] ?? roomFallbackImage}
            width={cardW}
            height={IMAGE_H}
            style={styles.image}
          />
          <View style={styles.body}>
            <AppText variant="title" numberOfLines={1}>
              {room.name}
            </AppText>
            <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
              {room.description ?? ''}
            </AppText>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: screenGutter },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  image: { width: '100%', height: IMAGE_H },
  body: { padding: 12, gap: 2 },
});
