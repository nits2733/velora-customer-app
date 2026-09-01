import React from 'react'
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight, shadows } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import PrimaryButton from '../../components/PrimaryButton'

export default function ReviewRequest() {
  const router = useRouter()
  const budget = router.getParam('budget') || '₹10L–₹25L'
  const timeline = router.getParam('timeline') || '1–3 months'

  const summaryRows = [
    { label: 'Project', value: '3 BHK Home Interior', icon: '✏️' },
    { label: 'Property / Location', value: 'Apartment · Hyderabad', icon: '✏️' },
    { label: 'Area / Scope', value: '1,650 sq ft · Full Home', icon: '✏️' },
    { label: 'Style Preference', value: 'Modern – Warm Minimal', icon: '✏️' },
    { label: 'Budget / Timeline', value: `${budget} · ${timeline}`, icon: '✏️' },
  ]

  const nextSteps = [
    { title: 'Request submitted', desc: 'You send your project details to Velora.' },
    { title: 'Velora contacts Rahul', desc: "We'll share your requirements with Rahul and check his availability.", dimmed: false },
    { title: "Rahul responds", desc: "We'll notify you when Rahul accepts or declines your request.", dimmed: true },
  ]

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
            <Text style={s.cardTitle}>YOUR ASSIGNED PROFESSIONAL</Text>
          </View>
          <View style={s.proRow}>
            <View style={s.proAvatar}><Text style={s.proAvatarTxt}>RS</Text></View>
            <View style={s.proInfo}>
              <Text style={s.proName}>Rahul Sharma</Text>
              <Text style={s.proRole}>Interior Designer</Text>
            </View>
            <View style={s.proMeta}>
              <Text style={s.proBadge}>★ 4.8</Text>
              <Text style={s.proCity}>Hyderabad</Text>
            </View>
          </View>
        </View>

        <View style={[s.card, { marginTop: 16 }]}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>PROJECT SUMMARY</Text>
            <Pressable><Text style={s.editAll}>Edit all</Text></Pressable>
          </View>
          {summaryRows.map((row) => (
            <View key={row.label} style={s.summaryRow}>
              <View style={s.summaryInfo}>
                <Text style={s.summaryLabel}>{row.label}</Text>
                <Text style={s.summaryValue}>{row.value}</Text>
              </View>
              <Text style={s.editIcon}>{row.icon}</Text>
            </View>
          ))}
        </View>

        <View style={[s.card, { marginTop: 16 }]}>
          <Text style={s.cardTitle}>What happens next?</Text>
          {nextSteps.map((step, i) => (
            <View key={i} style={s.stepRow}>
              <View style={[s.stepDot, i === 0 && s.stepDotActive]} />
              <View style={s.stepContent}>
                <Text style={[s.stepTitle, step.dimmed && s.dimmed]}>{i + 1}. {step.title}</Text>
                <Text style={[s.stepDesc, step.dimmed && s.dimmed]}>{step.desc}</Text>
              </View>
            </View>
          ))}
          <Text style={s.noteText}>You won't need to contact Rahul directly. Velora will handle the introduction.</Text>
        </View>

        <View style={s.actions}>
          <PrimaryButton label="Send Request to Rahul" onPress={() => router.push('StartProject_Confirmation')} />
          <Text style={s.disclaimer}>Velora will contact Rahul on your behalf</Text>
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
  editAll: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, textDecorationLine: 'underline' },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  proAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center' },
  proAvatarTxt: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText },
  proInfo: { flex: 1 },
  proName: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText },
  proRole: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  proMeta: { alignItems: 'flex-end' },
  proBadge: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.darkText, fontWeight: fontWeight.semibold },
  proCity: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginBottom: 2 },
  summaryValue: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText },
  editIcon: { fontSize: 14, color: colors.mutedText, marginLeft: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, gap: 12 },
  stepDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.border, marginTop: 2 },
  stepDotActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  stepContent: { flex: 1 },
  stepTitle: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText },
  stepDesc: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 2 },
  dimmed: { opacity: 0.4 },
  noteText: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, marginTop: 12, fontStyle: 'italic' },
  actions: { marginTop: spacing.xxl },
  disclaimer: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'center', marginTop: 8 },
})
