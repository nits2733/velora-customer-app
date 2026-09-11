import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useAuth } from '../context/AuthContext'
import AppHeader from '../components/AppHeader'
import InputField from '../components/InputField'
import Chip from '../components/Chip'
import PrimaryButton from '../components/PrimaryButton'
import { bookingsApi } from '../api/bookings'
import { ApiError } from '../api/client'
import type { BookingTimeline } from '../api/types'
import { TIMELINE_OPTIONS, computeScheduledAt } from '../utils/booking'

function getParam(router: ReturnType<typeof useRouter>, key: string): string {
  const v = router.getParam(key)
  return typeof v === 'string' ? v : ''
}

export default function ServiceRequestScreen() {
  const router = useRouter()
  const auth = useAuth()

  const categoryId = Number(router.getParam('categoryId')) || undefined
  const serviceName = getParam(router, 'name') || 'Service'
  const selectedOption = getParam(router, 'selectedOption')
  const priceRange = getParam(router, 'priceRange')

  const [location, setLocation] = useState('')
  const [timeline, setTimeline] = useState<BookingTimeline>('ASAP')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!auth.isAuthenticated) {
      router.push('Login', {
        returnTo: 'ServiceRequest',
        returnParams: router.currentRoute.params,
      })
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const composedNotes = [
        selectedOption && `Option: ${selectedOption}`,
        notes.trim() && `Requirements: ${notes.trim()}`,
      ].filter(Boolean).join('\n')

      const booking = await bookingsApi.create({
        requestType: 'INDIVIDUAL_SERVICE',
        categoryId,
        scheduledAt: computeScheduledAt(timeline),
        preferredTimeline: timeline,
        location: location.trim() || undefined,
        notes: composedNotes || undefined,
      })
      router.replace('Confirmation', { id: booking.id })
    } catch (e) {
      setError(e instanceof ApiError && e.status === 401
        ? 'Please log in to send this request.'
        : 'Something went wrong sending your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={s.root}>
      <AppHeader title="Service Request" showBack onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Summary of what's being requested */}
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>REQUESTING</Text>
          <Text style={s.summaryName}>{serviceName}</Text>
          {selectedOption && <Text style={s.summaryOption}>{selectedOption}</Text>}
          {priceRange && <Text style={s.summaryPrice}>Estimated: {priceRange}</Text>}
        </View>

        {/* Location */}
        <View style={s.section}>
          <InputField
            label="Location / Address"
            placeholder="Enter your full address"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Preferred timeline */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Preferred Timeline</Text>
          <View style={s.chipRow}>
            {TIMELINE_OPTIONS.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={timeline === opt.value}
                onPress={() => setTimeline(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Requirements */}
        <View style={s.section}>
          <InputField
            label="Requirements"
            placeholder="Describe what you need, size/scope, and anything else the professional should know..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit */}
        <View style={s.submitSection}>
          {error ? <Text style={s.errorText}>{error}</Text> : null}
          <PrimaryButton
            label={submitting ? 'Sending…' : 'Submit Request'}
            onPress={handleSubmit}
            disabled={submitting}
          />
          <Text style={s.disclaimer}>
            Our team will review your request and assign a suitable professional. No payment is required at this stage.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.section, gap: spacing.xl },
  summaryCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  summaryLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.mutedText, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: fontWeight.medium },
  summaryName: { fontFamily: fonts.heading, fontSize: fontSize.h4, color: colors.darkText, fontWeight: fontWeight.bold, marginTop: 4 },
  summaryOption: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, fontWeight: fontWeight.medium },
  summaryPrice: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 4 },
  section: { gap: spacing.md },
  sectionTitle: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  submitSection: { gap: spacing.md, marginTop: spacing.sm },
  disclaimer: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
  errorText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.error,
    textAlign: 'center',
  },
})
