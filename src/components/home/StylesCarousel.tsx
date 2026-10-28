import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { HeartButton } from '@/components/ui/HeartButton';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { styleCards } from '@/content/home';
import { colors, radius, screenGutter, shadow } from '@/theme';

const IMAGE_H = 170;

export function StylesCarousel() {
  const { width } = useWindowDimensions();
  const cardW = Math.min(300, width * 0.72);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <FlatList
      horizontal
      data={styleCards}
      keyExtractor={(s) => s.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardW + 12}
      decelerationRate="fast"
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: cardW }]}>
          <Pressable onPress={() => router.push('/explore')} accessibilityRole="button" accessibilityLabel={item.title}>
          <View>
            <RemoteImage src={item.image} width={cardW} height={IMAGE_H} style={styles.image} />
            <Badge label={item.badge} tone={item.badge.includes('Match') ? 'forest' : 'glass'} style={styles.badge} />
          </View>
          <View style={styles.body}>
            <AppText variant="h3">{item.title}</AppText>
            <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
              {item.materials}
            </AppText>
            <View style={styles.priceRow}>
              <View>
                <AppText variant="bodyStrong">{item.price}</AppText>
                <AppText variant="caption" color={colors.inkMuted}>
                  (Turnkey Fit-out)
                </AppText>
              </View>
              <Feather name="arrow-up-right" size={18} color={colors.forest} />
            </View>
          </View>
          </Pressable>
          <HeartButton
            style={styles.heart}
            saved={!!saved[item.id]}
            onToggle={() => setSaved((s) => ({ ...s, [item.id]: !s[item.id] }))}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: screenGutter },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  image: { width: '100%', height: IMAGE_H },
  badge: { position: 'absolute', left: 10, bottom: 10 },
  heart: { position: 'absolute', top: 10, right: 10 },
  body: { padding: 14, gap: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 },
});
