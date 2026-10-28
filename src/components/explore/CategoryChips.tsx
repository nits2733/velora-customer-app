import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from '@/components/ui/Chip';
import { screenGutter } from '@/theme';

interface Props {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function CategoryChips({ options, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {options.map((o) => (
        <Chip key={o} label={o} selected={selected === o} onPress={() => onSelect(o)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ row: { paddingHorizontal: screenGutter, gap: 8 } });
