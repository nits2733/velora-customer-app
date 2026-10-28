import { StyleSheet, View } from 'react-native';
import { TopBar } from '@/components/layout/TopBar';
import { AppText } from '@/components/ui/AppText';
import { colors, screenGutter } from '@/theme';

interface Props {
  firstName?: string;
  city?: string;
  unread?: number;
}

function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeHeader({ firstName, city, unread }: Props) {
  return (
    <View style={styles.wrap}>
      <TopBar city={city} unread={unread} />
      <View style={styles.greet}>
        <AppText variant="display" accessibilityRole="header">
          {greeting()}
          {firstName ? `,\n${firstName}` : ''}
        </AppText>
        <AppText variant="body" color={colors.inkSoft} style={styles.tag}>
          Let&apos;s craft your sanctuary today.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  greet: { paddingHorizontal: screenGutter },
  tag: { marginTop: 4 },
});
