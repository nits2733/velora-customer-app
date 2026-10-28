import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { HeartButton } from '@/components/ui/HeartButton';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { featuredProjects } from '@/content/home';
import { colors, radius, screenGutter, shadow } from '@/theme';

const IMAGE_H = 200;

export function FreshInspiration() {
  const { width: screenW } = useWindowDimensions();
  const w = screenW - screenGutter * 2;
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <View style={styles.list}>
      {featuredProjects.map((p) => (
        <View key={p.id} style={styles.card}>
          <Pressable onPress={() => router.push('/explore')} accessibilityRole="button" accessibilityLabel={p.title}>
          <View>
            <RemoteImage src={p.image} width={w} height={IMAGE_H} style={styles.image} />
            <Badge label={p.tag} tone="light" style={styles.tag} />
          </View>
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <AppText variant="title" style={styles.title} numberOfLines={1}>
                {p.title}
              </AppText>
              <AppText variant="title">{p.price}</AppText>
            </View>
            <AppText variant="caption" color={colors.inkSoft} numberOfLines={1}>
              {p.where}
            </AppText>
            <View style={styles.footer}>
              <AppText variant="caption">Delivered in {p.days} Days</AppText>
              <View style={styles.inline}>
                <AppText variant="captionStrong">View Project Story</AppText>
                <Feather name="arrow-right" size={14} color={colors.ink} />
              </View>
            </View>
          </View>
          </Pressable>
          <HeartButton
            style={styles.heart}
            saved={!!saved[p.id]}
            onToggle={() => setSaved((s) => ({ ...s, [p.id]: !s[p.id] }))}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: screenGutter, gap: 14 },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  image: { width: '100%', height: IMAGE_H },
  tag: { position: 'absolute', top: 12, left: 12 },
  heart: { position: 'absolute', top: 12, right: 12 },
  body: { padding: 14, gap: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontFamily: 'PlusJakartaSans_700Bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
