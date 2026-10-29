import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable as RNPressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter } from '@/theme';

export interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  destructive?: boolean;
  onPress: () => void;
}

interface Props {
  /** Names the request for screen readers: "More options for Modular kitchen". */
  title: string;
  items: MenuItem[];
}

/**
 * The "⋯" on a request card. It holds the quiet actions (cancel, contact support) so the card itself never
 * carries a red link. Cancelling only opens the request's own confirmation sheet; nothing is cancelled here.
 * The trigger is a sibling of the card's tap area, never inside it, and is a full 44px target.
 */
export function RequestMenu({ title, items }: Props) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  if (!items.length) return null;

  const pick = (item: MenuItem) => {
    setOpen(false);
    item.onPress();
  };

  return (
    <>
      <RNPressable
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={strings.requests.menu.open(title)}
      >
        <Feather name="more-horizontal" size={20} color={colors.inkSoft} />
      </RNPressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <View style={styles.fill}>
          <RNPressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel={strings.requests.menu.close} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <AppText variant="bodyStrong" color={colors.inkSoft} numberOfLines={1} style={styles.heading}>
              {title}
            </AppText>
            {items.map((item) => (
              <RNPressable key={item.key} style={styles.row} onPress={() => pick(item)} accessibilityRole="button" accessibilityLabel={item.label}>
                <Feather name={item.icon} size={18} color={item.destructive ? colors.danger : colors.ink} />
                <AppText variant="bodyStrong" color={item.destructive ? colors.danger : colors.ink}>
                  {item.label}
                </AppText>
              </RNPressable>
            ))}
            <Button label={strings.requests.menu.close} variant="quiet" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  fill: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  sheet: { borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, backgroundColor: colors.bg, paddingTop: 16, paddingHorizontal: screenGutter, gap: 4 },
  heading: { paddingBottom: 6 },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
