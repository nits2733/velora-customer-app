import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native'
import { colors, fonts, fontSize, spacing, radii, fontWeight } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

const budgets = ['Below ₹5L', '₹5L–₹10L', '₹10L–₹25L', 'Above ₹25L', 'Not sure']
const timelines = ['As soon as possible', '1–3 months', '3–6 months', '6+ months']

export default function Step3() {
  const router = useRouter()
  const propertyType = router.getParam('propertyType') || ''
  const bedrooms = router.getParam('bedrooms') || ''
  const area = router.getParam('area') || ''
  const location = router.getParam('location') || ''
  const scope = router.getParam('scope') || ''
  const style = router.getParam('style') || ''
  const rooms = router.getParam('rooms') || []

  const [budget, setBudget] = useState('₹10L–₹25L')
  const [timeline, setTimeline] = useState('1–3 months')
  const [notes, setNotes] = useState('')

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
        <Text style={s.title}>Set your budget{'\n'}and timeline</Text>
        <Text style={s.subtitle}>Help us understand the scope of your project.</Text>

        <Text style={s.fieldLabel}>Estimated Budget</Text>
        <View style={s.chips}>
          {budgets.map(b => (
            <Pressable key={b} style={[s.chip, budget === b && s.chipActive]} onPress={() => setBudget(b)}>
              <Text style={[s.chipTxt, budget === b && s.chipTxtActive]}>{b}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>Expected Timeline</Text>
        <View style={s.timelineChips}>
          {timelines.map(t => (
            <Pressable key={t} style={[s.timeChip, timeline === t && s.chipActive]} onPress={() => setTimeline(t)}>
              <Text style={[s.chipTxt, timeline === t && s.chipTxtActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.fieldLabel}>Additional Requirements</Text>
        <TextInput
          style={s.textarea}
          multiline
          numberOfLines={4}
          placeholder="Tell us anything else we should know about your project..."
          placeholderTextColor={colors.mutedText}
          value={notes}
          onChangeText={setNotes}
        />

        <View style={s.actions}>
          <PrimaryButton label="Review Request →" onPress={() => router.push('StartProject_Review', {
            propertyType, bedrooms, area, location, scope, style, rooms, budget, timeline, notes,
          })} />
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
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: fontWeight.semibold, color: colors.darkText, marginTop: spacing.xl, marginBottom: 8, lineHeight: 36 },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.mutedText, marginBottom: spacing.xxl },
  fieldLabel: { fontFamily: fonts.body, fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.darkText, marginBottom: spacing.sm, marginTop: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  chipActive: { backgroundColor: colors.darkText, borderColor: colors.darkText },
  chipTxt: { fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText },
  chipTxtActive: { color: colors.white },
  timelineChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { flex: 1, minWidth: '30%', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 12, fontFamily: fonts.body, fontSize: fontSize.label, color: colors.darkText, height: 100, textAlignVertical: 'top' },
  actions: { marginTop: spacing.xxl, gap: 12 },
})
