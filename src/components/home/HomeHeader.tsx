import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { colors, radius, screenGutter, shadow } from '@/theme';

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

export function HomeHeader({ firstName, city = 'Madhapur, HYD', unread = 0 }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <Ionicons name="leaf" size={22} color={colors.forest} />
          <View>
            <AppText variant="eyebrow" color={colors.forest} style={styles.brandName}>
              Velora
            </AppText>
            <Pressable style={styles.cityRow} accessibilityRole="button" accessibilityLabel={`Location ${city}`}>
              <AppText variant="bodyStrong">{city}</AppText>
              <Feather name="chevron-down" size={14} color={colors.ink} />
            </Pressable>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.bell}
            onPress={() => router.push('/requests')}
          >
            <Feather name="bell" size={20} color={colors.ink} />
            {unread > 0 ? <View style={styles.bellDot} /> : null}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            style={styles.avatar}
            onPress={() => router.push('/profile')}
          >
            <Feather name="user" size={18} color={colors.forest} />
          </Pressable>
        </View>
      </View>

      <View>
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
  wrap: { paddingHorizontal: screenGutter, gap: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { letterSpacing: 2 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  bellDot: { position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.clay },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.forestSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: { marginTop: 4 },
});
