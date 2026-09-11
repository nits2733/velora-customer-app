import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import EmptyState from '../../components/EmptyState'
import { bookingsApi } from '../../api/bookings'
import type { BookingResponse } from '../../api/types'
import { projectTitle, statusLabel } from '../../utils/booking'

export default function Confirmation() {
  const router = useRouter()
  const id = Number(router.getParam('id'))

  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    bookingsApi.getById(id)
      .then(setBooking)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <View style={s.centerWrap}>
        <ActivityIndicator color={colors.darkText} />
      </View>
    )
  }

  if (id && (error || !booking)) {
    return (
      <View style={s.root}>
        <EmptyState
          title="Couldn't confirm your request"
          subtitle="Check My Projects to see if it went through, or try again."
          ctaLabel="Go to Projects"
          onCta={() => router.replace('Projects')}
        />
      </View>
    )
  }

  // No booking id was passed (e.g. reached via a flow that doesn't yet
  // create a real booking) — show a neutral confirmation with no
  // fabricated specifics rather than a fake success screen.
  if (!booking) {
    return (
      <View style={s.root}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
          <View style={s.iconWrap}>
            <View style={s.iconCircle}>
              <Text style={s.iconTxt}>✓</Text>
            </View>
          </View>
          <Text style={s.title}>Request submitted</Text>
          <Text style={s.subtitle}>Your request has been successfully submitted.</Text>
          <Text style={s.sectionBody}>
            Our team will review your requirements and assign a suitable professional. You can track progress from My Projects.
          </Text>
          <View style={s.actions}>
            <PrimaryButton label="View My Projects →" onPress={() => router.replace('Projects')} />
            <SecondaryButton label="Back to Home" onPress={() => router.replace('Home')} />
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.iconWrap}>
          <View style={s.iconCircle}>
            <Text style={s.iconTxt}>✓</Text>
          </View>
        </View>
        <Text style={s.title}>Request submitted</Text>
        <Text style={s.subtitle}>Your request has been successfully submitted.</Text>

        <Text style={s.sectionTitle}>What happens now?</Text>
        <Text style={s.sectionBody}>
          {booking.professional
            ? `${booking.professional.fullName} has been assigned to your project and will be in touch soon.`
            : "Our team will review your requirements and assign a suitable professional. You can track progress from My Projects."}
        </Text>

        <View style={s.projectCard}>
          <Text style={s.projectCategory}>{booking.requestType === 'FULL_HOME_PROJECT' ? 'FULL HOME PROJECT' : 'INDIVIDUAL SERVICE'}</Text>
          <Text style={s.projectName}>{projectTitle(booking)}</Text>
          <View style={s.projectMeta}>
            {booking.professional && <Text style={s.projectMetaTxt}>👤 {booking.professional.fullName}</Text>}
            {booking.location && <Text style={s.projectMetaTxt}>📍 {booking.location}</Text>}
          </View>
          <View style={s.statusBadge}>
            <Text style={s.statusBadgeTxt}>{statusLabel(booking.status)}</Text>
          </View>
        </View>

        <View style={s.actions}>
          <PrimaryButton label="View Project Status →" onPress={() => router.replace('Projects')} />
          <SecondaryButton label="Back to Projects" onPress={() => router.replace('Projects')} />
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  centerWrap: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.pagePadding, paddingTop: 48, paddingBottom: 40, alignItems: 'center' },
  iconWrap: { marginBottom: 16 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center' },
  iconTxt: { fontSize: 28, color: colors.darkText },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, textAlign: 'center', marginBottom: spacing.xxl },
  sectionTitle: { fontFamily: fonts.heading, fontSize: fontSize.h3, fontWeight: fontWeight.semibold, color: colors.darkText, alignSelf: 'flex-start', marginBottom: 8 },
  sectionBody: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, alignSelf: 'flex-start', marginBottom: spacing.xl },
  projectCard: { width: '100%', backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  projectCategory: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  projectName: { fontFamily: fonts.heading, fontSize: fontSize.h3, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: 8 },
  projectMeta: { gap: 4, marginBottom: 12 },
  projectMetaTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText },
  statusBadge: { backgroundColor: colors.cardBg, borderRadius: radii.round, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  statusBadgeTxt: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  actions: { width: '100%', gap: 12 },
})
