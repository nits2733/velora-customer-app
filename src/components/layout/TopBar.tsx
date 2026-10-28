import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LocationSheet } from '@/components/layout/LocationSheet';
import { AppText } from '@/components/ui/AppText';
import { Pressable } from '@/components/ui/Pressable';
import { useLocation } from '@/hooks/useLocation';
import { colors, radius, screenGutter, shadow } from '@/theme';

interface Props {
  city?: string;
  unread?: number;
}

/** Brand + city + notifications + profile row, shared by Home and Explore. */
export function TopBar({ city, unread = 0 }: Props) {
  const location = useLocation();
  const label = city ?? location.label;
  const [picking, setPicking] = useState(false);
  return (
    <View style={styles.row}>
      <LocationSheet visible={picking} onClose={() => setPicking(false)} />
      <View style={styles.brand}>
        <Ionicons name="leaf" size={22} color={colors.forest} />
        <View>
          <AppText variant="eyebrow" color={colors.forest} style={styles.brandName}>
            Velora
          </AppText>
          <Pressable
            style={styles.cityRow}
            accessibilityRole="button"
            accessibilityLabel={`Location ${label}. Change location`}
            onPress={() => setPicking(true)}
          >
            <AppText variant="bodyStrong">{label}</AppText>
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
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: screenGutter, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
});
