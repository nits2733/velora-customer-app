import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing, radii } from '../../theme/tokens'
import { useRouter } from '../../navigation/router'
import AppHeader from '../../components/AppHeader'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'

const scopeOptions = [
  'Design and end-to-end execution',
  'Design with contractor coordination',
  'Fixed interiors and storage',
  'Furnishing and styling only',
]
const styleOptions = ['Warm contemporary', 'Clean minimal', 'Modern Indian', 'Classic / traditional', 'Bold and eclectic', 'Help me discover']
const roomOptions = ['Foyer', 'Living Room', 'Dining', 'Kitchen', 'Primary Bedroom', 'Kids Room', 'Guest Bedroom', 'Study', 'Bathrooms', 'Balcony']
const workOptions = ['Space planning', 'Civil changes', 'Modular kitchen', 'Wardrobes & storage', 'Lighting & electrical', 'False ceiling', 'Furniture', 'Paint & wall finishes', 'Soft furnishings']

const TOTAL_STEPS = 4
const CURRENT_STEP = 2

export default function Step2() {
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

  const presetScope = router.getParam('presetScope') || ''
  const presetStyle = router.getParam('presetStyle') || ''

  const [scope, setScope] = useState(router.getParam('scope') || presetScope)
  const [style, setStyle] = useState(router.getParam('style') || presetStyle)
  const [rooms, setRooms] = useState<string[]>(router.getParam('rooms') || [])
  const [workTypes, setWorkTypes] = useState<string[]>(router.getParam('workTypes') || [])
  const [priorities, setPriorities] = useState(router.getParam('priorities') || '')

  useEffect(() => {
    router.updateParams({ scope, style, rooms, workTypes, priorities })
  }, [scope, style, rooms, workTypes, priorities])

  const scopeChoices = presetScope && !scopeOptions.includes(presetScope)
    ? [presetScope, ...scopeOptions]
    : scopeOptions
  const styleChoices = presetStyle && !styleOptions.includes(presetStyle)
    ? [presetStyle, ...styleOptions]
    : styleOptions

  const canContinue = Boolean(scope && style && rooms.length > 0 && workTypes.length > 0)

  const toggleSelection = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const handleContinue = () => {
    if (!canContinue) return
    router.push('StartProject_Step3', {
      propertyType,
      bedrooms,
      area,
      location,
      propertyCondition,
      household,
      visionBrief,
      visionImageUri,
      visionGoals,
      visionBudget,
      scope,
      style,
      rooms,
      workTypes,
      priorities: priorities.trim(),
    })
  }

  return (
    <View style={styles.root}>
      <AppHeader title="Start a Project" showBack onBack={router.back} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress bar */}
        <View style={styles.progressWrap}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSegment, i < CURRENT_STEP && styles.progressSegmentFilled]}
            />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 2 OF 4 · SCOPE & STYLE</Text>
        <Text style={styles.title}>What should change, and how far should we take it?</Text>
        <Text style={styles.subtitle}>Select the details you would discuss in a first design consultation.</Text>

        <Text style={styles.fieldLabel}>What level of support do you expect from Velora?</Text>
        <View style={styles.chipRow}>
          {scopeChoices.map(s => (
            <Pressable
              key={s}
              onPress={() => setScope(s)}
              style={[styles.chip, scope === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, scope === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.fieldHeadingRow}>
          <Text style={styles.fieldLabel}>Which spaces need attention?</Text>
          {rooms.length > 0 && <Text style={styles.count}>{rooms.length} selected</Text>}
        </View>
        <View style={styles.chipRow}>
          {roomOptions.map(room => (
            <Pressable
              key={room}
              onPress={() => toggleSelection(room, setRooms)}
              style={[styles.chip, rooms.includes(room) && styles.chipActive]}
            >
              <Text style={[styles.chipText, rooms.includes(room) && styles.chipTextActive]}>{rooms.includes(room) ? '✓ ' : ''}{room}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.fieldHeadingRow}>
          <Text style={styles.fieldLabel}>What work do you already know you need?</Text>
          {workTypes.length > 0 && <Text style={styles.count}>{workTypes.length} selected</Text>}
        </View>
        <View style={styles.chipRow}>
          {workOptions.map(work => (
            <Pressable
              key={work}
              onPress={() => toggleSelection(work, setWorkTypes)}
              style={[styles.chip, workTypes.includes(work) && styles.chipActive]}
            >
              <Text style={[styles.chipText, workTypes.includes(work) && styles.chipTextActive]}>{workTypes.includes(work) ? '✓ ' : ''}{work}</Text>
            </Pressable>
          ))}
        </View>

        {workTypes.includes('Civil changes') && (
          <View style={styles.contextNote}>
            <Text style={styles.contextTitle}>Structural work noted</Text>
            <Text style={styles.contextText}>We will review feasibility, building permissions, and site constraints during consultation.</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>Which design direction feels closest?</Text>
        <View style={styles.chipRow}>
          {styleChoices.map(option => (
            <Pressable
              key={option}
              onPress={() => setStyle(option)}
              style={[styles.chip, style === option && styles.chipActive]}
            >
              <Text style={[styles.chipText, style === option && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>

        <InputField
          label="What are your non-negotiables? (optional)"
          placeholder="e.g. more concealed storage, easy-clean finishes, a larger dining area"
          value={priorities}
          onChangeText={setPriorities}
          multiline
          numberOfLines={3}
        />

        <View style={styles.ctaWrap}>
          {!canContinue && <Text style={styles.requiredHint}>Choose a service level, space, work type, and style direction.</Text>}
          <PrimaryButton label="Continue to budget & timing" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.xl,
  },
  progressWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: radii.round,
    backgroundColor: colors.border,
  },
  progressSegmentFilled: {
    backgroundColor: colors.darkText,
  },
  stepLabel: {
    fontSize: fontSize.tiny,
    fontFamily: fonts.body,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: fontSize.label,
    lineHeight: 21,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginTop: -spacing.md,
  },
  fieldLabel: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '600',
    marginBottom: -spacing.sm,
  },
  fieldHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.accent,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.round,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.darkText,
    borderColor: colors.darkText,
  },
  chipText: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.darkText,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.white,
  },
  contextNote: {
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    backgroundColor: colors.cardBg2,
    borderRadius: radii.md,
  },
  contextTitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    fontWeight: '600',
    color: colors.darkText,
  },
  contextText: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    lineHeight: 18,
    color: colors.mutedText,
  },
  ctaWrap: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  requiredHint: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.mutedText,
    textAlign: 'center',
  },
})
