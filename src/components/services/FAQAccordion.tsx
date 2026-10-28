import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import type { FAQItem } from '@/types/content';
import { track } from '@/utils/analytics';
import { colors, radius, screenGutter, shadow } from '@/theme';

/** One item open at a time; the list reflows with a short layout transition. */
export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    track({ name: 'faq_toggled', id, open: next === id });
  };

  return (
    <View style={styles.list}>
      {items.map((f) => {
        const isOpen = open === f.id;
        return (
          <Animated.View key={f.id} layout={LinearTransition.duration(220)} style={styles.item}>
            <Pressable
              style={styles.head}
              scaleTo={0.99}
              onPress={() => toggle(f.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              accessibilityLabel={f.question}
            >
              <AppText variant="bodyStrong" style={styles.q}>
                {f.question}
              </AppText>
              <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.inkSoft} />
            </Pressable>
            {isOpen ? (
              <Animated.View entering={FadeIn.duration(200)}>
                <AppText variant="caption" color={colors.inkSoft} style={styles.a}>
                  {f.answer}
                </AppText>
              </Animated.View>
            ) : null}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { marginHorizontal: screenGutter, gap: 10 },
  item: { borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', ...shadow.card },
  head: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  q: { flex: 1 },
  a: { paddingHorizontal: 16, paddingBottom: 16 },
});
