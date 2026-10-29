import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useTopPad } from '@/hooks/useTopPad';
import { colors, screenGutter } from '@/theme';

/** A page title instead of the location bar, for tabs where location and filters do not belong. */
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const topPad = useTopPad();
  return (
    <View style={[styles.wrap, { paddingTop: topPad }]}>
      <AppText variant="h1" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color={colors.inkSoft}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { paddingHorizontal: screenGutter, gap: 6 } });
