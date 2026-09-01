import React from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import { colors, fonts, fontSize, spacing, radii, shadows } from '../theme/tokens'
import { useRouter } from '../navigation/router'

const areas = [
  'Banjara Hills',
  'Jubilee Hills',
  'Madhapur',
  'Gachibowli',
  'Kondapur',
  'Kukatpally',
  'Secunderabad',
  'Hitech City',
]

export default function LocationsScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AppHeader title="Locations We Serve" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.intro}>
          Currently serving these areas in Hyderabad:
        </Text>

        <View style={styles.areaList}>
          {areas.map((area, idx) => (
            <View key={idx} style={[styles.areaItem, idx === areas.length - 1 && styles.areaItemLast]}>
              <Text style={styles.pin}>📍</Text>
              <View style={styles.areaText}>
                <Text style={styles.areaName}>{area}</Text>
                <Text style={styles.areaSub}>Hyderabad, Telangana</Text>
              </View>
              <Text style={styles.activeTag}>Serving</Text>
            </View>
          ))}
        </View>

        {/* Coming soon card */}
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonIcon}>🚀</Text>
          <View style={styles.comingSoonText}>
            <Text style={styles.comingSoonTitle}>Expanding Soon</Text>
            <Text style={styles.comingSoonDesc}>
              Expanding to Bangalore & Chennai in 2027. Stay tuned for updates!
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>{"Don't see your area?"}</Text>
          <Text style={styles.ctaDesc}>
            We may still be able to help. Reach out and let us know your location.
          </Text>
          <Pressable
            onPress={() => router.push('Support')}
            style={({ pressed }: { pressed: boolean }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
          >
            <Text style={styles.ctaButtonText}>Let Us Know</Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />
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
    gap: spacing.xl,
    paddingBottom: 40,
  },
  intro: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 24,
  },
  areaList: {
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  areaItemLast: {
    borderBottomWidth: 0,
  },
  pin: {
    fontSize: 18,
  },
  areaText: {
    flex: 1,
    gap: 2,
  },
  areaName: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  areaSub: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  activeTag: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: '#15803d',
    fontWeight: '600',
    backgroundColor: '#dcfce7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.round,
    overflow: 'hidden',
  },
  comingSoonCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comingSoonIcon: {
    fontSize: 28,
  },
  comingSoonText: {
    flex: 1,
    gap: spacing.xs,
  },
  comingSoonTitle: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '700',
  },
  comingSoonDesc: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 20,
  },
  ctaCard: {
    backgroundColor: colors.darkText,
    borderRadius: radii.md,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.md,
  },
  ctaTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.white,
    fontWeight: '700',
  },
  ctaDesc: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radii.sm,
    marginTop: spacing.xs,
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaButtonText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '700',
  },
  spacer: {
    height: 20,
  },
})
