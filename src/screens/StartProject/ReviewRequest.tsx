import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import { useAuth } from '../../context/AuthContext'
import PrimaryButton from '../../components/PrimaryButton'
import { bookingsApi } from '../../api/bookings'
import { ApiError } from '../../api/client'

const BUDGET_VALUES: Record<string, number | undefined> = {
  'Below ₹5L': 400000,
  '₹5L–₹10L': 750000,
  '₹10L–₹25L': 1750000,
  'Above ₹25L': 3000000,
  'Not sure': undefined,
}

const TIMELINE_DAYS: Record<string, number> = {
  'As soon as possible': 7,
  '1–3 months': 45,
  '3–6 months': 135,
  '6+ months': 210,
}

function computeScheduledAt(timeline: string): string {
  const days = TIMELINE_DAYS[timeline] ?? 45
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export default function ReviewRequest() {
  const router = useRouter()
  const auth = useAuth()

  const propertyType = String(router.getParam('propertyType') || '')
  const bedrooms = String(router.getParam('bedrooms') || '')
  const area = String(router.getParam('area') || '')
  const location = String(router.getParam('location') || '')
  const scope = String(router.getParam('scope') || '')
  const style = String(router.getParam('style') || '')
  const rooms: string[] = router.getParam('rooms') || []
  const budget = String(router.getParam('budget') || '')
  const timeline = String(router.getParam('timeline') || '')
  const notes = String(router.getParam('notes') || '')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const summaryRows = [
    { label: 'Project', value: [propertyType, bedrooms].filter(Boolean).join(' · ') || 'Not specified' },
    { label: 'Location', value: location || 'Not specified' },
    { label: 'Area / Scope', value: [area && `${area} sq ft`, scope].filter(Boolean).join(' · ') || 'Not specified' },
    { label: 'Rooms Included', value: rooms.length > 0 ? rooms.join(', ') : 'Not specified' },
    { label: 'Style Preference', value: style || 'Not specified' },
    { label: 'Budget / Timeline', value: [budget, timeline].filter(Boolean).join(' · ') || 'Not specified' },
  ]

  const handleSubmit = async () => {
    if (!auth.isAuthenticated) {
      router.push('Login')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const composedNotes = [
        propertyType && `Property: ${[propertyType, bedrooms].filter(Boolean).join(', ')}`,
        area && `Area: ${area} sq ft`,
        scope && `Scope: ${scope}`,
        rooms.length > 0 && `Rooms: ${rooms.join(', ')}`,
        notes && `Notes: ${notes}`,
      ].filter(Boolean).join('\n')

      const booking = await bookingsApi.create({
        requestType: 'FULL_HOME_PROJECT',
        scheduledAt: computeScheduledAt(timeline),
        location: location || undefined,
        preferredStyle: style || undefined,
        budget: BUDGET_VALUES[budget],
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
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backTxt}>←</Text></Pressable>
        <Text style={s.headerTitle}>Review Request</Text>
      </View>
      <View style={s.progress}>
        <View style={s.progressBar}><View style={[s.progressFill, { width: '100%' }]} /></View>
        <Text style={s.progressTxt}>STEP 4 OF 4 · 100%</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text style={s.sectionLabel}>Review your request</Text>
        <Text style={s.subtitle}>Please review the details before sending your request to Velora.</Text>

        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>PROJECT SUMMARY</Text>
          </View>
          {summaryRows.map((row) => (
            <View key={row.label} style={s.summaryRow}>
              <View style={s.summaryInfo}>
                <Text style={s.summaryLabel}>{row.label}</Text>
                <Text style={s.summaryValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[s.card, { marginTop: 16 }]}>
          <Text style={s.cardTitle}>What happens next?</Text>
          <View style={s.stepRow}>
            <View style={[s.stepDot, s.stepDotActive]} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>1. Request submitted</Text>
              <Text style={s.stepDesc}>You send your project details to Velora.</Text>
            </View>
          </View>
          <View style={s.stepRow}>
            <View style={s.stepDot} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>2. We match a professional</Text>
              <Text style={s.stepDesc}>Velora reviews your requirements and assigns a suitable professional.</Text>
            </View>
          </View>
          <View style={s.stepRow}>
            <View style={s.stepDot} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>3. Site visit & quotation</Text>
              <Text style={s.stepDesc}>Your assigned professional schedules a visit and shares a quotation.</Text>
            </View>
          </View>
          <Text style={s.noteText}>You'll be notified as soon as a professional is assigned.</Text>
        </View>

        <View style={s.actions}>
          {error ? <Text style={s.errorText}>{error}</Text> : null}
          <PrimaryButton
            label={submitting ? 'Sending…' : 'Send Request'}
            onPress={handleSubmit}
            disabled={submitting}
          />
          <Text style={s.disclaimer}>Velora will review your request and get back to you shortly.</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.pagePadding, paddingTop: 12, paddingBottom: 8 },
  back: { padding: 8, marginRight: 8 },
  backTxt: { fontSize: 20, color: colors.darkText },
  headerTitle: { fontFamily: fonts.body, fontSize: fontSize.label, letterSpacing: 1, color: colors.darkText, fontWeight: fontWeight.semibold, textTransform: 'uppercase' },
  progress: { paddingHorizontal: spacing.pagePadding, paddingBottom: 8 },
  progressBar: { height: 2, backgroundColor: colors.border, borderRadius: 1 },
  progressFill: { height: '100%', backgroundColor: colors.darkText },
  progressTxt: { fontFamily: fonts.body, fontSize: 10, color: colors.mutedText, letterSpacing: 0.5, marginTop: 4 },
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40 },
  sectionLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: spacing.xl },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginTop: 4, marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, ...shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: fontWeight.semibold },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginBottom: 2 },
  summaryValue: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, gap: 12 },
  stepDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.border, marginTop: 2 },
  stepDotActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  stepContent: { flex: 1 },
  stepTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 2 },
  noteText: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 12, fontStyle: 'italic' },
  actions: { marginTop: spacing.xxl, gap: spacing.sm },
  errorText: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.error, textAlign: 'center' },
  disclaimer: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'center', marginTop: 8 },
})
