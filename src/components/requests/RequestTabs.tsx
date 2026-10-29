import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { strings } from '@/content/strings';
import { colors, radius, screenGutter } from '@/theme';
import type { RequestTab, TabCounts } from '@/utils/requestState';

interface Props {
  selected: RequestTab;
  onSelect: (tab: RequestTab) => void;
  counts: TabCounts | null;
}

const TABS: RequestTab[] = ['active', 'past'];

/** Active and Past, with the server's totals. The Active total includes requests pinned under "Action needed". */
export function RequestTabs({ selected, onSelect, counts }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const on = tab === selected;
        const count = counts ? counts[tab] : null;
        const label = strings.requests.tabs[tab];
        return (
          <Pressable
            key={tab}
            style={[styles.tab, on && styles.tabOn]}
            onPress={() => onSelect(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={count === null ? label : `${label}, ${count}`}
          >
            <AppText variant="bodyStrong" color={on ? colors.white : colors.ink} maxFontSizeMultiplier={1.5}>
              {count === null ? label : `${label} (${count})`}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: screenGutter, flexDirection: 'row', padding: 4, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
  tab: { flex: 1, minHeight: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.forest },
});
