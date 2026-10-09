import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import AppHeader from '../components/AppHeader'
import LocationMap from '../components/LocationMap'
import PrimaryButton from '../components/PrimaryButton'
import { MapSelection } from '../components/locationMapHtml'
import { colors, fonts, fontSize, spacing, radii, shadows, statusColors } from '../theme/tokens'
import { useRouter } from '../navigation/router'

type LocationItem = {
  name: string
  area: string
  status: 'Active' | 'Upcoming'
  lat: number
  lng: number
}

const locations: LocationItem[] = [
  { name: 'Banjara Hills, Hyderabad', area: '14 active projects', status: 'Active', lat: 17.4156, lng: 78.4347 },
  { name: 'Jubilee Hills, Hyderabad', area: '9 active projects', status: 'Active', lat: 17.4325, lng: 78.4073 },
  { name: 'Madhapur, Hyderabad', area: '11 active projects', status: 'Active', lat: 17.4486, lng: 78.3908 },
  { name: 'Gachibowli, Hyderabad', area: '6 active projects', status: 'Active', lat: 17.4401, lng: 78.3489 },
  { name: 'Kondapur, Hyderabad', area: '4 upcoming projects', status: 'Upcoming', lat: 17.46, lng: 78.357 },
]

const statusStyle: Record<string, { bg: string; text: string }> = {
  Active: statusColors.approved,
  Upcoming: statusColors.pending,
}

export default function WorkMapScreen() {
  const router = useRouter()
  const pickMode = router.getParam('pickLocation') === true
  const [selected, setSelected] = useState<MapSelection | null>(null)
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null)

  const handleConfirm = () => {
    if (!selected) return
    if (pickMode) {
      router.back()
      router.updateParams({ location: selected.name })
    } else {
      router.push('StartProject', { location: selected.name })
    }
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Work Map" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Work Locations</Text>
          <Text style={styles.cardDesc}>
            See where our teams are currently working across Hyderabad. Tap a marker or anywhere on the map to choose your project location.
          </Text>

          <LocationMap places={locations} focus={focus} onSelect={setSelected} />

          <View style={styles.selectedBox}>
            <Text style={styles.selectedLabel}>SELECTED LOCATION</Text>
            <Text style={styles.selectedName}>{selected ? selected.name : 'Nothing selected yet'}</Text>
            <PrimaryButton
              label={pickMode ? 'Use this location' : 'Start a project here'}
              onPress={handleConfirm}
              disabled={!selected}
            />
          </View>

          {/* Location list */}
          <View style={styles.locationList}>
            <Text style={styles.listHeading}>Locations ({locations.length})</Text>
            {locations.map((loc, idx) => {
              const sc = statusStyle[loc.status]
              return (
                <Pressable
                  key={idx}
                  style={styles.locationItem}
                  onPress={() => {
                    setSelected({ name: loc.name, lat: loc.lat, lng: loc.lng })
                    setFocus({ lat: loc.lat, lng: loc.lng })
                  }}
                >
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
                </Pressable>
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
  selectedBox: {
    gap: spacing.sm,
  },
  selectedLabel: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  selectedName: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
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
