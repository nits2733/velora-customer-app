import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { useFavorites } from '@/hooks/useFavorites';
import type { ServiceItem } from '@/hooks/useServices';
import { colors, radius, screenGutter, shadow } from '@/theme';
import { track } from '@/utils/analytics';

export const openService = (id: number | string, source = 'services') => {
  track({ name: 'service_viewed', id: String(id), source });
  router.push({ pathname: '/service/[id]', params: { id: String(id) } });
};

const GAP = 12;
const COVER_H = 104;

/** Image-led grid card: cover with icon badge, name and outcome copy. Tap opens; heart or long-press saves. */
export const ServiceCard = memo(function ServiceCard({ item, showGroup = true }: { item: ServiceItem; showGroup?: boolean }) {
  const { width } = useWindowDimensions();
  const w = (width - screenGutter * 2 - GAP) / 2;
  const { isSaved, toggle } = useFavorites();
  const key = `service-${item.id}`;
  const saved = isSaved(key);
  const save = () => {
    Haptics.selectionAsync().catch(() => {});
    toggle(key);
  };

  /* The bookmark is a sibling of the card button, not a child: web forbids a <button> inside a <button>. */
  return (
    <View style={{ width: w }}>
      <Pressable
        style={styles.card}
        haptic
        onPress={() => openService(item.id)}
        onLongPress={save}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}. ${item.blurb}`}
        accessibilityHint="Long press to save"
      >
      <View style={styles.cover}>
        <RemoteImage src={item.image} width={w} height={COVER_H} style={StyleSheet.absoluteFill} />
        <View style={styles.badge}>
          <Feather name={item.icon} size={16} color={colors.forest} accessibilityElementsHidden />
        </View>
      </View>
      <View style={styles.copy}>
        {showGroup ? (
          <AppText variant="eyebrow" color={colors.clay} numberOfLines={1}>
            {item.group}
          </AppText>
        ) : null}
        <AppText variant="h3" numberOfLines={2}>
          {item.name}
        </AppText>
        {item.blurb ? (
          <AppText variant="caption" color={colors.inkSoft} numberOfLines={3}>
            {item.blurb}
          </AppText>
        ) : null}
      </View>
      </Pressable>
      <Pressable
        style={[styles.heart, saved && styles.heartOn]}
        onPress={save}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={saved ? `Remove ${item.name} from saved` : `Save ${item.name}`}
        accessibilityState={{ selected: saved }}
      >
        <Feather name="bookmark" size={16} color={saved ? colors.white : colors.ink} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  cover: { height: COVER_H, backgroundColor: colors.surfaceMuted },
  badge: { position: 'absolute', left: 10, bottom: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  heart: { position: 'absolute', top: 6, right: 6, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  heartOn: { backgroundColor: colors.forest },
  copy: { padding: 12, gap: 3 },
});
