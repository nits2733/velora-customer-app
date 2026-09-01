import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'

type LocationItem = {
  name: string
  area: string
  status: 'Active' | 'Upcoming'
}

const locations: LocationItem[] = [
  { name: 'Banjara Hills, Hyderabad', area: '14 active projects', status: 'Active' },
  { name: 'Jubilee Hills, Hyderabad', area: '9 active projects', status: 'Active' },
  { name: 'Madhapur, Hyderabad', area: '11 active projects', status: 'Active' },
  { name: 'Gachibowli, Hyderabad', area: '6 active projects', status: 'Active' },
  { name: 'Kondapur, Hyderabad', area: '4 upcoming projects', status: 'Upcoming' },
]

const statusStyle: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#dcfce7', text: '#15803d' },
  Upcoming: { bg: '#fef9c3', text: '#854d0e' },
}

export default function WorkMapScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AppHeader title="Work Map" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Work Locations</Text>
          <Text style={styles.cardDesc}>
            See where our teams are currently working across Hyderabad. Tap any location to learn more about ongoing projects in your area.
          </Text>

          {/* Mock map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>📍</Text>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubText}>Interactive map coming soon</Text>
          </View>

          {/* Location list */}
          <View style={styles.locationList}>
            <Text style={styles.listHeading}>Locations ({locations.length})</Text>
            {locations.map((loc, idx) => {
              const sc = statusStyle[loc.status]
              return (
                <View key={idx} style={styles.locationItem}>
                  <View style={styles.locationLeft}>
                    <Text style={styles.locationPin}>📍</Text>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{loc.name}</Text>
                      <Text style={styles.locationArea}>{loc.area}</Text>
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.badgeText, { color: sc.text }]}>{loc.status}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: colors.border,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  mapIcon: {
    fontSize: 48,
  },
  mapText: {
    fontSize: fontSize.h3,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '600',
  },
  mapSubText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  locationList: {
    gap: spacing.sm,
  },
  listHeading: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  locationPin: {
    fontSize: 18,
  },
  locationInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  locationName: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  locationArea: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.round,
  },
  badgeText: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    fontWeight: '600',
  },
})
