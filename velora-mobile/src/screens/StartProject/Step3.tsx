import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { TIMELINE_OPTIONS } from '../../utils/booking'
import type { BookingTimeline } from '../../api/types'

const budgets = ['Below ₹8L', '₹8L–₹15L', '₹15L–₹30L', '₹30L–₹50L', 'Above ₹50L', 'Need guidance']
const budgetFlexibilityOptions = ['Firm ceiling', 'Some flexibility for priorities', 'Still evaluating']
const readinessOptions = ['Ready for a site visit', 'Awaiting possession', 'Comparing possibilities']
const priorityOptions = ['Stay within budget', 'Finish by a fixed date', 'Premium finish & longevity', 'Low-maintenance living']

export default function Step3() {
  const router = useRouter()
  const propertyType = router.getParam('propertyType') || ''
  const bedrooms = router.getParam('bedrooms') || ''
  const area = router.getParam('area') || ''
  const location = router.getParam('location') || ''
  const propertyCondition = router.getParam('propertyCondition') || ''
  const household = router.getParam('household') || ''
  const visionBrief = router.getParam('visionBrief') || ''
  const visionImageUri = router.getParam('visionImageUri') || ''
  const visionGoals = router.getParam('visionGoals') || []
  const visionBudget = router.getParam('visionBudget') || ''
  const scope = router.getParam('scope') || ''
  const style = router.getParam('style') || ''
  const rooms = router.getParam('rooms') || []
  const workTypes = router.getParam('workTypes') || []
  const priorities = router.getParam('priorities') || ''

  const [budget, setBudget] = useState(router.getParam('budget') || visionBudget || '')
  const [budgetFlexibility, setBudgetFlexibility] = useState(router.getParam('budgetFlexibility') || '')
  const [timeline, setTimeline] = useState<BookingTimeline>(router.getParam('timeline') || 'ONE_TO_THREE_MONTHS')
  const [readiness, setReadiness] = useState(router.getParam('readiness') || '')
  const [possessionDate, setPossessionDate] = useState(router.getParam('possessionDate') || '')
  const [decisionPriority, setDecisionPriority] = useState(router.getParam('decisionPriority') || '')
  const [notes, setNotes] = useState(router.getParam('notes') || '')

  useEffect(() => {
    router.updateParams({ budget, budgetFlexibility, timeline, readiness, possessionDate, decisionPriority, notes })
  }, [budget, budgetFlexibility, timeline, readiness, possessionDate, decisionPriority, notes])

  const needsPossessionDate = readiness === 'Awaiting possession'
  const canContinue = Boolean(
    budget
    && budgetFlexibility
    && timeline
    && readiness
    && decisionPriority
    && (!needsPossessionDate || possessionDate.trim())
  )

  const handleReview = () => {
    if (!canContinue) return
    router.push('StartProject_Review', {
      propertyType, bedrooms, area, location, propertyCondition, household,
      visionBrief, visionImageUri, visionGoals, visionBudget,
      scope, style, rooms, workTypes, priorities,
      budget, budgetFlexibility, timeline, readiness,
      possessionDate: possessionDate.trim(), decisionPriority, notes: notes.trim(),
    })
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backTxt}>←</Text></Pressable>
        <Text style={s.headerTitle}>Start a Project</Text>
      </View>
      <View style={s.progress}>
        <View style={s.progressBar}><View style={[s.progressFill, { width: '75%' }]} /></View>
        <Text style={s.progressTxt}>STEP 3 OF 4 · 75%</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text style={s.eyebrow}>INVESTMENT & EXPECTATIONS</Text>
        <Text style={s.title}>Let's align on what success looks like.</Text>
        <Text style={s.subtitle}>Honest ranges help us recommend a realistic approach before the first site visit.</Text>

        <Text style={s.fieldLabel}>What total investment range are you planning?</Text>
        <Text style={s.helper}>Include interiors, materials, furniture, and execution where applicable.</Text>
        <View style={s.chips}>
          {budgets.map(b => (
            <Pressable key={b} style={[s.chip, budget === b && s.chipActive]} onPress={() => setBudget(b)}>
              <Text style={[s.chipTxt, budget === b && s.chipTxtActive]}>{b}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>How fixed is that budget?</Text>
        <View style={s.chips}>
          {budgetFlexibilityOptions.map(option => (
            <Pressable key={option} style={[s.chip, budgetFlexibility === option && s.chipActive]} onPress={() => setBudgetFlexibility(option)}>
              <Text style={[s.chipTxt, budgetFlexibility === option && s.chipTxtActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>When would you like the work completed?</Text>
        <View style={s.timelineChips}>
          {TIMELINE_OPTIONS.map(opt => (
            <Pressable key={opt.value} style={[s.timeChip, timeline === opt.value && s.chipActive]} onPress={() => setTimeline(opt.value)}>
              <Text style={[s.chipTxt, timeline === opt.value && s.chipTxtActive]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>How ready is the property and your decision?</Text>
        <View style={s.chips}>
          {readinessOptions.map(option => (
            <Pressable key={option} style={[s.chip, readiness === option && s.chipActive]} onPress={() => setReadiness(option)}>
              <Text style={[s.chipTxt, readiness === option && s.chipTxtActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        {needsPossessionDate && (
          <View>
            <Text style={s.fieldLabel}>When do you expect possession?</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. March 2027"
              placeholderTextColor={colors.mutedText}
              value={possessionDate}
              onChangeText={setPossessionDate}
            />
          </View>
        )}

        <Text style={s.fieldLabel}>If trade-offs arise, what should we protect first?</Text>
        <View style={s.chips}>
          {priorityOptions.map(option => (
            <Pressable key={option} style={[s.chip, decisionPriority === option && s.chipActive]} onPress={() => setDecisionPriority(option)}>
              <Text style={[s.chipTxt, decisionPriority === option && s.chipTxtActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>What should your designer know before calling?</Text>
        <TextInput
          style={s.textarea}
          multiline
          numberOfLines={4}
          placeholder="Pets, accessibility, vastu, work-from-home needs, items to retain, deadlines, or building restrictions"
          placeholderTextColor={colors.mutedText}
          value={notes}
          onChangeText={setNotes}
        />

        <View style={s.actions}>
          {!canContinue && <Text style={s.requiredHint}>Complete each choice to build an accurate consultation brief.</Text>}
          <PrimaryButton label="Review consultation brief" onPress={handleReview} disabled={!canContinue} />
          <SecondaryButton label="Back" onPress={() => router.back()} />
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
  eyebrow: { fontFamily: fonts.body, fontSize: fontSize.tiny, color: colors.accent, letterSpacing: 0.8, marginTop: spacing.xl, fontWeight: fontWeight.semibold },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: fontWeight.semibold, color: colors.darkText, marginTop: spacing.sm, marginBottom: 8, lineHeight: 36 },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: spacing.xxl },
  fieldLabel: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: spacing.sm, marginTop: spacing.lg },
  helper: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, lineHeight: 18, marginTop: -4, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  chipTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText },
  chipTxtActive: { color: colors.white },
  timelineChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { flex: 1, minWidth: '30%', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 12, fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, backgroundColor: colors.white },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 12, fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, height: 100, textAlignVertical: 'top' },
  actions: { marginTop: spacing.xxl, gap: 12 },
  requiredHint: { fontFamily: fonts.body, fontSize: fontSize.caption, color: colors.mutedText, textAlign: 'center' },
})
