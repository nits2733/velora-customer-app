import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { colors, radius, screenGutter } from '@/theme';

interface Props {
  suggestions: string[];
  onPick: (text: string) => void;
}

/** Quick-search shortcuts that fill the search field. */
export function SuggestionChips({ suggestions, onPick }: Props) {
  if (!suggestions.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} keyboardShouldPersistTaps="handled">
      {suggestions.map((s) => (
        <Pressable key={s} style={styles.hit} onPress={() => onPick(s)} accessibilityRole="button" accessibilityLabel={`Search ${s}`}>
          <View style={styles.pill}>
            <Feather name="search" size={12} color={colors.inkSoft} />
            <AppText variant="caption" color={colors.forestDeep}>
              {s}
            </AppText>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter, gap: 8 },
  hit: { minHeight: 44, justifyContent: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 32, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
});
