import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import { useAuth } from '../../context/AuthContext'
import PrimaryButton from '../../components/PrimaryButton'
import { bookingsApi } from '../../api/bookings'
import { ApiError } from '../../api/client'
import type { BookingTimeline } from '../../api/types'
import { computeScheduledAt, timelineLabel } from '../../utils/booking'

const BUDGET_RANGES: Record<string, [number | undefined, number | undefined]> = {
  'Under ₹8L': [undefined, 800000],
  '₹8L–₹15L': [800000, 1500000],
  '₹15L–₹30L': [1500000, 3000000],
  '₹30L–₹50L': [3000000, 5000000],
  '₹50L+': [5000000, undefined],
  "I'm not sure yet": [undefined, undefined],
}

const STYLE_VALUES: Record<string, string> = {
  'Warm & Cozy': 'WARM_CONTEMPORARY',
  'Simple & Clean': 'MINIMAL',
  'Modern & Elegant': 'MODERN',
  'Classic & Timeless': 'CLASSIC',
  'Colourful & Expressive': 'ECLECTIC',
  'Not Sure Yet': 'UNDECIDED',
}

export default function ReviewRequest() {
  const router = useRouter()
  const auth = useAuth()

  const propertyType = String(router.getParam('propertyType') || '')
  const bedrooms = String(router.getParam('bedrooms') || '')
  const area = String(router.getParam('area') || '')
  const location = String(router.getParam('location') || '')
  const propertyCondition = String(router.getParam('propertyCondition') || '')
  const visionBrief = String(router.getParam('visionBrief') || '')
  const visionImageUri = String(router.getParam('visionImageUri') || '')
  const visionGoals: string[] = router.getParam('visionGoals') || []
  const scope = String(router.getParam('scope') || '')
  const style = String(router.getParam('style') || '')
  const rooms: string[] = router.getParam('rooms') || []
  const workTypes: string[] = router.getParam('workTypes') || []
  const budget = String(router.getParam('budget') || '')
  const budgetFlexibility = String(router.getParam('budgetFlexibility') || '')
  const timeline = (router.getParam('timeline') || 'ONE_TO_THREE_MONTHS') as BookingTimeline
  const startPreference = String(router.getParam('startPreference') || '')
  const possessionDate = String(router.getParam('possessionDate') || '')
  const decisionPriority = String(router.getParam('decisionPriority') || '')
  const notes = String(router.getParam('notes') || '')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const summarySections = [
    {
      title: 'Your Home',
      route: 'StartProject' as const,
      rows: [
        { label: 'Home', value: [bedrooms, propertyType].filter(Boolean).join(' ') },
        { label: 'Location', value: location },
        { label: 'Property Status', value: propertyCondition },
        { label: 'Possession Expected', value: possessionDate },
        { label: 'Approximate Area', value: area ? `${area} sq ft` : '' },
      ].filter(row => row.value),
    },
    {
      title: 'Your Project',
      route: 'StartProject_Step2' as const,
      rows: [
        { label: 'What You Need', value: scope },
        { label: 'Spaces', value: rooms.join(' · ') },
        { label: 'Work', value: workTypes.join(' · ') },
        { label: 'Design Preference', value: style },
        { label: 'Additional Notes', value: notes },
      ].filter(row => row.value),
    },
    {
      title: 'Budget & Timeline',
      route: 'StartProject_Step3' as const,
      rows: [
        { label: 'Budget', value: budget },
        { label: 'Budget Flexibility', value: budgetFlexibility },
        { label: 'Start Timeline', value: startPreference || timelineLabel(timeline) },
        { label: 'Priority', value: decisionPriority },
      ].filter(row => row.value),
    },
  ]

  const handleSubmit = async () => {
    if (!auth.isAuthenticated) {
      // Carry the whole review-request route (name + all entered fields) so
      // that after login/OTP verification the user lands back here with
      // everything intact, instead of being dropped on Home to start over.
      router.push('Login', { returnTo: 'StartProject_Review', returnParams: router.currentRoute.params })
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const composedNotes = [
        propertyType && `Property: ${[propertyType, bedrooms].filter(Boolean).join(', ')}`,
        propertyCondition && `Property stage: ${propertyCondition}`,
        possessionDate && `Expected possession: ${possessionDate}`,
        area && `Area: ${area} sq ft`,
        scope && `Help requested: ${scope}`,
        rooms.length > 0 && `Spaces: ${rooms.join(', ')}`,
        workTypes.length > 0 && `Work requested: ${workTypes.join(', ')}`,
        budgetFlexibility && `Budget flexibility: ${budgetFlexibility}`,
        startPreference && `Preferred start: ${startPreference}`,
        decisionPriority && `Top priority: ${decisionPriority}`,
        visionBrief && `Vision Studio concept: ${visionBrief}`,
        visionGoals.length > 0 && `Vision goals: ${visionGoals.join(', ')}`,
        visionImageUri && `Room reference image attached in app: ${visionImageUri}`,
        notes && `Notes: ${notes}`,
      ].filter(Boolean).join('\n')

      const [budgetMin, budgetMax] = BUDGET_RANGES[budget] || [undefined, undefined]

      const booking = await bookingsApi.create({
        requestType: 'FULL_HOME_PROJECT',
        scheduledAt: computeScheduledAt(timeline),
        preferredTimeline: timeline,
        location: location || undefined,
        preferredStyle: STYLE_VALUES[style] || style || undefined,
        budgetMin,
        budgetMax,
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
        <Text style={s.title}>Here&apos;s what we understood.</Text>
        <Text style={s.subtitle}>Is everything correct? You can edit any section before submitting.</Text>

        {summarySections.map(section => (
          <View key={section.title} style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>{section.title}</Text>
              <Pressable onPress={() => router.push(section.route, router.currentRoute.params)} hitSlop={8}>
                <Text style={s.editText}>Edit</Text>
              </Pressable>
            </View>
            {section.rows.map(row => (
              <View key={row.label} style={s.summaryRow}>
                <View style={s.summaryInfo}>
                  <Text style={s.summaryLabel}>{row.label}</Text>
                  <Text style={s.summaryValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Contact Details</Text>
            {auth.user && (
              <Pressable onPress={() => router.push('Profile')} hitSlop={8}>
                <Text style={s.editText}>Edit</Text>
              </Pressable>
            )}
          </View>
          {auth.user ? (
            <>
              <View style={s.summaryRow}>
                <View style={s.summaryInfo}>
                  <Text style={s.summaryLabel}>Name</Text>
                  <Text style={s.summaryValue}>{auth.user.fullName}</Text>
                </View>
              </View>
              <View style={s.summaryRow}>
                <View style={s.summaryInfo}>
                  <Text style={s.summaryLabel}>Email</Text>
                  <Text style={s.summaryValue}>{auth.user.email}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={s.contactHint}>You&apos;ll sign in to confirm your contact details when you submit.</Text>
          )}
        </View>

        <View style={s.nextSection}>
          <Text style={s.cardTitle}>What happens next?</Text>
          <View style={s.stepRow}>
            <View style={[s.stepDot, s.stepDotActive]} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>1 — We review your project</Text>
              <Text style={s.stepDesc}>Our team reviews your requirements.</Text>
            </View>
          </View>
          <View style={s.stepRow}>
            <View style={s.stepDot} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>2 — We connect you with a professional</Text>
              <Text style={s.stepDesc}>We match your project with a suitable professional.</Text>
            </View>
          </View>
          <View style={s.stepRow}>
            <View style={s.stepDot} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>3 — Consultation & site visit</Text>
              <Text style={s.stepDesc}>The professional understands your space and requirements.</Text>
            </View>
          </View>
          <View style={s.stepRow}>
            <View style={s.stepDot} />
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>4 — Design & quotation</Text>
              <Text style={s.stepDesc}>You receive the proposed design and quotation.</Text>
            </View>
          </View>
        </View>

        <View style={s.actions}>
          <Text style={s.readyTitle}>Ready to get started?</Text>
          <Text style={s.readyText}>We&apos;ll review your requirements and connect you with a suitable Velora professional.</Text>
          {error ? <Text style={s.errorText}>{error}</Text> : null}
          <PrimaryButton
            label={submitting ? 'Submitting…' : 'Submit Request'}
            onPress={handleSubmit}
            disabled={submitting}
          />
          <Text style={s.disclaimer}>After submitting, we&apos;ll review your project and contact you to schedule the next step.</Text>
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
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40, gap: spacing.md },
  title: { fontFamily: fonts.heading, fontSize: 28, lineHeight: 35, fontWeight: fontWeight.semibold, color: colors.darkText, marginTop: spacing.xl },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginTop: 4, marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.lg, ...shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: fontWeight.semibold },
  editText: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.accent, fontWeight: fontWeight.semibold },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginBottom: 2 },
  summaryValue: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText },
  contactHint: { fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 20, color: colors.mutedText },
  nextSection: { paddingVertical: spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, gap: 12 },
  stepDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.border, marginTop: 2 },
  stepDotActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  stepContent: { flex: 1 },
  stepTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 2 },
  actions: { marginTop: spacing.xxl, gap: spacing.sm },
  readyTitle: { fontFamily: fonts.heading, fontSize: fontSize.h3, color: colors.darkText, fontWeight: fontWeight.semibold, textAlign: 'center' },
  readyText: { fontFamily: fonts.body, fontSize: fontSize.label, lineHeight: 21, color: colors.mutedText, textAlign: 'center', marginBottom: spacing.sm },
  errorText: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.error, textAlign: 'center' },
  disclaimer: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'center', marginTop: 8 },
})
