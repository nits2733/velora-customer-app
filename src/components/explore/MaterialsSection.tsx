import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { Pressable } from '@/components/ui/Pressable';
import { materialGroups, materials, type MaterialGroup } from '@/content/explore';
import { colors, radius, screenGutter } from '@/theme';

interface Props {
  /** Currently active material/finish tag filter. */
  tag: string | null;
  onToggleTag: (tag: string) => void;
}

/** One material/finish picker: group tabs on top, swatches below. Tapping a swatch filters the page. */
export function MaterialsSection({ tag, onToggleTag }: Props) {
  const [group, setGroup] = useState<MaterialGroup>(materialGroups[0]);
  const items = useMemo(() => materials.filter((m) => m.group === group), [group]);

  return (
    <View style={styles.panel}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {materialGroups.map((g) => (
          <Chip key={g} label={g} selected={group === g} onPress={() => setGroup(g)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((m) => {
          const active = tag === m.name;
          return (
            <Pressable
              key={m.id}
              style={[styles.tile, active && styles.tileActive]}
              onPress={() => onToggleTag(m.name)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${m.name}, ${m.group}`}
            >
              <View style={[styles.swatch, { backgroundColor: m.color }]} />
              <AppText variant="captionStrong" numberOfLines={1} style={styles.name}>
                {m.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 12 },
  tabs: { paddingHorizontal: screenGutter, gap: 8 },
  row: { paddingHorizontal: screenGutter, gap: 12 },
  tile: {
    width: 104,
    padding: 8,
    gap: 8,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tileActive: { borderColor: colors.forest },
  swatch: { height: 72, borderRadius: radius.sm, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  name: { textAlign: 'center' },
});
