import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { colors, screenGutter } from '@/theme';

/** Placeholder for tabs whose designs have not been supplied yet. */
export function ComingSoon({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 24 }]}>
      <AppText variant="h1">{title}</AppText>
      <AppText variant="body" color={colors.inkSoft}>
        This screen will be built from your design reference.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { flex: 1, paddingHorizontal: screenGutter, gap: 8, backgroundColor: colors.bg } });
