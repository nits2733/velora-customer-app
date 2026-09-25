import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import type { BookingTimeline } from '../../api/types'

const budgets = ['Under ₹8L', '₹8L–₹15L', '₹15L–₹30L', '₹30L–₹50L', '₹50L+', "I'm not sure yet"]
const budgetFlexibilityOptions = ['I want to stay within this budget', 'I can stretch for the right priorities', "I'm still figuring it out"]
const startOptions: { label: string; timeline: BookingTimeline }[] = [
  { label: 'Immediately', timeline: 'ASAP' },
  { label: 'Within 1 month', timeline: 'WITHIN_1_MONTH' },
  { label: '1–3 months', timeline: 'ONE_TO_THREE_MONTHS' },
  { label: '3+ months', timeline: 'FLEXIBLE' },
  { label: 'Not decided', timeline: 'FLEXIBLE' },
]
const priorityOptions = ['Stay within budget', 'Finish quickly', 'Premium look & quality', 'Easy to maintain', 'Make the most of the space']

export default function Step3() {
  const router = useRouter()
  const propertyType = router.getParam('propertyType') || ''
  const bedrooms = router.getParam('bedrooms') || ''
  const area = router.getParam('area') || ''
  const location = router.getParam('location') || ''
  const propertyCondition = router.getParam('propertyCondition') || ''
  const possessionDate = router.getParam('possessionDate') || ''
  const visionBrief = router.getParam('visionBrief') || ''
  const visionImageUri = router.getParam('visionImageUri') || ''
  const visionGoals = router.getParam('visionGoals') || []
  const visionBudget = router.getParam('visionBudget') || ''
  const scope = router.getParam('scope') || ''
  const style = router.getParam('style') || ''
  const rooms = router.getParam('rooms') || []
  const workTypes = router.getParam('workTypes') || []
  const notes = router.getParam('notes') || ''

  const [budget, setBudget] = useState(router.getParam('budget') || visionBudget || '')
  const [budgetFlexibility, setBudgetFlexibility] = useState(router.getParam('budgetFlexibility') || '')
  const [startPreference, setStartPreference] = useState(router.getParam('startPreference') || '')
  const [decisionPriority, setDecisionPriority] = useState(router.getParam('decisionPriority') || '')

  useEffect(() => {
    router.updateParams({ budget, budgetFlexibility, startPreference, decisionPriority })
  }, [budget, budgetFlexibility, startPreference, decisionPriority])

  const canContinue = Boolean(
    budget
    && budgetFlexibility
    && startPreference
    && decisionPriority
  )

  const handleReview = () => {
    if (!canContinue) return
    const timeline = startOptions.find(option => option.label === startPreference)?.timeline || 'FLEXIBLE'
    router.push('StartProject_Review', {
      propertyType, bedrooms, area, location, propertyCondition, possessionDate,
      visionBrief, visionImageUri, visionGoals, visionBudget,
      scope, style, rooms, workTypes, notes,
      budget, budgetFlexibility, timeline, startPreference, decisionPriority,
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
        <Text style={s.eyebrow}>BUDGET & TIMELINE</Text>
        <Text style={s.title}>A practical starting point.</Text>
        <Text style={s.subtitle}>Approximate answers are enough. You can refine them with your professional later.</Text>

        <Text style={s.fieldLabel}>What budget range are you comfortable with?</Text>
        <View style={s.chips}>
          {budgets.map(b => (
            <Pressable key={b} style={[s.chip, budget === b && s.chipActive]} onPress={() => setBudget(b)}>
              <Text style={[s.chipTxt, budget === b && s.chipTxtActive]}>{b}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>How flexible is your budget?</Text>
        <View style={s.chips}>
          {budgetFlexibilityOptions.map(option => (
            <Pressable key={option} style={[s.chip, budgetFlexibility === option && s.chipActive]} onPress={() => setBudgetFlexibility(option)}>
              <Text style={[s.chipTxt, budgetFlexibility === option && s.chipTxtActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>When would you like to get started?</Text>
        <View style={s.timelineChips}>
          {startOptions.map(option => (
            <Pressable key={option.label} style={[s.timeChip, startPreference === option.label && s.chipActive]} onPress={() => setStartPreference(option.label)}>
              <Text style={[s.chipTxt, startPreference === option.label && s.chipTxtActive]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>If you had to prioritize one thing, what would it be?</Text>
        <View style={s.chips}>
          {priorityOptions.map(option => (
            <Pressable key={option} style={[s.chip, decisionPriority === option && s.chipActive]} onPress={() => setDecisionPriority(option)}>
              <Text style={[s.chipTxt, decisionPriority === option && s.chipTxtActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.actions}>
          {!canContinue && <Text style={s.requiredHint}>Choose a budget, flexibility, start time, and priority.</Text>}
          <PrimaryButton label="Review your request" onPress={handleReview} disabled={!canContinue} />
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
